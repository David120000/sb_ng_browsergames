import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthObject } from 'src/app/model/auth-object';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { RestAccessService } from 'src/app/service/rest-access.service';

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

  private showInfoDialog: boolean;


  constructor(dataBank: DataSharingService, restService: RestAccessService) {
    
    this.dataBank = dataBank;
    this.restService = restService;

    this.authObject = this.dataBank.getDeclaredAuthObject();
    
    this.authTokenSubscription = this.dataBank.authObjectObservable$.subscribe(authObj => {
      this.authObject = authObj;
    });

    this.showInfoDialog = false;
  }


  ngOnDestroy(): void {
      this.authTokenSubscription.unsubscribe();
  }


  public isAuthObjectPresent(): boolean {
    return (this.authObject != undefined && this.authObject.isJwtPresent());
  }


  public isDialogOpen(): boolean {
    return this.showInfoDialog;
  }


  public toggleTutorialDialog (){
    this.showInfoDialog = (!this.showInfoDialog);
  }


  public hideOpenedDialog() {
    this.showInfoDialog = false;
  }

}
