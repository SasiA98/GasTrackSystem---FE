import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { PasswordValidator } from '@shared/validators/passwordValidator';
import { SubFormComponent } from 'src/app/base/base-page/subform.component';

@Component({
  selector: 'app-auth-subform',
  templateUrl: './auth-subform.component.html',
  styleUrls: ['./auth-subform.component.scss']
})
export class AuthSubformComponent extends SubFormComponent {

  @Input() override form: FormGroup = new FormGroup({});

  constructor(formBuilder: FormBuilder) {
    super(formBuilder);
  }

  protected getControlsConfig(): {
    [key: string]: AbstractControl | [string, ValidatorFn[]] | [string];
    } {
    return {
      username: ['', [Validators.required, Validators.email]],
      password: ['', [PasswordValidator.strongPassword(), Validators.required]]
    };
  }
}
