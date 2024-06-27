import { AbstractControl, ValidatorFn } from '@angular/forms';

// Validatore per verificare se la data di nascita ha almeno l'età specificata
export function minimumAgeValidator(minimumAge: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      // Se il campo è vuoto, non eseguire la validazione
      return null;
    }

    // Calcolare la differenza tra la data di nascita e la data corrente
    const birthDate = new Date(control.value);
    const today = new Date();
    const ageDifferenceMs = today.getTime() - birthDate.getTime();
    const ageDate = new Date(ageDifferenceMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    // Verificare se l'età è inferiore all'età minima richiesta
    const isValid = age >= minimumAge;

    // Restituire un errore se l'età è inferiore all'età minima richiesta
    return isValid ? null : { 'minimumAge': { requiredAge: minimumAge, actualAge: age } };
  };
}

// Validatore per verificare se il dominio dell'email è tra quelli consentiti
export function allowedEmailDomainValidator(allowedDomains: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      // Se il campo è vuoto, non eseguire la validazione
      return null;
    }

    // Estrarre il dominio dall'email
    const emailParts = control.value.split('@');
    const domain = emailParts[emailParts.length - 1];

    // Verificare se il dominio è tra quelli consentiti
    const isValid = allowedDomains.includes(domain);

    // Restituire un errore se il dominio non è consentito
    return isValid ? null : { 'invalidDomain': true };
  };
}
