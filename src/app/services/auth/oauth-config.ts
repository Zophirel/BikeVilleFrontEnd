import { AuthConfig } from 'angular-oauth2-oidc';

let uri: string = '';


export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: '',
  clientId: '921059556192-2brjfar3rbda76hnb54k7djojj4ccdg7.apps.googleusercontent.com',
  scope: 'openid profile email address phone',
  strictDiscoveryDocumentValidation: false
};
