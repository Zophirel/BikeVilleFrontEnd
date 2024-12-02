import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-forgot-pass',
    imports: [RouterModule, CommonModule, FormsModule],
    templateUrl: './forgot-pass.component.html',
    styleUrl: './forgot-pass.component.scss'
})
export class ForgotPassComponent {
  email: string = '';
  submitted: boolean = false;

  onSubmit(form: any) {
    console.log(form.value);
    this.submitted = true;
  }
}
