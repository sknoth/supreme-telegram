import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class ChatService {

  private  serverUrl = 'http://localhost:3000';

  private socket;

  sendMessage(topic, message) {
    this.socket.emit(topic, message);
  }

  getMessages() {

    let observable = new Observable(observer => {

      this.socket.on('message', (data) => {
        observer.next(data);
      });

      return () => {
        console.log("disconnect");
        this.socket.disconnect();
      };
    })

    return observable;
  }

  connect() {

    this.socket = io(this.serverUrl);
    console.log('connect', this.socket);
  }

  disconnect(data) {

    this.socket.emit("logout",JSON.stringify(data));
    this.socket.disconnect();
  }
}
