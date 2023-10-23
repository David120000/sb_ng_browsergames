import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Message } from 'src/app/model/message';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { AuthObject } from 'src/app/model/auth-object';
import { JwtDecoderService } from '../jwt-decoder.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private jwtDecoder: JwtDecoderService;

  private connectionStatusSource = new Subject<boolean>();
  private connectionStatus$ = this.connectionStatusSource.asObservable();

  private messageSource = new Subject<Message>();
  private messages$ = this.messageSource.asObservable();

  private stompClient: any | undefined;

  private userName: string;


  constructor(jwtDecoder: JwtDecoderService) { 
    this.jwtDecoder = jwtDecoder;
    this.userName = '';
  }


  public connect(authObject: AuthObject) {
    console.log("connect method called with jwt: " + authObject.getJwt());
    const socket = new SockJS("http://localhost:8080/ws?authorization=jwt." + authObject.getJwt());
    this.stompClient = Stomp.over(socket);

    const _this = this;

    _this.stompClient.connect({}, function(frame: any) {

      _this.setConnectionStatus(true);
      _this.stompClient.subscribe("/topic/public", function(payload: any) {

        let message = JSON.parse(payload.body);
        _this.messageSource.next(message);

      });

      _this.userName = _this.jwtDecoder.getUserNameFromToken(authObject);

      _this.stompClient.send("/app/chat.addUser", {}, JSON.stringify({sender: _this.userName, content: '', type: 'JOIN'}));

    },
    this.onError);

  }


  public disconnect() {

    this.setConnectionStatus(false);
    this.userName = '';
    this.stompClient.disconnect();
  }


  public sendMessage(messageText: string) {

    let messageContent = messageText.trim();
    
    if(messageContent && this.stompClient && this.userName != '') {
        
      let chatMessage = {
            sender: this.userName,
            content: messageText,
            type: 'CHAT'
        };

      this.stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
    }
  }


  public onError() {
    console.log("Error occured while connecting");
  }


  private setConnectionStatus(newStatus: boolean) {
    this.connectionStatusSource.next(newStatus);
  }

  public getconnectionStatus$(): Observable<boolean> {
    return this.connectionStatus$;
  }

  public getMessages(): Observable<Message> {
    return this.messages$;
  }
}
