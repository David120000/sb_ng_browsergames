import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MinesweeperGame } from './model/minesweeper-game';
import { ContentTypes } from './model/contentTypeEnum';


@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MinesweeperComponent {

  private elementRef: ElementRef;
  private renderer: Renderer2;
  private changeDetectorRef: ChangeDetectorRef;
  private http: HttpClient;

  private minesweeperGame?: MinesweeperGame;


  constructor(elementRef: ElementRef, renderer: Renderer2, changeDetectorRef: ChangeDetectorRef, http: HttpClient) { 
    this.elementRef = elementRef;
    this.renderer = renderer;
    this.changeDetectorRef = changeDetectorRef;
    this.http = http;
  }


  ngOnInit() {
    this.minesweeperGame = this.newGame();
  }

  ngDoCheck() {
    this.refreshView();
  }
  

  public newGame(): MinesweeperGame {

    let minesweeperGame = new MinesweeperGame(this.changeDetectorRef);

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
        this.renderer.listen(tileDiv, 'contextmenu', () => this.refreshView());
        this.renderer.appendChild(tableCell, tileDiv);

        minesweeperGame.addTileToGameTable(tileDiv, row, col);
      }

    }

    return minesweeperGame;
  }


  public refreshView() {
    
    let gameTable = this.minesweeperGame?.getGameTable();

    if(gameTable != undefined) {
      for(let row = 0; row < gameTable.length; row++) {
        for(let col = 0; col < gameTable[0].length; col++) {
          
          let tile = gameTable[row][col];
          // console.log("the tile at [" + row + "," + col + "] is explored: " + tile.isExplored() + " or flagged: " + tile.isFlagged());
          if(tile.isExplored() == true) {

            if(tile.getContentType() == ContentTypes.NEARBY && tile.getContainerDiv().childElementCount == 0) {

              let mineCounter = tile.getAdjacentMineCount();

              let nearbyMineCounterText = this.renderer.createElement("p");
              this.renderer.appendChild(nearbyMineCounterText, this.renderer.createText(mineCounter + ""));
              this.renderer.addClass(nearbyMineCounterText, "counterText");

              if(mineCounter == 1) {
                this.renderer.setStyle(nearbyMineCounterText, "color", "rgb(0, 0, 255)");
              }
              else if(mineCounter == 2) {
                this.renderer.setStyle(nearbyMineCounterText, "color", "rgb(0, 130, 0)");
              }
              else if(mineCounter == 3) {
                this.renderer.setStyle(nearbyMineCounterText, "color", "rgb(254, 0, 0)");
              }
              else if(mineCounter == 4) {
                this.renderer.setStyle(nearbyMineCounterText, "color", "rgb(0, 0, 132)");
              }
              else if(mineCounter == 5) {
                this.renderer.setStyle(nearbyMineCounterText, "color", "rgb(132, 0, 0)");
              }
              else if(mineCounter == 6) {
                this.renderer.setStyle(nearbyMineCounterText, "color", "rgb(0, 130, 132)");
              }
              else if(mineCounter == 7) {
                this.renderer.setStyle(nearbyMineCounterText, "color", "rgb(132, 0, 132)");
              }
              else {
                this.renderer.setStyle(nearbyMineCounterText, "color", "rgb(117, 117, 117)");
              }

              this.renderer.appendChild(tile.getContainerDiv(), nearbyMineCounterText);
            }
            else {

            }
          }
          else {
            if(tile.isFlagged() == true && tile.getContainerDiv().childElementCount == 0) {

              let svgFlag = this.renderer.createElement("svg", "svg");
              svgFlag.setAttributeNS(null, 'viewBox', "0 0 24 24");
              this.renderer.setAttribute(svgFlag, "fill", "none");
              this.renderer.setAttribute(svgFlag, "stroke", "#ff0000");
              this.renderer.setAttribute(svgFlag, "xmlns", "http://www.w3.org/2000/svg");
              this.renderer.setAttribute(svgFlag, "width", "100%");
              this.renderer.setAttribute(svgFlag, "height", "100%");

              let svgFlag_g1 = this.renderer.createElement("g", "svg");
              this.renderer.setAttribute(svgFlag_g1, "id", "SVGRepo_bgCarrier");
              this.renderer.setAttribute(svgFlag_g1, "stroke-width", "0");
              this.renderer.appendChild(svgFlag, svgFlag_g1);

              let svgFlag_g2 = this.renderer.createElement("g", "svg");
              this.renderer.setAttribute(svgFlag_g2, "id", "SVGRepo_tracerCarrier");
              this.renderer.setAttribute(svgFlag_g2, "stroke-linecap", "round");
              this.renderer.setAttribute(svgFlag_g2, "stroke-linejoin", "round");
              this.renderer.appendChild(svgFlag, svgFlag_g2);

              let svgFlag_g3 = this.renderer.createElement("g", "svg");
              this.renderer.setAttribute(svgFlag_g3, "id", "SVGRepo_iconCarrier");
              this.renderer.appendChild(svgFlag, svgFlag_g3);

              let svgFlag_path1 = this.renderer.createElement("path", "svg");
              this.renderer.setAttribute(svgFlag_path1, "d", "M16.577 8.52566L6.65811 5.21937C6.3578 5.11927 6.20764 5.06921 6.10382 5.14405C6 5.21888 6 5.37716 6 5.69371V13L16.577 9.47434C17.1653 9.27824 17.4594 9.18019 17.4594 9C17.4594 8.81981 17.1653 8.72176 16.577 8.52566Z");
              this.renderer.setAttribute(svgFlag_path1, "fill", "#ff0000");
              this.renderer.appendChild(svgFlag_g3, svgFlag_path1);

              let svgFlag_path2 = this.renderer.createElement("path", "svg");
              this.renderer.setAttribute(svgFlag_path2, "d", "M6 13V5.69371C6 5.37716 6 5.21888 6.10382 5.14405C6.20764 5.06921 6.3578 5.11927 6.65811 5.21937L16.577 8.52566C17.1653 8.72176 17.4594 8.81981 17.4594 9C17.4594 9.18019 17.1653 9.27824 16.577 9.47434L6 13ZM6 13V18V19");
              this.renderer.setAttribute(svgFlag_path2, "stroke", "#ff0000");
              this.renderer.setAttribute(svgFlag_path2, "stroke-width", "2");
              this.renderer.setAttribute(svgFlag_path2, "stroke-linecap", "round");
              this.renderer.appendChild(svgFlag_g3, svgFlag_path2);

              this.renderer.appendChild(tile.getContainerDiv(), svgFlag);
            }
            else if(tile.isFlagged() == false && tile.getContainerDiv().childElementCount > 0) {
              
              // UNFLAG
              
            }
          }

        }
      }
      this.changeDetectorRef.markForCheck();
    }
   
  }

}
