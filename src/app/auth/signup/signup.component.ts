import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NavbarComponent } from '../../navbar/navbar.component';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-signup',
    imports: [
      RouterModule, 
      CommonModule, 
      FormsModule, 
      MatFormFieldModule, 
      MatInputModule, 
      NavbarComponent,
      MatButtonModule,
      MatIconModule,
      MatSelectModule
    ],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SignupComponent {
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  private authService: AuthService;

  constructor(auth : AuthService){
    this.authService = auth;
  }

  ngOnInit() {
    this.authService.checkAuth().subscribe((response) => {
      if(response.status == 200){
        console.log('Authenticated');
      }
    });
  }

  getSignupForm() {}

  onSubmit(form : NgForm) {
    console.log(this.authService.auth) ;
  } 

}