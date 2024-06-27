import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SubFormComponent } from 'src/app/base/base-page/subform.component';

@Component({
  selector: 'app-auth-subform-reset-pw',
  templateUrl: './auth-subform-reset-pw.component.html',
  styleUrls: ['./auth-subform-reset-pw.component.scss']
})
export class AuthSubformResetPwComponent extends SubFormComponent {

  @Input() override form: FormGroup = new FormGroup({});

  constructor(formBuilder: FormBuilder) {
    super(formBuilder);
  }

  protected getControlsConfig(): {
    [key: string]: AbstractControl | [string, ValidatorFn[]] | [string];
    } {
    return {
      username: ['', [Validators.required, Validators.email]],
    };
  }
}
