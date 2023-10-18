import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthObject } from 'src/app/model/auth-object';
import { MineswScorePages } from 'src/app/model/minesw-score-pages';
import { MinesweeperScore } from 'src/app/model/minesweeper-score';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { JwtDecoderService } from 'src/app/service/jwt-decoder.service';
import { RestAccessService } from 'src/app/service/rest-access.service';

@Component({
  selector: 'app-minesweeper-leaderboard',
  templateUrl: './minesweeper-leaderboard.component.html',
  styleUrls: ['./minesweeper-leaderboard.component.css']
})
export class MinesweeperLeaderboardComponent implements OnInit, OnDestroy {

  private dataBank: DataSharingService;
  private restService: RestAccessService;
  private jwtDecoder: JwtDecoderService;

  private authObject: AuthObject | undefined;
  private tokenSubscription: Subscription;

  private _topScores: MineswScorePages | undefined;
  public get topScores(): MineswScorePages | undefined {
    return this._topScores;
  }

  constructor(dataBank: DataSharingService, restService: RestAccessService, jwtDecoder: JwtDecoderService) {
    
    this.dataBank = dataBank;
    this.restService = restService;
    this.jwtDecoder = jwtDecoder;

    this.authObject = this.dataBank.getDeclaredAuthObject();

    this.tokenSubscription = this.dataBank.authObjectObservable$.subscribe(authObj => {
      this.authObject = authObj;
    } );
  }


  ngOnInit(): void {
    this.getTopMinesweeperScores(0);
  }


  ngOnDestroy(): void {
    this.tokenSubscription.unsubscribe();
  }


  public getTopMinesweeperScores(page: number) {

    if(this.authObject != undefined && this.authObject.isJwtPresent() == true) {

      this.restService.getTopMinesweeperScores(this.authObject.getJwt(), page)
        .subscribe(response => {
          this._topScores = Object.assign(new MineswScorePages(), response);
        });
    }
  }


  public getTopMineseeperScoresString(page: string) {
    this.getTopMinesweeperScores( Number(page) );
  }


  public topScoreSwipeLeft() {
    
    if(this._topScores != undefined && this.authObject != undefined && this.authObject.isJwtPresent() == true) {

      let newPage = this._topScores.getCurrentPageNumber() - 1;

      this.restService.getTopMinesweeperScores(this.authObject.getJwt(), newPage)
        .subscribe(response => {
          this._topScores = Object.assign(new MineswScorePages(), response);
        });
    }

  }

  public topScoreSwipeRight() {

    if(this._topScores != undefined && this.authObject != undefined && this.authObject.isJwtPresent() == true) {

      let newPage = this._topScores.getCurrentPageNumber() + 1;

      this.restService.getTopMinesweeperScores(this.authObject.getJwt(), newPage)
        .subscribe(response => {
          this._topScores = Object.assign(new MineswScorePages(), response);
        });
    }
  }


  public getAuthenticatedUserTopScores(page: number) {

    if(this.authObject != undefined && this.authObject.isJwtPresent() == true) {

      const userName = this.jwtDecoder.getUserNameFromToken(this.authObject);

      this.restService.getUserTopScores(this.authObject.getJwt(), userName, "desc", page)
        .subscribe(response => {

          let topScores = Object.assign(new MineswScorePages(), response);
          topScores.setUserName(userName);
          this._topScores = topScores;

        });
    }

  }


  public getCustomUserTopScores(page: number, username: string) {

    if(this.authObject != undefined && this.authObject.isJwtPresent() == true) {

      this.restService.getUserTopScores(this.authObject.getJwt(), username, "desc", Number(page))
        .subscribe(response => {

          let topScores = Object.assign(new MineswScorePages(), response);
          topScores.setUserName(username);
          this._topScores = topScores;

        });
    }
  }


  public getCustomUserScoresOrderedByDateString(page: string, username: string) {
    this.getCustomUserTopScores(Number(page), username);
  }


  public userScoreSwipeLeft() {
    
    if(this._topScores != undefined && this.authObject != undefined && this.authObject.isJwtPresent() == true) {

      let newPage = this._topScores.getCurrentPageNumber() - 1;

      this.restService.getUserTopScores(this.authObject.getJwt(), this._topScores.getUserName()!, "desc", newPage)
        .subscribe(response => {

          let topScores = Object.assign(new MineswScorePages(), response);
          topScores.setUserName(this._topScores!.getUserName()!);
          this._topScores = topScores;

        });
    }

  }

  public userScoreSwipeRight() {

    if(this._topScores != undefined && this.authObject != undefined && this.authObject.isJwtPresent() == true) {

      let newPage = this._topScores.getCurrentPageNumber() + 1;

      this.restService.getUserTopScores(this.authObject.getJwt(), this._topScores.getUserName()!, "desc", newPage)
        .subscribe(response => {
          
          let topScores = Object.assign(new MineswScorePages(), response);
          topScores.setUserName(this._topScores!.getUserName()!);
          this._topScores = topScores;

        });
    }
  }

}
