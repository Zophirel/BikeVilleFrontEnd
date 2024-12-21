import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const errors: string[] = [];
    const value = control.value || '';

    // Check for uppercase letter
    if (!/[A-Z]/.test(value)) {
      errors.push('Password must contain at least one uppercase letter.');
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(value)) {
      errors.push('Password must contain at least one lowercase letter.');
    }

    // Check for number
    if (!/[0-9]/.test(value)) {
      errors.push('Password must contain at least one number.');
    }

    // Check for special character
    if (!/[!@#$%^&*]/.test(value)) {
      errors.push('Password must contain at least one special character.');
    }

    // Check length
    if (value.length < 8) {
      errors.push('Password must be at least 8 characters long.');
    }

    // If there are any errors, return them, else null
    return errors.length > 0 ? { passwordStrength: errors } : null;
  };
}
