import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { MinesweeperGametableComponent } from './minesweeper-gametable/minesweeper-gametable.component';
import { MinesweeperTimerComponent } from './minesweeper-timer/minesweeper-timer.component';
import { Subscription } from 'rxjs';
import { MinesweeperResultdialogComponent } from './minesweeper-resultdialog/minesweeper-resultdialog.component';
import { DataSharingService } from 'src/app/service/common/data-sharing.service';
import { JwtDecoderService } from 'src/app/service/common/jwt-decoder.service';
import { AuthObject } from 'src/app/model/common/auth-object';
import { TimerStatus } from 'src/app/model/minesweeper/timerStatus';
import { MinesweeperScore } from 'src/app/model/minesweeper/minesweeper-score';


@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css'],
})
export class MinesweeperComponent implements AfterViewInit, OnDestroy {

  private elementRef: ElementRef;
  private renderer: Renderer2;
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
  

  constructor(elementRef: ElementRef, renderer: Renderer2, dataBank: DataSharingService, jwtDecoder: JwtDecoderService) {

    this.elementRef = elementRef;
    this.renderer = renderer;
    this.dataBank = dataBank;
    this.jwtDecoder = jwtDecoder;

    const authObjectFromService = this.dataBank.getDeclaredAuthObject();

    if(authObjectFromService != undefined) {
      this.authObject = authObjectFromService;
    }
    else {
      this.authObject = new AuthObject();
    }

    this.subscription =  this.dataBank.authObjectObservable$.subscribe(authObj => {
      this.authObject = authObj;
    });

    this.tableSizeSelected = 0;
    this.tableSizes = [];
    this.tableSizes[0] = [14, 18];
    
    this.timerEnabled = true;
  }


  ngAfterViewInit(): void {

    setTimeout(() => {
      if(this.minesweeperGametableComponent != undefined) {
        this.tableSizeSelected = this.minesweeperGametableComponent.getTableSizeSelected();
        this.tableSizes = this.minesweeperGametableComponent.getTableSizes();
      }
    }); 

    let dialog = this.elementRef.nativeElement.querySelector('#resultDialog');
    this.renderer.listen(dialog, 'cancel', (event) => event.preventDefault());

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
      
      console.log(minesweeperScore.date.toISOString() + " :: Your score is: " + minesweeperScore.score);

      let dialog = this.elementRef.nativeElement.querySelector('#resultDialog');
      
      this.minesweeperResultdialogComponent?.setDialogRef(dialog);
      this.minesweeperResultdialogComponent?.setScore(minesweeperScore);

      this.minesweeperResultdialogComponent?.persistScore();

      dialog.showModal();
    }


  }

}
