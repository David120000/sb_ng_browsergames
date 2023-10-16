import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthObject } from 'src/app/model/auth-object';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { RestAccessService } from 'src/app/service/rest-access.service';
import { UtilToShow } from '../model/utilToShowEnum';

@Component({
  selector: 'app-minesweeper-gameutils',
  templateUrl: './minesweeper-gameutils.component.html',
  styleUrls: ['./minesweeper-gameutils.component.css']
})
export class MinesweeperGameutilsComponent implements OnDestroy {

  private dataBank: DataSharingService;
  private restService: RestAccessService;
  private authObject: AuthObject | undefined;
  private authTokenSubscription: Subscription;

  private _utilToShow: UtilToShow;
  public get utilToShow(): UtilToShow {
    return this._utilToShow;
  }
  public set utilToShow(value: UtilToShow) {
    this._utilToShow = value;
  }
  utilToShowEnum = UtilToShow;


  constructor(dataBank: DataSharingService, restService: RestAccessService) {
    
    this.dataBank = dataBank;
    this.restService = restService;

    this.authObject = this.dataBank.getDeclaredAuthObject();
    
    this.authTokenSubscription = this.dataBank.authObjectObservable$.subscribe(authObj => {
      this.authObject = authObj;
    });

    this._utilToShow = UtilToShow.NONE;
  }


  ngOnDestroy(): void {
      this.authTokenSubscription.unsubscribe();
  }


  public isAuthObjectPresent(): boolean {
    return (this.authObject != undefined && this.authObject.isJwtPresent());
  }


  // public isDialogOpen(): boolean {
  //   return (this._utilToShow != UtilToShow.NONE);
  // }


  // public contentToDisplay(typeToShow: string): boolean {
  //   console.log(typeToShow + " == " + this.utilToShow + ": " + (typeToShow === UtilToShow.TUTORIAL));
  //   let result = false;

  //   if(typeToShow === UtilToShow.TUTORIAL) {
  //     result = true;
  //   }

  //   return result;
  // }


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
