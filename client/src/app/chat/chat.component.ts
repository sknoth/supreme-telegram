import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Control }           from '@angular/common';
import { ChatService }       from '../chat.service';

@Component({
  moduleId: module.id,
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [ChatService]
})
export class ChatComponent implements OnInit, OnDestroy {

  messages = [];
  connection;
  message;

  constructor(private _chatService:ChatService) { }

  ngOnInit() {
    this.connection = this._chatService.getMessages().subscribe(message => {
      this.messages.push(message);
    })
  }

  sendMessage(topic){
    this._chatService.sendMessage(topic,this.message);
    this.message = '';
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

}
