import { Component } from '@angular/core';

@Component({
  selector: 'app-minesweeper-timer',
  templateUrl: './minesweeper-timer.component.html',
  styleUrls: ['./minesweeper-timer.component.css']
})
export class MinesweeperTimerComponent {

  private timer: number;
  private enabled: boolean;
  private intervalObject?: ReturnType<typeof setInterval>;


  constructor() {
    this.timer = 0;
    this.enabled = true;
  }


  ngAfterViewInit() {

    let initTime = new Date().getTime();

    this.intervalObject = setInterval(() => {
      
      this.timer = Math.floor((new Date().getTime() - initTime) / 1000);

    } , 1000);
  }


  ngDoCheck() {

    if(this.enabled == false) {
      clearInterval(this.intervalObject);
    }
  }


  public getTimer(): number {
    return this.timer;
  }

}
