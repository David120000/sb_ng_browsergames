import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthObject } from 'src/app/model/auth-object';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilToShow } from '../model/utilToShowEnum';

@Component({
  selector: 'app-minesweeper-gameutils',
  templateUrl: './minesweeper-gameutils.component.html',
  styleUrls: ['./minesweeper-gameutils.component.css']
})
export class MinesweeperGameutilsComponent implements OnDestroy {

  private dataBank: DataSharingService;
  private userLoggedIn: boolean;
  private authTokenSubscription: Subscription;

  private _utilToShow: UtilToShow;
  public get utilToShow(): UtilToShow {
    return this._utilToShow;
  }
  public set utilToShow(value: UtilToShow) {
    this._utilToShow = value;
  }
  utilToShowEnum = UtilToShow;


  constructor(dataBank: DataSharingService) {
    
    this.dataBank = dataBank;

    this.userLoggedIn = (this.dataBank.getDeclaredAuthObject() != undefined);
    
    this.authTokenSubscription = this.dataBank.authObjectObservable$.subscribe(authObj => {

      this.userLoggedIn = authObj.isJwtPresent();
    });

    this._utilToShow = UtilToShow.NONE;
  }


  ngOnDestroy(): void {
      this.authTokenSubscription.unsubscribe();
  }


  public isUserLoggedIn(): boolean {
    return this.userLoggedIn;
  }

  
  public toggleTutorialDialog (){

    if(this._utilToShow != UtilToShow.TUTORIAL) {
      
      this._utilToShow = UtilToShow.TUTORIAL;
    }
    else {
      this._utilToShow = UtilToShow.NONE;
    }

  }


  public toggleLeaderboardDialog() {

    if(this._utilToShow != UtilToShow.LEADERBOARD) {
      
      this._utilToShow = UtilToShow.LEADERBOARD;
    }
    else {
      this._utilToShow = UtilToShow.NONE;
    }

  }


  public hideDialog() {
    this._utilToShow = UtilToShow.NONE;
  }

}
