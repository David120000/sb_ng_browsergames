import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MinesweeperGame } from './model/minesweeper-game';


@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css']
})
export class MinesweeperComponent {

  private minesweeperGame: MinesweeperGame;
  private http: HttpClient;


  constructor(http: HttpClient) { 
    this.minesweeperGame = new MinesweeperGame();
    this.http = http;
  }







}
