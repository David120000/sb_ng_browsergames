import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ContentTypes } from './model/contentTypeEnum';
import { MinesweeperGame } from './service/minesweeper-game';


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

    let minesweeperGame = new MinesweeperGame(0);

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

          if(tile.isExplored() == true) {

            if(tile.getContentType() == ContentTypes.NEARBY && tile.getContainerDiv().childElementCount == 0) {

              let mineCounter = tile.getAdjacentMineCount();
              let tileDiv = tile.getContainerDiv();

              if(tileDiv.classList.contains("tiles-style-a")) {
                this.renderer.removeClass(tileDiv, "tiles-style-a");
                this.renderer.addClass(tileDiv, "tiles-explored-style-a");
              }
              else if(tileDiv.classList.contains("tiles-style-b")) {
                this.renderer.removeClass(tileDiv, "tiles-style-b");
                this.renderer.addClass(tileDiv, "tiles-explored-style-b");
              }

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
            else if(tile.getContentType() == ContentTypes.EMPTY) {

              let tileDiv = tile.getContainerDiv();

              if(tileDiv.classList.contains("tiles-style-a")) {
                this.renderer.removeClass(tileDiv, "tiles-style-a");
                this.renderer.addClass(tileDiv, "tiles-explored-style-a");
              }
              else if(tileDiv.classList.contains("tiles-style-b")) {
                this.renderer.removeClass(tileDiv, "tiles-style-b");
                this.renderer.addClass(tileDiv, "tiles-explored-style-b");
              }

            }
            else if(tile.getContentType() == ContentTypes.MINE && tile.getContainerDiv().childElementCount == 0) {

              let svgBomb = this.renderer.createElement("svg", "svg");
              svgBomb.setAttributeNS(null, "viewBox", "0 0 14 14");
              this.renderer.setAttribute(svgBomb, "fill", "#000000");
              this.renderer.setAttribute(svgBomb, "width", "100%");
              this.renderer.setAttribute(svgBomb, "height", "100%");
              this.renderer.setAttribute(svgBomb, "role", "img");
              this.renderer.setAttribute(svgBomb, "focusable", "false");
              this.renderer.setAttribute(svgBomb, "aria-hidden", "true");
              this.renderer.setAttribute(svgBomb, "xmlns", "http://www.w3.org/2000/svg");

              let svgBomb_path = this.renderer.createElement("path", "svg");
              this.renderer.setAttribute(svgBomb_path, "d", "m 11.324219,3.07539 -1.21875,1.21875 0.621093,0.6211 c 0.220313,0.22031 0.220313,0.57656 0,0.79453 L 10.31875,6.11758 C 10.595313,6.7293 10.75,7.40899 10.75,8.12383 c 0,2.69297 -2.1820313,4.875 -4.875,4.875 C 3.1820313,12.99883 1,10.81914 1,8.12617 c 0,-2.69296 2.1820312,-4.875 4.875,-4.875 0.7148437,0 1.3945312,0.15469 2.00625,0.43125 L 8.2890625,3.27461 C 8.509375,3.0543 8.865625,3.0543 9.0835937,3.27461 L 9.7046875,3.8957 10.923438,2.67695 11.324219,3.07539 Z m 1.394531,-0.66797 -0.5625,0 c -0.154688,0 -0.28125,0.12657 -0.28125,0.28125 0,0.15469 0.126562,0.28125 0.28125,0.28125 l 0.5625,0 C 12.873438,2.96992 13,2.84336 13,2.68867 13,2.53399 12.873438,2.40742 12.71875,2.40742 Z M 11.3125,1.00117 c -0.154688,0 -0.28125,0.12657 -0.28125,0.28125 l 0,0.5625 c 0,0.15469 0.126562,0.28125 0.28125,0.28125 0.154688,0 0.28125,-0.12656 0.28125,-0.28125 l 0,-0.5625 c 0,-0.15468 -0.126562,-0.28125 -0.28125,-0.28125 z m 0.794531,1.28907 0.398438,-0.39844 c 0.110156,-0.11016 0.110156,-0.28828 0,-0.39844 -0.110157,-0.11016 -0.288281,-0.11016 -0.398438,0 L 11.708594,1.8918 c -0.110157,0.11015 -0.110157,0.28828 0,0.39844 0.1125,0.11015 0.290625,0.11015 0.398437,0 z m -1.589062,0 c 0.110156,0.11015 0.288281,0.11015 0.398437,0 0.110156,-0.11016 0.110156,-0.28829 0,-0.39844 L 10.517969,1.49336 c -0.110156,-0.11016 -0.288281,-0.11016 -0.398438,0 -0.110156,0.11016 -0.110156,0.28828 0,0.39844 l 0.398438,0.39844 z m 1.589062,0.79687 c -0.110156,-0.11016 -0.288281,-0.11016 -0.398437,0 -0.110157,0.11016 -0.110157,0.28828 0,0.39844 l 0.398437,0.39844 c 0.110157,0.11015 0.288281,0.11015 0.398438,0 0.110156,-0.11016 0.110156,-0.28829 0,-0.39844 L 12.107031,3.08711 Z M 3.625,7.37617 c 0,-0.82734 0.6726562,-1.5 1.5,-1.5 0.20625,0 0.375,-0.16875 0.375,-0.375 0,-0.20625 -0.16875,-0.375 -0.375,-0.375 -1.2398438,0 -2.25,1.01016 -2.25,2.25 0,0.20625 0.16875,0.375 0.375,0.375 0.20625,0 0.375,-0.16875 0.375,-0.375 z");
              
              this.renderer.appendChild(svgBomb, svgBomb_path);
              this.renderer.appendChild(tile.getContainerDiv(), svgBomb);
            }
          }
          else {
            if(tile.isFlagged() == true && tile.getContainerDiv().childElementCount == 0) {

              let svgFlag = this.renderer.createElement("svg", "svg");
              svgFlag.setAttributeNS(null, "viewBox", "0 0 24 24");
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
              
              this.renderer.removeChild(tile.getContainerDiv(), tile.getContainerDiv().firstElementChild);
            }
          }

        }
      }
      this.changeDetectorRef.markForCheck();
    }
   
  }

}
