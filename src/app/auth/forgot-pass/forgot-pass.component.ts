import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';


@Component({
    selector: 'app-forgot-pass',
    imports: [
      RouterModule, 
      CommonModule, 
      FormsModule, 
      NavbarComponent, 
      MatFormFieldModule,
      MatButtonModule,
      MatInputModule
    ],
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
