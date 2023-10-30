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

    this.roomMessageSubscription = this.webSocket.getRoomMessages().subscribe(message => this.onMessageReceived(message));

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
    
    if(this.usersInGame.length >= 2 && 
      this.tictactoeGame.getWinners().length == 0 && 
      this.tictactoeGame.getPlayerClickCount() < this.tictactoeGame.getTableSize() * this.tictactoeGame.getTableSize()
      ) {
     
      this.tictactoeGame.setGameOn(true);
    }

    if(this.usersInGame.length < 2 && this.tictactoeGame.isGameOn() == true) {
      let button = this.elementRef.nativeElement.querySelector("#newGameBtn");
      this.renderer.setStyle(button, "visibility", "visible");
    }

    this.handleAnnouncerElements();

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


  public onMessageReceived(message: Message) {

    if(message.type != MessageType.GAME) {
      this.chatMessageReceived(message);
    }

    if(message.type == MessageType.JOIN || message.type == MessageType.LEAVE) {
      this.refreshUserList();
    }
    
    if(message.type == MessageType.GAME) {
      
      if(message.content.startsWith("game|")) {       
        this.tictactoeGame.setGameData(message.content);
      }
      else if(message.content.startsWith("newgame|")) {
        this.tictactoeGame = new TictactoeGame(false);
        this.resetGameView();
        this.tictactoeGame.setGameData(message.content);
      }
      else if(message.content.startsWith("click|")) {
        
        const tableChanged = this.tictactoeGame.remoteClick(message.content);

        if(tableChanged == true) {
          
          let clickDataArray = message.content.split("|");
          let div = this.elementRef.nativeElement.querySelector(("#div" + clickDataArray[1] + "-" + clickDataArray[2]));
          this.renderer.removeClass(div, "clickable");
        }
      }
      
    }

  }

  private refreshUserList() {

    if(this.uuid != undefined && this.dataBank.getDeclaredAuthObject() != undefined) {

      this.restAccess.getSubscribedUsersByUuid(this.dataBank.getDeclaredAuthObject()!.getJwt(), this.uuid)
        .subscribe(response => {

          let subscriptions = Object.assign(new TictactoeMatchSubscriptions(), response);

          if(this.usersInGame.length < subscriptions.getSubscribedUsers().length) {         
            this.shareGameDataWithOthers();
          }

          this.usersInGame = subscriptions.getSubscribedUsers();
        });
    }
  
  }


  private shareGameDataWithOthers() {

    if(this.usersInGame.length >= 1 && this.webSocket.getUser().userName == this.usersInGame[0].userName && this.webSocket.getUser().sessionId == this.usersInGame[0].sessionId) {  

      this.webSocket.sendGameDataToOthers(this.uuid!, this.tictactoeGame.getGameData("game"));
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

        this.sendPlayerClickDataToOthers(rowPosition, columnPosition, playersMark);
      }
    }

  }


  private sendPlayerClickDataToOthers(clickRowPosition: number, clickColumnPosition: number, playersMark: Marks) {
    
    let clickData = this.tictactoeGame.buildClickData(clickRowPosition, clickColumnPosition, playersMark);
    this.webSocket.sendPlayerClickData(this.uuid!, clickData);
  }
  

  public startNewGame() {

    if( (this.tictactoeGame.getWinners().length > 0 && this.tictactoeGame.isGameOn() == false) || 
        this.tictactoeGame.getPlayerClickCount() == (this.tictactoeGame.getTableSize() * this.tictactoeGame.getTableSize()) || 
        (this.usersInGame.length < 2 && this.tictactoeGame.isGameOn() == true)
      ) {

      this.tictactoeGame = new TictactoeGame(false);
      this.webSocket.sendGameDataToOthers(this.uuid!, this.tictactoeGame.getGameData("newgame"));
   }

  }


  private resetGameView() {

    this.announcerText = "Waiting for the game to start.";

    let button = this.elementRef.nativeElement.querySelector("#newGameBtn");
    this.renderer.setStyle(button, "visibility", "hidden");

    for(let rowId = 0; rowId < 3; rowId++) {
      for(let colId = 0; colId < 3; colId++) {

        let div = this.elementRef.nativeElement.querySelector("#div" + rowId + "-" + colId);
        this.renderer.addClass(div, "clickable");
      }
    }

  }


  private handleAnnouncerElements() {

    if(this.tictactoeGame.isGameOn() == true) {
      
      this.announcerText = "Next:";
      this.displayNextPlayer();
    }
    else {

      let xIndicator = this.elementRef.nativeElement.querySelector("#nextPlayerX");
      let oIndicator = this.elementRef.nativeElement.querySelector("#nextPlayerO");

      if(this.tictactoeGame.getWinners().length == 1) {

        this.announcerText = "We have a WINNER!"

        if(this.tictactoeGame.getWinners()[0] == Marks.X) {

          this.renderer.removeClass(xIndicator, "notYouNext");
          this.renderer.addClass(xIndicator, "youNext");
    
          this.renderer.removeClass(oIndicator, "youNext");
          this.renderer.addClass(oIndicator, "notYouNext");
        }
        else {

          this.renderer.removeClass(xIndicator, "youNext");
          this.renderer.addClass(xIndicator, "notYouNext");
    
          this.renderer.removeClass(oIndicator, "notYouNext");
          this.renderer.addClass(oIndicator, "youNext");
        }

        let button = this.elementRef.nativeElement.querySelector("#newGameBtn");
        this.renderer.setStyle(button, "visibility", "visible");

      }
      else if(this.tictactoeGame.getWinners().length == 2) {

        this.announcerText = "Draw game! Both players won.";

        this.renderer.removeClass(xIndicator, "notYouNext");
        this.renderer.addClass(xIndicator, "youNext");

        this.renderer.removeClass(oIndicator, "notYouNext");
        this.renderer.addClass(oIndicator, "youNext");

        let button = this.elementRef.nativeElement.querySelector("#newGameBtn");
        this.renderer.setStyle(button, "visibility", "visible");
      }
      else if(this.tictactoeGame.getPlayerClickCount() == (this.tictactoeGame.getTableSize() * this.tictactoeGame.getTableSize())) {

        this.announcerText = "Draw game!";

        this.renderer.removeClass(xIndicator, "youNext");
        this.renderer.addClass(xIndicator, "notYouNext");

        this.renderer.removeClass(oIndicator, "youNext");
        this.renderer.addClass(oIndicator, "notYouNext");

        let button = this.elementRef.nativeElement.querySelector("#newGameBtn");
        this.renderer.setStyle(button, "visibility", "visible");
      }
    }

  }


  private displayNextPlayer() {

    let xIndicator = this.elementRef.nativeElement.querySelector("#nextPlayerX");
    let oIndicator = this.elementRef.nativeElement.querySelector("#nextPlayerO");

    if(this.tictactoeGame.whoIsNext() == Marks.X) {

      this.renderer.removeClass(xIndicator, "notYouNext");
      this.renderer.addClass(xIndicator, "youNext");

      this.renderer.removeClass(oIndicator, "youNext");
      this.renderer.addClass(oIndicator, "notYouNext");
    }
    else if(this.tictactoeGame.whoIsNext() == Marks.O) {

      this.renderer.removeClass(xIndicator, "youNext");
      this.renderer.addClass(xIndicator, "notYouNext");

      this.renderer.removeClass(oIndicator, "notYouNext");
      this.renderer.addClass(oIndicator, "youNext");
    }
    else {

      this.renderer.removeClass(xIndicator, "youNext");
      this.renderer.addClass(xIndicator, "notYouNext");

      this.renderer.removeClass(oIndicator, "youNext");
      this.renderer.addClass(oIndicator, "notYouNext");
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
