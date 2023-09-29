import { Tile } from "./tile";

export class MinesweeperGame {

    private tableSizes: Array<Array<number>>;
    private tableSizeSelected: number;
    private numberOfMines: number;
    
    private gameTable: Array<Array<Tile>>;

    constructor() {
        this.tableSizes = new Array;
        this.tableSizes.push([24, 20]);
        this.tableSizes.push([18, 14]);
        this.tableSizes.push([10, 8]);
    
        this.tableSizeSelected = 0;
        this.numberOfMines = Math.ceil(this.tableSizes[this.tableSizeSelected][0] * this.tableSizes[this.tableSizeSelected][1] * 0.17);
    
        this.gameTable = new Array();
    }

    
    public setTableSizeSelected(newSizeFromArray: number) {
    
        this.tableSizeSelected = newSizeFromArray;
        this.calculateNumberOfMines();
      }
      
      private calculateNumberOfMines()  {
        this.numberOfMines = Math.ceil(this.tableSizes[this.tableSizeSelected][0] * this.tableSizes[this.tableSizeSelected][1] * 0.17);
      }
      
      public getTableSizes(): Array<Array<number>> {
        return this.tableSizes;
      }
    
      private getGameTable(): Array<Array<Tile>> {
        return this.gameTable;
      }
}
