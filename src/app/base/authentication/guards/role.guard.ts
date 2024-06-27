import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { concatMap, Observable, of } from "rxjs";
import { BaseAuthService } from "../services/base-auth.service";
import { BaseAuthFacadeService } from "../services/facade/base-auth-facade.service";

/**
 * Per utilizzare RoleGuard è possibile procedere nei seguenti modi:
 * 1. Importare RoleGuard dall wapp-kit ed aggiungerla tra i providers del proprio modulo
 * 2. Creare una sotto-classe di RoleGuard e definire il provider come segue:
 *    {provide: RoleGuard, useClass: PropriaImplementazione}
 */
@Injectable()
export class RoleGuard implements CanActivate {

    private authService;
    private authFacade;

    constructor(authService: BaseAuthService, authFacade: BaseAuthFacadeService) {
        this.authService = authService;
        this.authFacade = authFacade;
    }
    
    canActivate(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Observable<boolean> {
        const roles = this.getRolesFromRoute(route);
        const logicalOp = this.getLogicalOperatorFromRoute(route);
        return this.authFacade.getUser().pipe(concatMap((user) => {
            const hasRole = roles?.length > 0 && !!user && this.authService.hasRole(roles, user, logicalOp);
            return of(hasRole);
        }));
    }

    getRolesFromRoute(route: ActivatedRouteSnapshot) {
        const rolesAttributeName = this.getRolesAttributeName();
        return route.data[rolesAttributeName];
    }

    getLogicalOperatorFromRoute(route: ActivatedRouteSnapshot) {
        const logicalOperatorAttributeName = this.getLogicalOperatorAttributeName();
        return route.data[logicalOperatorAttributeName] || "OR";
    }

    getRolesAttributeName(): string {
        return 'roles';
    }
    
    getLogicalOperatorAttributeName(): string {
        return 'logicalOperator';
    }
}
