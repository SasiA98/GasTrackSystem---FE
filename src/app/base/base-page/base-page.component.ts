import { Component, Injector, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";

@Component({
    selector: 'app-base-page',
    template: `
      <p>
        base works!
      </p>
    `
  })
export abstract class BasePageComponent implements OnDestroy {

    onDestroy$: Subject<any> = new Subject<any>();
    activatedRoute: any;
    pageTitle: string = "";

    constructor(injector: Injector) {        
        this.activatedRoute = injector.get(ActivatedRoute);
        this.pageTitle = this.activatedRoute?.snapshot?.data['title'];
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
    }
}