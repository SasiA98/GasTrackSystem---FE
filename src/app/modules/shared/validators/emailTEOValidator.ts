import { AbstractControl, ValidatorFn } from '@angular/forms';

// Validatore per verificare se l'email termina con "@teoresigroup.com"
export function emailTEOValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const email = control.value;

    if (!email) {
      // Se l'email è vuota, non eseguire la validazione
      return null;
    }

    // Verificare se l'email termina con "@teoresigroup.com"
    const isValid = email.toLowerCase().endsWith('@teoresigroup.com');

    // Restituire un errore se l'email non termina con "@teoresigroup.com"
    return isValid ? null : { 'invalidTeoresiEmail': true };
  };
}
