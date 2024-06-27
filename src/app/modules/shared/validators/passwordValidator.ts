import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidator {
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecialChar = /[@$!%*?&]/.test(value);
      const hasMinLength = value.length >= 8;

      const passwordValid = hasUpperCase && hasNumeric && hasSpecialChar && hasMinLength;

      if (!passwordValid) {
        return {
          strongPassword: {
            hasUpperCase,
            hasNumeric,
            hasSpecialChar,
            hasMinLength
          }
        };
      }

      return null;
    };
  }
}
