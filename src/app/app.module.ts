import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { environment } from '@environment/environment';
import { ErrorInterceptor } from '@shared/interceptors/error.interceptor';
import { TokenExpiredInterceptor } from '@shared/interceptors/tokenExpired.interceptor';
import { AuthFacadeService } from '@shared/services/auth/auth-facade.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { RefreshTokenService } from '@shared/services/auth/refresh-token.service';
import { SharedModule } from '@shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './base/authentication/guards/auth.guard';
import { RoleGuard } from './base/authentication/guards/role.guard';
import { BaseAuthService } from './base/authentication/services/base-auth.service';
import { BaseAuthFacadeService } from './base/authentication/services/facade/base-auth-facade.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ProjectDeleteDialogComponent } from './modules/partners/projects/components/project-delete-dialog/project-delete-dialog.component';
import { TimesheetDeleteDialogComponent } from './modules/partners/timesheet/components/timesheet-delete-dialog/timesheet-delete-dialog.component';

@NgModule({
  declarations: [AppComponent, ProjectDeleteDialogComponent, TimesheetDeleteDialogComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MatExpansionModule,
    HttpClientModule,
    SharedModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: (authService: AuthService) => {
          return {
            tokenGetter: () => {
              const storedUser = authService.getEncryptedStoredUsed();
              return storedUser?.authentication;
            },
            allowedDomains: environment.jwt.allowedDomain
          };
        },
        deps: [AuthService]
      }
    })
  ],
  providers: [
    AuthGuard,
    RoleGuard,
    { provide: BaseAuthService, useClass: AuthService },
    { provide: BaseAuthFacadeService, useClass: AuthFacadeService },
    { provide: HTTP_INTERCEPTORS, useClass: TokenExpiredInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: (refreshTokenService: RefreshTokenService) => {
        return () => {
          refreshTokenService.scheduleSilentRefresh();
        };
      },
      multi: true,
      deps: [RefreshTokenService]
    },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
