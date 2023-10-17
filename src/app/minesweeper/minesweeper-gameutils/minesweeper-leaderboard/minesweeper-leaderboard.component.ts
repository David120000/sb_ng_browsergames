import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthObject } from 'src/app/model/auth-object';
import { MineswScorePages } from 'src/app/model/minesw-score-pages';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { RestAccessService } from 'src/app/service/rest-access.service';

@Component({
  selector: 'app-minesweeper-leaderboard',
  templateUrl: './minesweeper-leaderboard.component.html',
  styleUrls: ['./minesweeper-leaderboard.component.css']
})
export class MinesweeperLeaderboardComponent implements OnInit, OnDestroy {

  private dataBank: DataSharingService;
  private restService: RestAccessService;

  private authObject: AuthObject | undefined;
  private tokenSubscription: Subscription;

  private _topScores: MineswScorePages | undefined;
  public get topScores(): MineswScorePages | undefined {
    return this._topScores;
  }

  constructor(dataBank: DataSharingService, restService: RestAccessService) {
    
    this.dataBank = dataBank;
    this.restService = restService;

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


  private getTopMinesweeperScores(page: number) {

    if(this.authObject != undefined && this.authObject.isJwtPresent() == true) {

      this.restService.getTopMinesweeperScores(this.authObject.getJwt(), page)
        .subscribe(response =>{
          this._topScores = Object.assign(new MineswScorePages(), response);
        });
    }
  }



}
