import { CommonModule } from '@angular/common';
import {
  Component,
  forwardRef,
  Input,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
})

export class PasswordInputComponent implements ControlValueAccessor, OnInit {
  @Input() value: string = '';
  @Input() errors: string[] = [];
  isDisabled: boolean = false;

  onChange = (value: string) => {};
  private onTouched = () => {};

  ngOnInit(): void {}

  validatePassword(): void {
    const errors = [];
    if (!/[A-Z]/.test(this.value)) {
      errors.push('Password must contain at least one uppercase letter.');
    }
    if (!/[a-z]/.test(this.value)) {
      errors.push('Password must contain at least one lowercase letter.');
    }
    if (!/[0-9]/.test(this.value)) {
      errors.push('Password must contain at least one number.');
    }
    if (!/[!@#$%^&*]/.test(this.value)) {
      errors.push('Password must contain at least one special character.');
    }
    if (this.value.length < 8) {
      errors.push('Password must be at least 8 characters long.');
    }

    this.errors = errors;
    this.onChange(this.value); // Notify parent of change
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
