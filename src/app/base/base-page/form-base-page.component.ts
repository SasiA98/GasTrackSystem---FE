import { Component, Directive, Injector, Input } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Observable, takeUntil } from "rxjs";
import { DetailBasePageComponent } from "./detail-base-page.component";

@Component({
    selector: 'app-form-base-page',
    template: `
      <p>
        base works!
      </p>
    `
  })
export abstract class FormBasePageComponent<M> extends DetailBasePageComponent<M> {

    protected abstract submitComplete(response: any): void;
    /**
     * Metodo invocato dal costruttore per creare il form
     */
    protected abstract createForm(): FormGroup;
    /**
     * Metodo invocato dal metodo onSubmit per modellare il form
     * prima di essere inviato al backend
     * @param form FormGroup da modellare
     */
    protected abstract convertDataToModel(form: FormGroup): M;
    /**
     * Metodo invocato per eseguire l'inserimento del model
     * @param model
     */
    protected abstract save(model: M): Observable<M>;
    /**
     * Metodo invocato per eseguire l'aggiornamento del model
     * @param model
     */
    /**
     * Metodo invocato per eseguire l'aggiornamento del model
     * @param model
     */
    protected abstract update(id: number | string, model: M): Observable<M>;

    protected fb: FormBuilder | undefined;
    form: FormGroup;
    
    constructor(injector: Injector) {
        super(injector);
        this.fb = injector.get(FormBuilder);
        this.form = this.createForm();
    }

    override set model(model: M | undefined) {
        if (model) {
            this._model = this.mapModel(model);
            this.fillForm(model);
        }
    }

    override get model(): M | undefined {
        return this._model;
    }

    fillForm(model: any) {
        this.form?.patchValue(model);
    }

    isFormValid() {
        if (this.form?.invalid) {
            this.form.markAllAsTouched();
            return false;
        }
        return true;
    }

    onSubmit() {
        if (!this.isFormValid() || !this.form) {
            return;
        }
        const model = this.convertDataToModel(this.form);
        let operation;
        if (this.isInsert() || !this.idModel) {
            operation = this.save(model);
        }
        else {
            operation = this.update(this.idModel, model);
        }
        operation.pipe(takeUntil(this.onDestroy$)).subscribe(response => {
            this.submitComplete(response);
        });
    }

    isInsert() {
        return this.model === undefined && this.idModel === undefined;
    }
}