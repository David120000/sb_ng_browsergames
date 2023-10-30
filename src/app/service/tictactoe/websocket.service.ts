import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { JwtDecoderService } from '../common/jwt-decoder.service';
import { Message } from 'src/app/model/tictactoe/message';
import { AuthObject } from 'src/app/model/common/auth-object';
import { SubscribedUser } from 'src/app/model/tictactoe/subscribed-user';
import { MessageType } from 'src/app/model/tictactoe/message-type';


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
  private socketSessionId: string;

  private uuidRoomSubscription: Subscription | undefined;
  private roomMessageSource = new Subject<Message>;
  private roomMessages$ = this.roomMessageSource.asObservable();

  constructor(jwtDecoder: JwtDecoderService) { 
    this.jwtDecoder = jwtDecoder;
    this.userName = '';
    this.socketSessionId = '';
  }


  public connect(authObject: AuthObject) {

    const socket = new SockJS("http://localhost:8080/ws?authorization=jwt." + authObject.getJwt());
    this.stompClient = Stomp.over(socket);

    const _this = this;

    _this.stompClient.connect({}, function(frame: any) {

      _this.setConnectionStatus(true);
      _this.stompClient.subscribe("/topic/public", function(payload: any) {

        let message = JSON.parse(payload.body);
        _this.messageSource.next(message);        

        let transportUrl = socket._transport.url;
        _this.socketSessionId = transportUrl.split("/")[5];
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


  public sendMessageToRoom(uuid: string, messageText: string) {

    let messageContent = messageText.trim();
    
    if(messageContent && this.stompClient && this.userName != '') {
        
      let chatMessage = {
            sender: this.userName,
            content: messageText,
            type: 'CHAT'
        };

      this.stompClient.send("/app/room/" + uuid, {}, JSON.stringify(chatMessage));
    }
  }


  public sendGameDataToOthers(uuid: string, gameData: string) {

    let message = new Message();
    message.sender = this.userName;
    message.content = gameData;
    message.type = MessageType.GAME;
    
    this.stompClient.send("/app/room/" + uuid, {}, JSON.stringify(message));
  }


  public sendPlayerClickData(uuid: string, clickData: string) {
   
    let message = new Message();
    message.sender = this.userName;
    message.content = clickData;
    message.type = MessageType.GAME;

    this.stompClient.send("/app/room/" + uuid, {}, JSON.stringify(message));
  }


  public listenToUUIDrooms(uuid: string) {

    if(this.uuidRoomSubscription != undefined) {
      this.uuidRoomSubscription.unsubscribe();
      this.uuidRoomSubscription = undefined;
    }

    const _this = this;

    _this.uuidRoomSubscription = _this.stompClient.subscribe("/topic/" + uuid, function(payload: any) {

      let message = JSON.parse(payload.body);
      _this.roomMessageSource.next(message);

    });

    _this.stompClient.send("/app/room/" + uuid, {}, JSON.stringify({sender: _this.userName, content: '', type: 'JOIN'}));

  }


  public unsubscribeUUIDRoom() {

    if(this.uuidRoomSubscription != undefined) {
      this.uuidRoomSubscription.unsubscribe();
    }
  }


  public getUser(): SubscribedUser {

    let user = new SubscribedUser();
    user.userName = this.userName;
    user.sessionId = this.socketSessionId;

    return user;
  }


  public onError() {
    console.log("Error occured while connecting to the Socket Service.");
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

  public getRoomMessages(): Observable<Message> {
    return this.roomMessages$;
  }
}
