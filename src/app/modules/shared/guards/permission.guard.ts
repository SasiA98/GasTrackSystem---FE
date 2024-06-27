import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { RolePermissionService } from "@shared/services/role-permission.service";

@Injectable({
    providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
    constructor(private readonly roleService: RolePermissionService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const permission = this.getPermissionFromRoute(route);
        return this.roleService.hasPermission(permission);
    }

    getPermissionFromRoute(route: ActivatedRouteSnapshot) {
        const rolesAttributeName = this.getRolesAttributeName();
        return route.data[rolesAttributeName];
    }

    getRolesAttributeName() {
        return 'permission';
    }
}
