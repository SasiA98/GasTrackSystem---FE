import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn } from "@angular/forms";
import { Subject } from "rxjs";

@Component({
    selector: 'app-base-page',
    template: `
      <p>
        base works!
      </p>
    `
  })
export abstract class SubFormComponent implements OnInit, OnDestroy {

    protected abstract getControlsConfig(): {
        [key: string]: AbstractControl | [string, ValidatorFn[]] | [string];
    };

    protected formBuilder: FormBuilder;
    protected readonly onDestroy$: Subject<boolean>;
    form: FormGroup | undefined;
    subFormFieldName: string | undefined;

    constructor(formBuilder: FormBuilder) {
        this.formBuilder = formBuilder;
        this.onDestroy$ = new Subject();
    }

    ngOnInit() {
        const formObject = this.getControlsConfig();
        this.buildForm(formObject);
    }

    buildForm(formObject: {
        [key: string]: AbstractControl | [string, ValidatorFn[]] | [string];
    }) {
        if (!this.subFormFieldName) {
            const entries = Object.entries(formObject);
            for (const [key, control] of entries) {
                if (control instanceof FormArray || control instanceof FormGroup) {
                    this.form?.addControl(key, control);
                }
                else {
                    let formControl;
                    let validators;
                    if (control instanceof AbstractControl) {
                        formControl = control;
                        validators = [];
                    }
                    else {
                        formControl = control[0];
                        validators = control[1];
                    }
                    this.form?.addControl(key, this.formBuilder.control(formControl, validators));
                }
            }
        }
        else {
            this.form?.addControl(this.subFormFieldName, this.formBuilder.group(formObject));
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}