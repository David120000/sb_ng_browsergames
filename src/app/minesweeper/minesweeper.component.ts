import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MinesweeperGametableComponent } from './minesweeper-gametable/minesweeper-gametable.component';
import { MinesweeperTimerComponent } from './minesweeper-timer/minesweeper-timer.component';
import { TimerStatus } from './model/timerStatus';
import { DataSharingService } from '../service/data-sharing.service';
import { MinesweeperScore } from '../model/minesweeper-score';
import { Subscription } from 'rxjs';
import { JwtDecoderService } from '../service/jwt-decoder.service';
import { AuthObject } from '../model/auth-object';
import { MinesweeperResultdialogComponent } from './minesweeper-resultdialog/minesweeper-resultdialog.component';


@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css'],
})
export class MinesweeperComponent implements AfterViewInit, OnDestroy {

  private elementRef: ElementRef;
  private dataBank: DataSharingService;
  private jwtDecoder: JwtDecoderService;
  private subscription: Subscription;
  private authObject: AuthObject;

  @ViewChild(MinesweeperGametableComponent)
  private minesweeperGametableComponent?: MinesweeperGametableComponent;

  @ViewChild(MinesweeperTimerComponent)
  private minesweeperTimerComponent?: MinesweeperTimerComponent;

  @ViewChild(MinesweeperResultdialogComponent)
  private minesweeperResultdialogComponent?: MinesweeperResultdialogComponent;

  private tableSizeSelected: number;
  private tableSizes: Array<Array<number>>;

  private timerEnabled: boolean;
  

  constructor(elementRef: ElementRef, dataBank: DataSharingService, jwtDecoder: JwtDecoderService) {

    this.elementRef = elementRef;
    this.dataBank = dataBank;
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
    this.tableSizeSelected = this.minesweeperGametableComponent!.onTableSelect(tableSize);
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

      const minesweeperScore = new MinesweeperScore(
        0,
        this.jwtDecoder.getUserNameFromToken(this.authObject),
        score,
        this.tableSizes[this.tableSizeSelected][1] + "x" + this.tableSizes[this.tableSizeSelected][0],
        new Date()
      );
      
      console.log(minesweeperScore.getDate().toISOString() + " :: Your score is: " + minesweeperScore.getScore());

      let dialog = this.elementRef.nativeElement.querySelector('#resultDialog');
      
      this.minesweeperResultdialogComponent?.setDialogRef(dialog);
      this.minesweeperResultdialogComponent?.setScore(minesweeperScore);

      this.minesweeperResultdialogComponent?.persistScore();

      dialog.showModal();
    }


  }

}
