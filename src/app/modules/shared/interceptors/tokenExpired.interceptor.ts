import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '@shared/services/auth/auth.service';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class TokenExpiredInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtHelperService: JwtHelperService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        const user = this.authService.getStoredUsed();

        if (
          [401, 403].includes(err.status) &&
          user !== undefined &&
          this.jwtHelperService.isTokenExpired(user.authentication)
        ) {
          this.authService.logout();
        }

        const error = (err && err.error && err.error.message) || err.statusText;
        return throwError(() => error);
      })
    );
  }
}
