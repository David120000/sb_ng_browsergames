import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthObject } from 'src/app/model/auth-object';
import { MinesweeperScore } from 'src/app/model/minesweeper-score';
import { MinesweeperScorePersistResponse } from 'src/app/model/minesweeper-score-persist-response';
import { User } from 'src/app/model/user';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { JwtDecoderService } from 'src/app/service/jwt-decoder.service';
import { RestAccessService } from 'src/app/service/rest-access.service';

@Component({
  selector: 'app-minesweeper-resultdialog',
  templateUrl: './minesweeper-resultdialog.component.html',
  styleUrls: ['./minesweeper-resultdialog.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class MinesweeperResultdialogComponent implements OnDestroy {

  private minesweeperScore: MinesweeperScore | undefined;
  private selfElement: HTMLDialogElement | undefined;
  private elementRef: ElementRef;

  private dataBank: DataSharingService;
  private authObject: AuthObject;
  private restService: RestAccessService;
  private jwtDecoder: JwtDecoderService;
  private subscription: Subscription;

  private restResponse: MinesweeperScorePersistResponse | undefined;
  

  constructor(elementRef: ElementRef, dataBank: DataSharingService, restService: RestAccessService, jwtDecoder: JwtDecoderService) {

    this.elementRef = elementRef;
    this.dataBank = dataBank;
    this.restService = restService;
    this.jwtDecoder = jwtDecoder;

    const authObjectFromService = this.dataBank.getDeclaredAuthObject();

    if(authObjectFromService != undefined) {
      this.authObject = authObjectFromService;
    }
    else {
      this.authObject = new AuthObject();
    }

    this.subscription = this.dataBank.authObjectObservable$.subscribe(authObj => {
      this.authObject = authObj;
      this.persistScore();
    });
  }


  ngOnDestroy() {
      this.subscription.unsubscribe();
  }


  public persistScore() {

    if(this.minesweeperScore != undefined && this.isUserAuthenticated() == true) {

      if(this.minesweeperScore.userName == "<no name>") {
        this.minesweeperScore.userName = this.jwtDecoder.getUserNameFromToken(this.authObject);
      }

      let persistResponse = new MinesweeperScorePersistResponse();

      this.restService.postNewMinesweeperScore(this.minesweeperScore, this.authObject.getJwt())
        .subscribe(response => {
          Object.assign(persistResponse, response);
        });

      this.restResponse = persistResponse;

      if(persistResponse.isSuccessfullyPersisted() == true) {
        this.minesweeperScore = undefined;
      }

    }

  }
  

  public nameInputHandler(username: string) {

    let user = new User(username, "foo");
    this.restService.authenticateUser(user);
  }


  public discardScore() {

    let confirmationDialogElement = this.elementRef.nativeElement.querySelector('#discardConfirmDialog');
    confirmationDialogElement.showModal();
  }


  public closeDialog() {
    this.selfElement?.close();
  }


  public closeConfirmationDialog() {

    let confirmationDialogElement = this.elementRef.nativeElement.querySelector('#discardConfirmDialog');
    confirmationDialogElement.close();
  }


  public getScoreObject(): MinesweeperScore | undefined {
    return this.minesweeperScore;
  }


  public setDialogRef(dialogElement: HTMLDialogElement) {
    this.selfElement = dialogElement;
  }


  public setScore(score: MinesweeperScore) {
    this.minesweeperScore = score;
  }


  public isUserAuthenticated(): boolean {
    return this.authObject.isJwtPresent();
  }

  
  public getRestResponse(): MinesweeperScorePersistResponse | undefined {
    return this.restResponse;
  }
}



