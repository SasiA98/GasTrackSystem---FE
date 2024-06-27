import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { BaseAuthService } from '../services/base-auth.service';

/**
 * Per utilizzare AuthGuard è possibile procedere nei seguenti modi:
 * 1. Importare AuthGuard dall wapp-kit ed aggiungerla tra i providers del proprio modulo
 * 2. Creare una sotto-classe di AuthGuard e definire il provider come segue:
 *    {provide: AuthGuard, useClass: PropriaImplementazione}
 */
@Injectable()
 export class AuthGuard implements CanActivate {
    private authService;
    protected saveRedirectUrl: boolean;

    constructor(authService: BaseAuthService) {
        this.authService = authService;
        this.saveRedirectUrl = true;
    }
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authService.isLogged()) {
            return true;
        }
        else {
            if (this.saveRedirectUrl) {
                sessionStorage.setItem('auth:redirect', state?.url?.toString());
            }
            this.authService.login();
            return false;
        }
    }
}