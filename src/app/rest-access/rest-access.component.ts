import { Component, OnDestroy } from '@angular/core';
import { User } from '../model/user';
import { RestAccessService } from '../service/rest-access.service';
import { DataSharingService } from '../service/data-sharing.service';
import { JwtDecoderService } from '../service/jwt-decoder.service';
import { Subscription } from 'rxjs';
import { UsercheckResponse } from '../model/usercheck-response';
import { AuthObject } from '../model/auth-object';

@Component({
  selector: 'app-rest-access',
  templateUrl: './rest-access.component.html',
  styleUrls: ['./rest-access.component.css']
})
export class RestAccessComponent implements OnDestroy {

  private restService: RestAccessService;
  private dataBank: DataSharingService;
  private jwtDecoder: JwtDecoderService;
  private subscription: Subscription;
  private playerName;


  constructor(restService: RestAccessService, dataBank: DataSharingService, jwtDecoder: JwtDecoderService) {    
    
    this.restService = restService;
    this.dataBank = dataBank;
    this.jwtDecoder = jwtDecoder;

    this.playerName = "<no name>";
    
    this.subscription = this.dataBank.authObjectObservable$.subscribe(authObj => {
      this.playerName = this.jwtDecoder.getUserNameFromToken(authObj);
    });
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
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
