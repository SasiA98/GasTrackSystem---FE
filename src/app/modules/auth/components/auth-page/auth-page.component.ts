import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticatedUser } from '@shared/models/authenticated-user.model';
import { AuthService } from '@shared/services/auth/auth.service';
import { BasePageComponent } from 'src/app/base/base-page/base-page.component';
import { finalize, takeUntil, from } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { PasswordTokenService } from '@shared/services/password-token.service';
import { ToastrService } from 'ngx-toastr';
import { VersionService } from '@shared/services/version.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent extends BasePageComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  loading = false;
  forgottenPassword = false;
  resetPassword = false;
  version : any;

  constructor(
    injector: Injector,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly loginService: LoginService,
    private readonly versionService: VersionService,
    private readonly passwordTokenService: PasswordTokenService,
    private readonly toastrService: ToastrService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.versionService.getVersion().subscribe(data => this.version = data);
    const isUtenteLoggato = this.authService.isLogged();
    if (isUtenteLoggato) {
      this.goBack();
    }
  }

  onLogin(): void {
    this.form.markAllAsTouched();
    if (!this.form.value.username || !this.form.value.password) {
      return;
    }
    this.executeLogin();
  }

  forgotPassword() {
    this.forgottenPassword = true;
    this.resetPassword = false;
  }

  disableForgottenPassword() {
    this.forgottenPassword = false;
    this.resetPassword = false;
  }

  disableResetPassword() {
    this.forgottenPassword = true;
    this.resetPassword = false;
  }

  onForgotPassword() {
    this.form.markAllAsTouched();
    if (!this.form.value.username) {
      return;
    }
    this.executeForgotPassword();
  }

  onResetPassword() {
    this.form.markAllAsTouched();
    if (!this.form.value.token || !this.form.value.password) {
      return;
    }
    this.executeResetPassword()
  }

  private executeLogin(): void {
    const { username, password } = this.form.value;
    this.loading = true;
    this.loginService
      .login({ username, password })
      .pipe(
        takeUntil(this.onDestroy$),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((user: AuthenticatedUser) => {
        this.authService.storeUser(user);
        this.router.navigate(["/"])
      });
  }

  private executeForgotPassword(): void {
    const { username } = this.form.value;
    this.passwordTokenService.forgotPassword(username)
    .subscribe(
      (response) => {
        this.showSuccessMessage(response.message)
        this.forgottenPassword = false;
        this.resetPassword = true;
      },
      (error) => {
        this.showErrorMessage(error.error.message)
      }
    )
  }

  private executeResetPassword(): void {
    const { token, password, confirmPassword } = this.form.value;

    if (password !== confirmPassword) {
      this.showErrorMessage('Passwords do not match')
      return;
    }

    const passwordControl = this.form.get('password');
    if (passwordControl?.errors) {
      this.showErrorMessage('Password does not meet the requirements');
      return;
    }

    this.passwordTokenService.resetPassword(token, password).subscribe(
      (response) => {
        this.showSuccessMessage(response.message)
        this.forgottenPassword = false;
        this.resetPassword = false;
        this.form.get('password')?.setValue('');
      },
      (error) => {
        this.showErrorMessage(error.error.message)
      }
    );
  }

  goBack(): void {
    const redirectUrl = sessionStorage.getItem('auth:redirect');
    this.router.navigate([redirectUrl || '']);
  }

  showSuccessMessage(message: string): void {
    this.toastrService.success(message, "Success",);
  }

  showErrorMessage(error: string): void {
    this.toastrService.error(error, "Error");
  }


}
