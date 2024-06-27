import { AbstractControl, FormControl, ValidationErrors, Validator, ValidatorFn } from "@angular/forms";

export function PasswordMatchValidator(currentPasswordControlName: string, passwordControlName: string, confirmPasswordControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if(control) {
            const password = control.get(passwordControlName)?.value;
            const confirmPassword = control.get(confirmPasswordControlName)?.value;
            const currentPassword = control.get(currentPasswordControlName)?.value;
            if(currentPassword || confirmPassword || password ) {
                if(currentPassword && ((password != '' && password !== confirmPassword) || !password)) {
                    control.get(confirmPasswordControlName)?.setErrors({passwordMismatch: true});
                    return {passwordMismatch: true};
                }
            }
        }
        control.get(confirmPasswordControlName)?.setErrors(null);
        return null;
    }
}