import { Component, DoCheck, ElementRef, Renderer2 } from '@angular/core';
import { Marks } from 'src/app/model/tictactoe/marks';
import { Tile } from 'src/app/model/tictactoe/tile';
import { TictactoeGame } from 'src/app/service/tictactoe/tictactoe-game';

@Component({
  selector: 'app-localgame',
  templateUrl: './localgame.component.html',
  styleUrls: ['./localgame.component.css']
})
export class LocalgameComponent implements DoCheck{

  private elementRef: ElementRef;
  private renderer: Renderer2;

  private announcerText: string;
  private tictactoeGame: TictactoeGame;


  constructor(elementRef: ElementRef, renderer: Renderer2) {
    
    this.elementRef = elementRef
    this.renderer = renderer;

    this.announcerText = "Waiting for the game to start.";
    this.tictactoeGame = new TictactoeGame(true);
  }


  ngDoCheck(): void {
    this.handleAnnouncerElements();
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

    return new TictactoeGame(true);
  }


  private handleAnnouncerElements() {

    if(this.tictactoeGame.isGameOn() == true) {
      
      this.announcerText = "Next:";
      this.displayNextPlayer();
    }
    else {

      let xIndicator = this.elementRef.nativeElement.querySelector("#nextPlayerX");
      let oIndicator = this.elementRef.nativeElement.querySelector("#nextPlayerO");

      if(this.tictactoeGame.getWinners().length == 1) {

        this.announcerText = "We have a WINNER!"

        if(this.tictactoeGame.getWinners()[0] == Marks.X) {

          this.renderer.removeClass(xIndicator, "notYouNext");
          this.renderer.addClass(xIndicator, "youNext");
    
          this.renderer.removeClass(oIndicator, "youNext");
          this.renderer.addClass(oIndicator, "notYouNext");
        }
        else {

          this.renderer.removeClass(xIndicator, "youNext");
          this.renderer.addClass(xIndicator, "notYouNext");
    
          this.renderer.removeClass(oIndicator, "notYouNext");
          this.renderer.addClass(oIndicator, "youNext");
        }

        let button = this.elementRef.nativeElement.querySelector("#newGameBtn");
        this.renderer.setStyle(button, "visibility", "visible");

      }
      else if(this.tictactoeGame.getWinners().length == 2) {

        this.announcerText = "Draw game! Both players won.";

        this.renderer.removeClass(xIndicator, "notYouNext");
        this.renderer.addClass(xIndicator, "youNext");

        this.renderer.removeClass(oIndicator, "notYouNext");
        this.renderer.addClass(oIndicator, "youNext");

        let button = this.elementRef.nativeElement.querySelector("#newGameBtn");
        this.renderer.setStyle(button, "visibility", "visible");
      }
      else if(this.tictactoeGame.getPlayerClickCount() == (this.tictactoeGame.getTableSize() * this.tictactoeGame.getTableSize())) {

        this.announcerText = "Draw game!";

        this.renderer.removeClass(xIndicator, "youNext");
        this.renderer.addClass(xIndicator, "notYouNext");

        this.renderer.removeClass(oIndicator, "youNext");
        this.renderer.addClass(oIndicator, "notYouNext");

        let button = this.elementRef.nativeElement.querySelector("#newGameBtn");
        this.renderer.setStyle(button, "visibility", "visible");
      }
    }

  }


  private displayNextPlayer() {

    let xIndicator = this.elementRef.nativeElement.querySelector("#nextPlayerX");
    let oIndicator = this.elementRef.nativeElement.querySelector("#nextPlayerO");

    if(this.tictactoeGame.whoIsNext() == Marks.X) {

      this.renderer.removeClass(xIndicator, "notYouNext");
      this.renderer.addClass(xIndicator, "youNext");

      this.renderer.removeClass(oIndicator, "youNext");
      this.renderer.addClass(oIndicator, "notYouNext");
    }
    else if(this.tictactoeGame.whoIsNext() == Marks.O) {

      this.renderer.removeClass(xIndicator, "youNext");
      this.renderer.addClass(xIndicator, "notYouNext");

      this.renderer.removeClass(oIndicator, "notYouNext");
      this.renderer.addClass(oIndicator, "youNext");
    }
    else {

      this.renderer.removeClass(xIndicator, "youNext");
      this.renderer.addClass(xIndicator, "notYouNext");

      this.renderer.removeClass(oIndicator, "youNext");
      this.renderer.addClass(oIndicator, "notYouNext");
    }
  }


  public startNewGame() {

    if( (this.tictactoeGame.getWinners().length > 0 && this.tictactoeGame.isGameOn() == false) 
        || 
        this.tictactoeGame.getPlayerClickCount() == (this.tictactoeGame.getTableSize() * this.tictactoeGame.getTableSize())
      ) {

      this.announcerText = "Waiting for the game to start.";

      let button = this.elementRef.nativeElement.querySelector("#newGameBtn");
      this.renderer.setStyle(button, "visibility", "hidden");
      
      this.tictactoeGame = new TictactoeGame(true);
    }

  }


  public getTile(rowPosition: number, columnPosition: number): Tile {
    return this.tictactoeGame.getTile(rowPosition, columnPosition);
  }


  public getAnnouncerText(): string {
    return this.announcerText;
  }

}
