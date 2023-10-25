import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Tile } from 'src/app/model/tictactoe/tile';
import { TictactoeGame } from 'src/app/service/tictactoe/tictactoe-game';

@Component({
  selector: 'app-localgame',
  templateUrl: './localgame.component.html',
  styleUrls: ['./localgame.component.css']
})
export class LocalgameComponent {

  private elementRef: ElementRef;
  private renderer: Renderer2;

  private tictactoeGame: TictactoeGame;


  constructor(elementRef: ElementRef, renderer: Renderer2) {
    
    this.elementRef = elementRef
    this.renderer = renderer;

    this.tictactoeGame = new TictactoeGame();
  }


  public playerClick(rowPosition: number, columnPosition: number) {

    const tableChanged = this.tictactoeGame.playerClick(rowPosition, columnPosition);

    if(tableChanged == true) {

      let div = this.elementRef.nativeElement.querySelector(("#div" + rowPosition + "-" + columnPosition));
      this.renderer.removeClass(div, "clickable");
    }

  }


  public newGame(): TictactoeGame {

    for(let rowId = 0; rowId < 3; rowId++) {
      for(let colId = 0; colId < 3; colId++) {

        let div = this.elementRef.nativeElement.querySelector("#div" + rowId + "-" + colId);
        this.renderer.addClass(div, "clickable");
      }
    }

    return new TictactoeGame();
  }


  public getTile(rowPosition: number, columnPosition: number): Tile {
    return this.tictactoeGame.getTile(rowPosition, columnPosition);
  }

}
