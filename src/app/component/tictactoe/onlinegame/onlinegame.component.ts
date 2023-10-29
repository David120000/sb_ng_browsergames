import { AfterViewInit, Component, DoCheck, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Marks } from 'src/app/model/tictactoe/marks';
import { Message } from 'src/app/model/tictactoe/message';
import { MessageType } from 'src/app/model/tictactoe/message-type';
import { SubscribedUser } from 'src/app/model/tictactoe/subscribed-user';
import { TictactoeMatchSubscriptions } from 'src/app/model/tictactoe/tictactoe-match-subscriptions';
import { Tile } from 'src/app/model/tictactoe/tile';
import { DataSharingService } from 'src/app/service/common/data-sharing.service';
import { RestAccessService } from 'src/app/service/common/rest-access.service';
import { TictactoeGame } from 'src/app/service/tictactoe/tictactoe-game';
import { WebsocketService } from 'src/app/service/tictactoe/websocket.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-onlinegame',
  templateUrl: './onlinegame.component.html',
  styleUrls: ['./onlinegame.component.css']
})
export class OnlinegameComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {

  private router: Router;
  private activatedRouter: ActivatedRoute;
  private elementRef: ElementRef;
  private renderer: Renderer2;

  private dataBank: DataSharingService;
  private restAccess: RestAccessService;

  private webSocket: WebsocketService;
  private uuid: string | undefined;
  private connectedToGame: boolean;

  private roomMessageSubscription: Subscription | undefined;
  private connectionStatusSubscription: Subscription | undefined;

  private announcerText: string;
  private tictactoeGame: TictactoeGame;
  private usersInGame: Array<SubscribedUser>;


  constructor(
      router: Router, 
      activatedRouter: ActivatedRoute, 
      elementRef: ElementRef, 
      renderer: Renderer2, 
      dataBank: DataSharingService, 
      restAccess: RestAccessService, 
      webSocket: WebsocketService
    ) {

    this.router = router;
    this.activatedRouter = activatedRouter;
    this.elementRef = elementRef;
    this.renderer = renderer;

    this.dataBank = dataBank;
    this.restAccess = restAccess;
    this.webSocket = webSocket;

    this.connectedToGame = true;
    this.connectionStatusSubscription = this.webSocket.getconnectionStatus$().subscribe(status => {

      if(status == false) {
        this.connectedToGame = status;
        this.router.navigate(['tictactoe', {outlets: { 'game':  null }}]);
      }

    });

    this.roomMessageSubscription = this.webSocket.getRoomMessages().subscribe(message => {
      console.log("room message subscription detected a change. message: " + message);
      this.onMessageReceived(message);
    });

    this.announcerText = "Waiting for the game to start.";
    this.tictactoeGame = new TictactoeGame(false);
    this.usersInGame = [];
  }


  ngOnInit(): void {
    
    if(this.dataBank.getDeclaredAuthObject() == undefined) {
      /* redirect non-authentiacted users */
      this.router.navigate(['tictactoe', {outlets: { 'game':  null }}]);
    }

    let uuidParameter = this.activatedRouter.snapshot.url[1] + "";
    
    if(uuidParameter.length == 36 && uuidParameter.replaceAll("-", "").length == 32) {
      this.uuid = uuidParameter;
    }
    else {
      /* redirect invalid URL requests */
      this.router.navigate(['tictactoe', {outlets: { 'game':  null }}]);
    }
  }


  ngAfterViewInit(): void {

    if(this.uuid != undefined && this.dataBank.getDeclaredAuthObject() != undefined && this.webSocket != undefined) {
      this.webSocket.listenToUUIDrooms(this.uuid);
    }

  }


  ngDoCheck(): void {
    
    if(this.usersInGame.length >= 2) {
      this.tictactoeGame.setGameOn(true);
    }

    if(this.usersInGame.length < 2 && this.tictactoeGame.isGameOn() == true) {
      let button = this.elementRef.nativeElement.querySelector("#newGameBtn");
      this.renderer.setStyle(button, "visibility", "visible");
    }

  }


  ngOnDestroy(): void {

    this.webSocket.unsubscribeUUIDRoom();
    
    if(this.roomMessageSubscription != undefined) {
      this.roomMessageSubscription.unsubscribe();
    }

    if(this.connectionStatusSubscription != undefined) {
      this.connectionStatusSubscription.unsubscribe();
    }
  }


  public startNewGame() {

    if( (this.tictactoeGame.getWinners().length > 0 && this.tictactoeGame.isGameOn() == false) || 
        this.tictactoeGame.getPlayerClickCount() == (this.tictactoeGame.getTableSize() * this.tictactoeGame.getTableSize()) || 
        (this.usersInGame.length < 2 && this.tictactoeGame.isGameOn() == true)
      ) {

      this.announcerText = "Waiting for the game to start.";

      let button = this.elementRef.nativeElement.querySelector("#newGameBtn");
      this.renderer.setStyle(button, "visibility", "hidden");
      
      this.tictactoeGame = new TictactoeGame(false);
   }

  }


  public playerClick(rowPosition: number, columnPosition: number) {

    let nextMark = this.tictactoeGame.whoIsNext();
    let playersMark = Marks.EMPTY;

    let userFromClientSide = this.webSocket.getUser();

    if(userFromClientSide.userName == this.usersInGame[0].userName && userFromClientSide.sessionId == this.usersInGame[0].sessionId) {
      playersMark = Marks.X
    }
    else if(userFromClientSide.userName == this.usersInGame[1].userName && userFromClientSide.sessionId == this.usersInGame[1].sessionId) {
      playersMark = Marks.O;
    }

    
    if(nextMark == playersMark) {

      const tableChanged = this.tictactoeGame.playerClick(rowPosition, columnPosition);

      if(tableChanged == true) {
  
        let div = this.elementRef.nativeElement.querySelector(("#div" + rowPosition + "-" + columnPosition));
        this.renderer.removeClass(div, "clickable");
      }
    }

  }


  public getTile(rowPosition: number, columnPosition: number): Tile {
    return this.tictactoeGame.getTile(rowPosition, columnPosition);
  }


  public getAnnouncerText(): string {
    return this.announcerText;
  }


  public sendMessageToGameChat(message: NgForm) {
    
    if(this.uuid != undefined) {
      this.webSocket.sendMessageToRoom(this.uuid, message.value.gameMessage);
      message.resetForm();
    }

  }


  public onMessageReceived(message: Message) {

    if(message.type != MessageType.GAME) {
      this.chatMessageReceived(message);
    }

    if(message.type == MessageType.JOIN || message.type == MessageType.LEAVE) {
      this.refreshUserList();
    }
    // GAME MESSAGE RECEIVED

  }

  private refreshUserList() {

    if(this.uuid != undefined && this.dataBank.getDeclaredAuthObject() != undefined) {

      this.restAccess.getSubscribedUsersByUuid(this.dataBank.getDeclaredAuthObject()!.getJwt(), this.uuid)
        .subscribe(response => {

          let subscriptions = Object.assign(new TictactoeMatchSubscriptions(), response);
          this.usersInGame = subscriptions.getSubscribedUsers();

        });
    }
  
  }


  private chatMessageReceived(message: Message) {

    let messageArea = this.elementRef.nativeElement.querySelector('#roomMessageArea');
    let messageElement = this.renderer.createElement('li');

    if(message.type == MessageType.JOIN) {

      this.renderer.addClass(messageElement, 'roomEventMessage');
      message.content = message.sender + ' joined!';

    } 
    else if (message.type == MessageType.LEAVE) {

      this.renderer.addClass(messageElement, 'roomEventMessage');
      message.content = message.sender + ' left!';

    } 
    else if (message.type == MessageType.CHAT) {

        this.renderer.addClass(messageElement, 'roomChatMessage');

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


  public isConnectedToAGame(): boolean {
    return this.connectedToGame;
  }

  
  public getUserInGame(): Array<SubscribedUser> {
    return this.usersInGame;
  }

}
