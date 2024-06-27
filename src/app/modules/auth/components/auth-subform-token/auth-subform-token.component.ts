import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SubFormComponent } from 'src/app/base/base-page/subform.component';
import { PasswordValidator } from '@shared/validators/passwordValidator';

@Component({
  selector: 'app-auth-subform-token',
  templateUrl: './auth-subform-token.component.html',
  styleUrls: ['./auth-subform-token.component.scss'],
})
export class AuthSubformTokenComponent extends SubFormComponent {

  @Input() override form: FormGroup = new FormGroup({});

  constructor(formBuilder: FormBuilder) {
    super(formBuilder);
  }

  protected getControlsConfig(): {
    [key: string]: AbstractControl | [string, ValidatorFn[]] | [string];
  } {
    return {
      token: ['', [Validators.required]],
      password: ['', [PasswordValidator.strongPassword(), Validators.required]],
      confirmPassword: ['', [Validators.required, this.matchPasswordValidator()]]
    };
  }

  private matchPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!this.form) return null;
      const password = this.form.get('password')?.value;
      const confirmPassword = control.value;
      return password === confirmPassword ? null : { 'passwordMismatch': true };
    };
  }
}
