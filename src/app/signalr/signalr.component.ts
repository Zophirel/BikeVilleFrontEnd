import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../signalr.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-root',
  template: `
    <div>
      <div *ngFor="let msg of messages">{{msg}}</div>
      <input [(ngModel)]="user" placeholder="User" />
      <input [(ngModel)]="message" placeholder="Message" />
      <button (click)="sendMessage()">Send</button>
    </div>
  `,
  styleUrls: ['../app.component.scss']
})
export class SignalRComponent implements OnInit {
  user = '';
  message = '';
  messages: string[] = [];

  constructor(private signalRService: SignalrService) {}

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.onReceiveMessage((user, message) => {
      this.messages.push(`${user}: ${message}`);
    });
  }

  sendMessage() {
    this.signalRService.sendMessage(this.user, this.message);
    this.message = '';
  }
}
