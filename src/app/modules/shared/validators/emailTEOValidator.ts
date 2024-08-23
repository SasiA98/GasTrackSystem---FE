import { AbstractControl, ValidatorFn } from '@angular/forms';

// Validatore per verificare se l'email termina con "@clientgroup.com"
export function emailTEOValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const email = control.value;

    if (!email) {
      // Se l'email è vuota, non eseguire la validazione
      return null;
    }

    // Verificare se l'email termina con "@clientgroup.com"
    const isValid = email.toLowerCase().endsWith('@clientgroup.com');

    // Restituire un errore se l'email non termina con "@client.com"
    return isValid ? null : { 'invalidClientEmail': true };
  };
}
