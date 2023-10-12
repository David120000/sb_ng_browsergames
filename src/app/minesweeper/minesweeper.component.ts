import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { MinesweeperGametableComponent } from './minesweeper-gametable/minesweeper-gametable.component';
import { MinesweeperTimerComponent } from './minesweeper-timer/minesweeper-timer.component';
import { TimerStatus } from './model/timerStatus';
import { DataSharingService } from '../service/data-sharing.service';
import { MinesweeperScore } from '../model/minesweeper-score';
import { Subscription } from 'rxjs';
import { JwtDecoderService } from '../service/jwt-decoder.service';
import { RestAccessService } from '../service/rest-access.service';
import { AuthObject } from '../model/auth-object';
import { MinesweeperScorePersistResponse } from '../model/minesweeper-score-persist-response';


@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css'],
})
export class MinesweeperComponent implements AfterViewInit, OnDestroy {

  private dataBank: DataSharingService;
  private restAccess: RestAccessService;
  private jwtDecoder: JwtDecoderService;
  private subscription: Subscription;
  private authObject: AuthObject;  

  @ViewChild(MinesweeperGametableComponent)
  private minesweeperGametableComponent?: MinesweeperGametableComponent;

  @ViewChild(MinesweeperTimerComponent)
  private minesweeperTimerComponent?: MinesweeperTimerComponent;

  private tableSizeSelected: number;
  private tableSizes: Array<Array<number>>;

  private timerEnabled: boolean;
  

  constructor(dataBank: DataSharingService, restAccess: RestAccessService, jwtDecoder: JwtDecoderService) {

    this.dataBank = dataBank;
    this.restAccess = restAccess;
    this.jwtDecoder = jwtDecoder;
    this.authObject = new AuthObject();

    this.subscription =  this.dataBank.authObjectObservable$.subscribe(authObj => {
      console.log("minesweeper component's subscription detected a change");
      this.authObject = authObj;
    });

    this.tableSizeSelected = 0;
    this.tableSizes = [];
    this.tableSizes[0] = [20, 24];
    
    this.timerEnabled = true;
  }


  ngAfterViewInit(): void {

    setTimeout(() => {
      if(this.minesweeperGametableComponent != undefined) {
        this.tableSizeSelected = this.minesweeperGametableComponent.getTableSizeSelected();
        this.tableSizes = this.minesweeperGametableComponent.getTableSizes();
      }
    }); 

  }


  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }


  public getTableSizes(): Array<Array<number>> | undefined {
    return this.tableSizes;
  }
 
  public getTableSizeSelected(): number | undefined {
    return this.tableSizeSelected;
  }

  public resetGame() {

    this.minesweeperGametableComponent?.resetGame();
    this.timerEnabled;
  }

  public onTableSelect(tableSize: string | number) {
    this.minesweeperGametableComponent?.onTableSelect(tableSize);
  }

  public controlGameTimer(timerStatusChange: TimerStatus) {

    if(this.timerEnabled == true && timerStatusChange == TimerStatus.STOP) {    

      this.timerEnabled = false;
      this.minesweeperTimerComponent?.stopTimer();
    }

    if(this.timerEnabled == false && timerStatusChange == TimerStatus.START) {

      this.timerEnabled = true;
      this.minesweeperTimerComponent?.startNewTimer();
    }

    if(this.timerEnabled == true && timerStatusChange == TimerStatus.RESET) {

      this.minesweeperTimerComponent?.stopTimer();
      this.minesweeperTimerComponent?.startNewTimer();
    }
  }


  public calculateFinalScore(gameTime: number) {

    let score = this.minesweeperGametableComponent!.calculateFinalScore(gameTime);
    
    if(score > 0) {
      
      console.log(new Date().toISOString() + " :: Your score is: " + score);
      console.log("the jwt: " + this.authObject.getJwt());
      if(this.authObject.isJwtPresent() == true) {

        const minesweeperScore = new MinesweeperScore(
          0,
          this.jwtDecoder.getUserNameFromToken(this.authObject),
          score,
          this.tableSizes[this.tableSizeSelected][0] + "x" + this.tableSizes[this.tableSizeSelected][1],
          new Date()
        );

        this.restAccess.postNewMinesweeperScore(minesweeperScore, this.authObject.getJwt())
          .subscribe(response => {
            let responseObj = Object.assign(new MinesweeperScorePersistResponse(), response);
            console.log("Persist response [id: " + responseObj.getId() + ", " + responseObj.isSuccessfullyPersisted()+ "]");
          });
      }
      else {
        console.log("score save failed: user not logged in");
      }

    }
  }

}
