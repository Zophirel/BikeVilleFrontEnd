import { Injectable, inject, signal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './oauth-config';
import { Router } from '@angular/router';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})

export class AuthGoogleService {
  private oAuthService = inject(OAuthService);
  profile = signal<any>(null);
  loading = signal<boolean>(false);  
  router = inject(Router); 

  constructor() {
    this.initConfiguration();
  }

  initConfiguration() {
    try{
      authConfig.redirectUri = `${window.location.origin}${this.router.url}`;
      this.oAuthService.configure(authConfig);
      this.oAuthService.setupAutomaticSilentRefresh();
      
      this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {    
        let valid = this.oAuthService.hasValidIdToken();
        if (valid) {
          this.profile.set(this.oAuthService.getIdentityClaims());
        }      
      });

    }catch(e){
      console.log(e);
      this.loading.set(false);
    }
  }

  getIdToken() {
    return this.oAuthService.getIdToken();
  }

  login() {
    this.initConfiguration();
    this.oAuthService.initImplicitFlow();
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
    this.profile.set(null);
    localStorage.clear();

  }

  getProfile() {
    return this.profile();
  } 
}
