import { Component } from "@angular/core";
import { Observable, takeUntil } from "rxjs";
import { BasePageComponent } from "./base-page.component";

@Component({
    selector: 'app-detail-base-page',
    template: `
      <p>
        base works!
      </p>
    `
  })
export abstract class DetailBasePageComponent<M> extends BasePageComponent {

    abstract getPathKey(): string;
    abstract getModelById(id: string | number): Observable<M>;

    _model: M | undefined;
    _idModel: any;

    set model(model: M | undefined) {
        this._model = model ? this.mapModel(model) : undefined;
    }

    get model(): M | undefined {
        return this._model;
    }

    set idModel(id: number | string | undefined) {
        this._idModel = id;
        if (this._idModel) {
            this.getModelById(this._idModel).pipe(takeUntil(this.onDestroy$)).subscribe((model) => {
                this.model = model;
            });
        }
    }

    get idModel(): number | string {
        return this._idModel;
    }

    mapModel(model: M | undefined): M | undefined {
        return model;
    }

    ngOnInit() {
        const key = this.getPathKey();
        if (key) {
            const pathParam = this.activatedRoute.snapshot.paramMap.get(key);
            if (pathParam) {
                this.idModel = pathParam;
            }
        }
    }
}