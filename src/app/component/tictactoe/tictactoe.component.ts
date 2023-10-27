import { Component, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { DataSharingService } from 'src/app/service/common/data-sharing.service';
import { WebsocketService } from 'src/app/service/tictactoe/websocket.service';
import { AuthObject } from 'src/app/model/common/auth-object';
import { Message } from 'src/app/model/tictactoe/message';
import { MessageType } from 'src/app/model/tictactoe/message-type';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tictactoe',
  templateUrl: './tictactoe.component.html',
  styleUrls: ['./tictactoe.component.css']
})
export class TictactoeComponent implements OnDestroy {

  private router: Router;
  private renderer: Renderer2;
  private elementRef: ElementRef;
  private dataBank: DataSharingService;
  private webSocket: WebsocketService;

  private colors;
  private connected: boolean;
  private authObject: AuthObject;

  private onlineGameErrorMessage: string | undefined;

  private authObjectSubscription: Subscription;
  private connectionStatusSubscription: Subscription;
  private messageSubscription: Subscription;


  constructor(router: Router, renderer: Renderer2, elementRef: ElementRef, dataBank: DataSharingService, webSocket: WebsocketService) {
    
    this.router = router;
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
      this.webSocket.disconnect();
  }


  public createOnlineGame() {

    if(this.connected == true) {

      const uuid = uuidv4();
      this.router.navigate(['tictactoe', { outlets: { 'game': ['online', uuid]} }]);
      this.onlineGameErrorMessage = undefined;
    }
    else {
      this.onlineGameErrorMessage = "Only authenticated players can access online multiplayer!";
    }

  }


  public joinOnlineGame(url: string) {

    if(this.connected == true) {

      if(url.includes("/tictactoe/(game:online/") == true) {

        let index = url.lastIndexOf("/tictactoe/(game:online/");
        let uuid = url.slice(index+24, index+24+36);
        
        if(uuid.length == 36 && uuid.replaceAll("-", "").length == 32) {
      
          this.router.navigate(['tictactoe', { outlets: { 'game': ['online', uuid]} }]);
          this.onlineGameErrorMessage = undefined;
        }
  
      }
      else if(url.length == 36 && url.replaceAll("-", "").length == 32) {

        this.router.navigate(['tictactoe', { outlets: { 'game': ['online', url]} }]);
        this.onlineGameErrorMessage = undefined; 
      }
      else {
        this.onlineGameErrorMessage = "Join URL/ID is not valid.";
      }

    }
    else {
      this.onlineGameErrorMessage = "Only authenticated players can access online multiplayer!";
    }
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


  public childRouterActive(): boolean {
    return (this.router.url + "").startsWith("/tictactoe/(game:");
  }


  public getOnlineGameErrorMessage(): string | undefined {
    return this.onlineGameErrorMessage;
  }

}
