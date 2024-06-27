import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { BaseAuthService } from '../services/base-auth.service';
import { BaseAuthFacadeService } from '../services/facade/base-auth-facade.service';
import { LogicalOperator } from '../types/logical-operator.type';

/**
 * HasRoleDirective è una direttiva strutturale e si occupa di aggiungere/rimuovere
 * un componente dalla DOM sulla base dei ruoli passati in input ed un operatore logico quale: AND, OR.
 *
 * Esempio di utilizzo:
 * <ng-template [hasRole]="['USER', 'ADMIN']" [logicalOperator]="'OR'">...<ng-template>
 * <ng-template [hasRole]="['USER', 'ADMIN']" logicalOperator="AND">...<ng-template>
 * <app-component *hasRole="['ADMIN', 'USER']" ></app-component>
 *
 * Per utilizzare HasRoleDirective è necessario fornire nel proprio modulo un implementazione dei seguenti service:
 *    - BaseAuthFacadeService
 *    - BaseAuthService
 */
 @Directive({
    selector: '[hasRole]',
  })
export class HasRoleDirective {
    private templateRef: TemplateRef<any>;
    private viewContainer: ViewContainerRef;
    private authFacade: BaseAuthFacadeService;
    private authService: BaseAuthService;
    private user: any;
    private _logicalOperator: LogicalOperator;
    private hasView: boolean;
    private roles: string[];

    constructor(templateRef: TemplateRef<any>, viewContainer: ViewContainerRef, authFacade: BaseAuthFacadeService, authService: BaseAuthService) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this.authFacade = authFacade;
        this.authService = authService;
        this.roles = [];
        this._logicalOperator = "OR";
        this.hasView = true;
        this.authFacade.getUser().subscribe((user: any) => {
            this.user = user;
            this.updateView();
        });
    }

    @Input() set hasRole(value: string[]) {
        this.roles = value;
        this.updateView();
    }

    @Input() set logicalOperator(value: LogicalOperator) {
        this._logicalOperator = value;
        this.updateView();
    }

    updateView(): void {
        if (this.user && this.roles?.length && this.authService.hasRole(this.roles, this.user, this._logicalOperator)) {
            if (!this.hasView) {
                this.viewContainer.createEmbeddedView(this.templateRef);
                this.hasView = true;
            }
        }
        else {
            this.viewContainer.clear();
            this.hasView = false;
        }
    }
}
