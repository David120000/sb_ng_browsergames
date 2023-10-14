import { Component, OnDestroy } from '@angular/core';
import { User } from '../model/user';
import { RestAccessService } from '../service/rest-access.service';
import { DataSharingService } from '../service/data-sharing.service';
import { JwtDecoderService } from '../service/jwt-decoder.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-authenticator',
  templateUrl: './user-authenticator.component.html',
  styleUrls: ['./user-authenticator.component.css']
})
export class UserAuthenticatorComponent implements OnDestroy {

  private restService: RestAccessService;
  private dataBank: DataSharingService;
  private jwtDecoder: JwtDecoderService;
  private authTokenSubscription: Subscription;
  private messageSubscription: Subscription;
  
  private preLoginMessage: string;
  private playerName: string;


  constructor(restService: RestAccessService, dataBank: DataSharingService, jwtDecoder: JwtDecoderService) {    
    
    this.restService = restService;
    this.dataBank = dataBank;
    this.jwtDecoder = jwtDecoder;

    this.preLoginMessage = "Unlock game features like online leaderboards or multiplayer by choosing a name for yourself!";
    this.playerName = "<no name>";
    
    this.authTokenSubscription = this.dataBank.authObjectObservable$.subscribe(authObj => {
      this.playerName = this.jwtDecoder.getUserNameFromToken(authObj);
    });

    this.messageSubscription = this.dataBank.errorMsgObservable$.subscribe(message => {
      this.preLoginMessage = message;
    });
  }


  ngOnDestroy() {
    this.authTokenSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
  }


  public nameInputHandler(username: string) {

    let user = new User(username, "foo");
    this.restService.authenticateUser(user);
  }


  public logoutUser() {
    this.dataBank.clearCurrentAuthObject();
  }


  public isPlayerNameAvailable(): boolean {
    return (this.playerName != "<no name>");
  }


  public getPreLoginMessage(): string {
    return this.preLoginMessage;
  }


  public getPlayerName(): string {
    return this.playerName;
  }


  public onMouseEnter(hoverButton: HTMLElement) {
    hoverButton.style.opacity = "1";
  }


  public onMouseLeave(hoverButton: HTMLElement) {
    hoverButton.style.opacity = "0";
  }
}
