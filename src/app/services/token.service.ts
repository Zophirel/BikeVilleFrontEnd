import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
    getAccessToken(){
        const tokens = localStorage.getItem('auth');
        if(tokens){
            const auth = JSON.parse(tokens);
            return auth[1];
        } 
    }
    
    getIdToken(){
        const tokens = localStorage.getItem('auth');
        if(tokens){
            const auth = JSON.parse(tokens);
            return auth[0];
        } 
    }
    
    getTokenData(){
        const token = this.getIdToken();
        const data = token.split('.')[1];
        const decodedData = atob(data);
        return JSON.parse(decodedData);
    }
}