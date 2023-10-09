import { AfterViewInit, Component, DoCheck, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-minesweeper-timer',
  templateUrl: './minesweeper-timer.component.html',
  styleUrls: ['./minesweeper-timer.component.css']
})
export class MinesweeperTimerComponent implements AfterViewInit {

  private timer: number;
  private intervalObject?: ReturnType<typeof setInterval>;

  @Output()
  private numemitter: EventEmitter<number>;
 

  constructor() {

    this.timer = 0;
    this.numemitter = new EventEmitter<number>;
  }


  ngAfterViewInit() {

    this.startNewTimer();
  }


  public stopTimer() {

    clearInterval(this.intervalObject);
    this.numemitter.emit(this.timer);
  }

  public startNewTimer() {
    
    this.timer = 0;

    let initTime = new Date().getTime();

    this.intervalObject = setInterval(() => {
      
      this.timer = Math.floor((new Date().getTime() - initTime) / 1000);

    } , 1000);
  }

  public getTimer(): number {
    return this.timer;
  }

}
