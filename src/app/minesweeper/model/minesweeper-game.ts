import { Tile } from "./tile";

export class MinesweeperGame {

    private tableSizes: Array<Array<number>>;
    private tableSizeSelected: number;
    private numberOfMines: number;
    private firstClick: boolean;
    private gameFinished: boolean;
    
    private gameTable: Array<Array<Tile>>;

    constructor() {

      this.tableSizes = new Array;
      this.tableSizes.push([24, 20]);
      this.tableSizes.push([18, 14]);
      this.tableSizes.push([10, 8]);
  
      this.tableSizeSelected = 0;
      this.numberOfMines = this.calculateNumberOfMines();
      this.firstClick = true;
      this.gameFinished = false;

      this.gameTable = new Array;
      this.gameTable[0] = new Array;
  }

    
    public setTableSizeSelected(newSizeByListIndex: number) {

      this.tableSizeSelected = newSizeByListIndex;
      this.numberOfMines = this.calculateNumberOfMines();
    }
      
    private calculateNumberOfMines(): number  {
      return Math.ceil(this.tableSizes[this.tableSizeSelected][0] * this.tableSizes[this.tableSizeSelected][1] * 0.17);
    }
    

    public addTileToGameTable(tileDiv: any, rowPosition: number, columnPosition: number) {

      let tile = new Tile(tileDiv);

      tile.getContainerDiv().addEventListener('click', () => {
        alert('You just a clicked a dynamically created element! row: ' + rowPosition + ', col: ' + columnPosition);
      });

      tile.getContainerDiv().addEventListener('contextmenu', () => {
        alert('You just a RIGHT CLICKED a dynamically created element! row: ' + rowPosition + ', col: ' + columnPosition);
        return false;
      });

      if(this.gameTable.length < rowPosition) {

        this.gameTable[rowPosition] = new Array();
        this.gameTable[rowPosition][columnPosition] = tile;
      }

      if(rowPosition == this.tableSizes[this.tableSizeSelected][0] - 1 && columnPosition == this.tableSizes[this.tableSizeSelected][1] - 1) {
        this.setAdjacencyForTiles();
      }
    }


    private setAdjacencyForTiles() {

      for(let row = 0; row < this.gameTable.length; row++) {
        for(let col = 0; col < this.gameTable[0].length; col++) {


        }
      }
    }


    public getTableSizes(): Array<Array<number>> {
      return this.tableSizes;
    }


    public getTableVerticalSize(): number {
      return this.tableSizes[this.tableSizeSelected][1];
    }

    
    public getTableHorizontalSize(): number {
      return this.tableSizes[this.tableSizeSelected][0];
    }

    public isFirstClick(): boolean {
      return this.firstClick;
    }

    public setFirstClick(newValue: boolean) {
      this.firstClick = newValue;
    }
}
