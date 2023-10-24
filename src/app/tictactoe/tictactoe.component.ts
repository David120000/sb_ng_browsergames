import { Component, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { DataSharingService } from '../service/data-sharing.service';
import { AuthObject } from '../model/auth-object';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../service/tictactoe/websocket.service';
import { MessageType } from '../model/message-type';
import { Message } from '../model/message';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-tictactoe',
  templateUrl: './tictactoe.component.html',
  styleUrls: ['./tictactoe.component.css']
})
export class TictactoeComponent implements OnDestroy {

  private renderer: Renderer2;
  private elementRef: ElementRef;
  private dataBank: DataSharingService;
  private webSocket: WebsocketService;

  private colors;
  private connected: boolean;
  private authObject: AuthObject;

  private authObjectSubscription: Subscription;
  private connectionStatusSubscription: Subscription;
  private messageSubscription: Subscription;


  constructor(renderer: Renderer2, elementRef: ElementRef, dataBank: DataSharingService, webSocket: WebsocketService) {
    
    this.renderer = renderer;
    this.elementRef = elementRef;
    this.dataBank = dataBank;
    this.webSocket = webSocket;

    this.colors = [
      '#2196F3', '#32c787', '#00BCD4', '#ff5652',
      '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
    ];

    this.connected = false;
    

    const authObjectFromService = this.dataBank.getDeclaredAuthObject();
    
    if(authObjectFromService != undefined) {
      this.authObject = authObjectFromService;
    }
    else {
      this.authObject = new AuthObject();
    }

    this.authObjectSubscription = this.dataBank.authObjectObservable$.subscribe(authObj => {
     
      if(this.authObject.isJwtPresent() == false && authObj.isJwtPresent() == true) {
        this.webSocket.connect(authObj);
      }

      this.authObject = authObj;

      if(this.authObject.isJwtPresent() == false) {
        this.webSocket.disconnect();
      }
    });

    this.connectionStatusSubscription = this.webSocket.getconnectionStatus$().subscribe(status => {
      this.connected = status;
    });

    this.messageSubscription = this.webSocket.getMessages().subscribe(message => {
      this.onMessageReceived(message);
    });

    if(this.authObject.isJwtPresent() == true && this.connected == false) {
      this.webSocket.connect(this.authObject);
    }
  }


  ngOnDestroy(): void {

      this.authObjectSubscription.unsubscribe();
      this.connectionStatusSubscription.unsubscribe();
      this.messageSubscription.unsubscribe();
  }


  public onMessageReceived(message: Message) {

    let messageArea = this.elementRef.nativeElement.querySelector('#messageArea');
    let messageElement = this.renderer.createElement('li');

    if(message.type === MessageType.JOIN) {

      this.renderer.addClass(messageElement, 'eventMessage');
      message.content = message.sender + ' joined!';

    } 
    else if (message.type === MessageType.LEAVE) {

      this.renderer.addClass(messageElement, 'eventMessage');
      message.content = message.sender + ' left!';

    } 
    else if (message.type === MessageType.CHAT) {

        this.renderer.addClass(messageElement, 'chatMessage');

        let avatarElement = this.renderer.createElement('i');
        let avatarText = this.renderer.createText(message.sender[0]);

        this.renderer.appendChild(avatarElement, avatarText);
        this.renderer.setStyle(avatarElement, 'background-color', this.getAvatarColor(message.sender));

        this.renderer.appendChild(messageElement, avatarElement);

        let usernameElement = this.renderer.createElement('span');
        let usernameText = this.renderer.createText(message.sender);

        this.renderer.appendChild(usernameElement, usernameText);
        this.renderer.appendChild(messageElement, usernameElement);
    }

    let textElement = this.renderer.createElement('p');
    let messageText = this.renderer.createText(message.content);
    this.renderer.appendChild(textElement, messageText);
    

    this.renderer.appendChild(messageElement, textElement);

    this.renderer.appendChild(messageArea, messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
  }


  private getAvatarColor(messageSender: string) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % this.colors.length);
    return this.colors[index];
  }


  public sendMessage(message: NgForm) {
    this.webSocket.sendMessage(message.value.message);
    message.resetForm();
  }


  public isConnectedToSocket(): boolean {
    return this.connected;
  }

}
