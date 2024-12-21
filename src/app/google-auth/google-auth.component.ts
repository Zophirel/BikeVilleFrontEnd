import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth-service.service';

@Component({
  selector: 'app-google-auth',
  template: `<div id="google-button" class="my-5 rounded-full"></div>`,
})
export class GoogleAuthComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.initializeGoogleSignIn(this.handleCredentialResponse);
  }

  handleCredentialResponse(response: any): void {
    console.log('Google ID Token:', response.credential);
    // Send this token to your backend for verification
  }
}
