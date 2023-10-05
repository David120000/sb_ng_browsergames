import { AfterViewInit, Component, ViewChild } from '@angular/core';
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
  private gameTime: number;


  constructor() {

    this.tableSizeSelected = 0;
    this.tableSizes = [];
    this.tableSizes[0] = [20, 24];
    
    this.timerEnabled = true;
    this.gameTime = 0;
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

  public setGameTime(gameTime: number) {
    this.gameTime = gameTime;
  }

  public getGameTime(): number {
    return this.gameTime;
  }
}
