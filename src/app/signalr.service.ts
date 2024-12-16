import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;

  constructor() { }

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5199/chatHub') // Replace with your backend URL
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connection Started'))
      .catch(err => console.log('Error starting connection: ', err));
  }

  sendMessage(user: string, message: string) {
    this.hubConnection.invoke('SendMessage', user, message)
      .catch(err => console.error(err));
  }

  onReceiveMessage(callback: (user: string, message: string) => void) {
    this.hubConnection.on('ReceiveMessage', callback);
  }
}
