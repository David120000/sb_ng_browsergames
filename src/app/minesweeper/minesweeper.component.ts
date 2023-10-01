import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MinesweeperGame } from './model/minesweeper-game';


@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css']
})
export class MinesweeperComponent {

  private elementRef: ElementRef;
  private renderer: Renderer2;
  private http: HttpClient;

  private minesweeperGame?: MinesweeperGame;
  
  

  
  constructor(elementRef: ElementRef, renderer: Renderer2, http: HttpClient) { 
    this.elementRef = elementRef;
    this.renderer = renderer;
    this.http = http;
  }


  ngOnInit() {
    this.minesweeperGame = this.newGame();
  }
  

  public newGame(): MinesweeperGame {

    let minesweeperGame = new MinesweeperGame();

    let gameTable = this.elementRef.nativeElement.querySelector('#gameTable');

    for(let row = 0; row < minesweeperGame.getTableHorizontalSize(); row++) {
      
      let tableRow = this.renderer.createElement("tr");
      this.renderer.appendChild(gameTable, tableRow);

      for(let col = 0; col < minesweeperGame.getTableVerticalSize(); col++) {

        let tableCell = this.renderer.createElement("td");
        this.renderer.appendChild(tableRow, tableCell);
        let tileDiv = this.renderer.createElement("div");

        if((row + col) % 2 == 0) {
          this.renderer.addClass(tileDiv, "tiles-style-a");
        }
        else {
          this.renderer.addClass(tileDiv, "tiles-style-b");
        }

        this.renderer.listen(tileDiv, 'contextmenu', (event) => event.preventDefault());
        this.renderer.appendChild(tableCell, tileDiv);
        
        minesweeperGame.addTileToGameTable(tileDiv, row, col);
      }

    }

    return minesweeperGame;
  }

}
