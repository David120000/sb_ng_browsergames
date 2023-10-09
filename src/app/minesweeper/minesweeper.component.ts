import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MinesweeperGametableComponent } from './minesweeper-gametable/minesweeper-gametable.component';
import { MinesweeperTimerComponent } from './minesweeper-timer/minesweeper-timer.component';
import { TimerStatus } from './model/timerStatus';


@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css'],
})
export class MinesweeperComponent implements AfterViewInit {

  @ViewChild(MinesweeperGametableComponent)
  private minesweeperGametableComponent?: MinesweeperGametableComponent;

  @ViewChild(MinesweeperTimerComponent)
  private minesweeperTimerComponent?: MinesweeperTimerComponent;

  private tableSizeSelected: number | undefined;
  private tableSizes: Array<Array<number>> | undefined;

  private timerEnabled: boolean;
  
  // @Input()
  // public get gameTime(): number {
  //   return this._gameTime;
  // }
  // public set gameTime(value: number) {
  //   console.log("game time received: " + value);
  //   this._gameTime = value;
  //   this.calculateFinalScore(this._gameTime);
  // }
  // private _gameTime: number;


  constructor() {

    this.tableSizeSelected = 0;
    this.tableSizes = [];
    this.tableSizes[0] = [20, 24];
    
    this.timerEnabled = true;
    // this._gameTime = 0;
  }


  ngAfterViewInit(): void {

    setTimeout(() => {
      this.tableSizeSelected = this.minesweeperGametableComponent?.getTableSizeSelected();
      this.tableSizes = this.minesweeperGametableComponent?.getTableSizes();
    }); 

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

    }
  }

}
