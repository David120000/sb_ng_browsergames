import { ContentTypes } from "../model/contentTypeEnum";
import { Tile } from "../model/tile";


export class MinesweeperGame {

  private tableSizes: Array<Array<number>>;
  private tableSizeSelected: number;
  private numberOfMines: number;
  private firstClick: boolean;
  private gameFinished: boolean;
  private tilesToExplore: number;
  
  private gameTable: Tile[][];


  constructor(tableSizeSelected: number) {

    this.tableSizes = new Array;
    this.tableSizes.push([20, 24]);
    this.tableSizes.push([14, 18]);
    this.tableSizes.push([8, 10]);

    this.tableSizeSelected = tableSizeSelected;
    this.numberOfMines = this.calculateNumberOfMines();
    this.firstClick = true;
    this.gameFinished = false;
    this.tilesToExplore = (this.tableSizes[this.tableSizeSelected][0] * this.tableSizes[this.tableSizeSelected][1]) - this.numberOfMines;
    this.gameTable = [];
  }

    
  public setTableSizeSelected(newSizeByListIndex: number) {

    this.tableSizeSelected = newSizeByListIndex;
    this.numberOfMines = this.calculateNumberOfMines();
  }
    
  private calculateNumberOfMines(): number  {
    return Math.ceil(this.tableSizes[this.tableSizeSelected][0] * this.tableSizes[this.tableSizeSelected][1] * 0.17);
  }
  

  public addTileToGameTable(tileDiv: HTMLDivElement, rowPosition: number, columnPosition: number) {

    let tile = new Tile(tileDiv);

    tile.getContainerDiv().addEventListener('click', () => {
      this.explore(rowPosition, columnPosition);
    });

    tile.getContainerDiv().addEventListener('contextmenu', () => {
      this.flagTile(rowPosition, columnPosition);
    });

    if(this.gameTable[rowPosition] == undefined) {
      this.gameTable[rowPosition] = [];
    }
    this.gameTable[rowPosition][columnPosition] = tile;

    if(rowPosition == this.tableSizes[this.tableSizeSelected][0] - 1 && columnPosition == this.tableSizes[this.tableSizeSelected][1] - 1) {
      this.setAdjacencyForTiles();
    }
  }


  private setAdjacencyForTiles() {

    for(let row = 0; row < this.gameTable.length; row++) {
      for(let col = 0; col < this.gameTable[0].length; col++) {

        let tile = this.gameTable[row][col];

        if(row -1 >= 0) {
          tile.addAdjacentTile(this.gameTable[row-1][col]);
        }

        if(row -1 >= 0 && col -1 >= 0) {
          tile.addAdjacentTile(this.gameTable[row-1][col-1]);
        }

        if(row -1 >= 0 && col +1 < this.gameTable[0].length) {
          tile.addAdjacentTile(this.gameTable[row-1][col+1]);
        }

        if(col -1 >= 0) {
          tile.addAdjacentTile(this.gameTable[row][col-1]);
        }

        if(col +1 < this.gameTable[0].length) {
          tile.addAdjacentTile(this.gameTable[row][col+1]);
        }

        if(row +1 < this.gameTable.length) {
          tile.addAdjacentTile(this.gameTable[row+1][col]);
        }

        if(row +1 < this.gameTable.length && col -1 >= 0) {
          tile.addAdjacentTile(this.gameTable[row+1][col-1]);
        }

        if(row +1 < this.gameTable.length && col +1 < this.gameTable[0].length) {
          tile.addAdjacentTile(this.gameTable[row+1][col+1]);
        }
        
      }
    }
  }


  private explore(rowPosition: number, columnPosition: number) {

    if(this.gameFinished == false) {

      let tile = this.gameTable[rowPosition][columnPosition];

      if(tile.isExplored() == false && tile.isFlagged() == false) {

        if(this.firstClick == true) {

          this.firstClick = false;
          this.placeMines(rowPosition, columnPosition);
        }

        tile.setExplored(true);
        this.tilesToExplore--;

        if(tile.getContentType() == ContentTypes.EMPTY) {

          let newExploration: Array<Tile> = new Array();
          newExploration.push(tile);

          /* EXPLORATION ALGORITHM */
          for(let explorationIndex = 0; explorationIndex < newExploration.length; explorationIndex++) {

            let tileToExplore = newExploration[explorationIndex];

            tileToExplore.getAdjacentTiles().forEach(adjacentTile => {
              
              if(adjacentTile.isExplored() == false) {

                if(adjacentTile.getContentType() == ContentTypes.EMPTY) {

                  adjacentTile.setExplored(true);
                  newExploration.push(adjacentTile);
                  this.tilesToExplore--;
                }
                else if(adjacentTile.getContentType() == ContentTypes.NEARBY) {
                  
                  adjacentTile.setExplored(true);
                  this.countAdjacentMines(adjacentTile);
                  this.tilesToExplore--;
                }
              } 
            });

          }

        }
        else if(tile.getContentType() == ContentTypes.NEARBY) {

          this.countAdjacentMines(tile);
        }
        else {  // <-- ContentTypes.MINE

          this.gameFinished = true;
          tile.getContainerDiv().style.backgroundColor = "#FF0000";
          this.revealOtherMines(rowPosition, columnPosition);
        }

      }
    }

    if(this.gameFinished == false && this.tilesToExplore <= 1) {
      console.log("win");
    }

  }


  private flagTile(rowPosition: number, columnPosition: number) {

    if(this.gameFinished == false) {

      let tile = this.gameTable[rowPosition][columnPosition];
      tile.setFlagged( !tile.isFlagged() );
    }

  }


  private placeMines(firstClickRowPosition: number, firstClickColumnPosition: number) {

    for(let minesPlaced = 0; minesPlaced <= this.numberOfMines; minesPlaced++) {

      let validMinePosition = true;

      do {
        validMinePosition = true;

        let mineRowPos = Math.floor(Math.random() * this.gameTable.length);
        let mineColPos = Math.floor(Math.random() * this.gameTable[0].length);

        for(let rowToCheck = firstClickRowPosition -1; rowToCheck <= firstClickRowPosition +1; rowToCheck++) {
          for(let colToCheck = firstClickColumnPosition -1; colToCheck <= firstClickColumnPosition +1; colToCheck++) {

            if(mineRowPos == rowToCheck && mineColPos == colToCheck) {
              validMinePosition = false;
            }
          }
        }

        if(validMinePosition == true && this.gameTable[mineRowPos][mineColPos].getContentType() != ContentTypes.MINE) {
          this.gameTable[mineRowPos][mineColPos].setContentType(ContentTypes.MINE);
          this.setNoise(mineRowPos, mineColPos);
        }
        else {
          validMinePosition = false;
        }

      } while(validMinePosition == false);
    }
    
  }


  private setNoise(rowPosistion: number, columnPosition: number) {

    for(let noiseRowPosition = rowPosistion -1; noiseRowPosition <= rowPosistion +1; noiseRowPosition++) {
      for(let noiseColPosition = columnPosition -1; noiseColPosition <= columnPosition +1; noiseColPosition++) {

        if(noiseRowPosition >= 0 && noiseRowPosition < this.gameTable.length && noiseColPosition >= 0 && noiseColPosition < this.gameTable[0].length) {

          if(this.gameTable[noiseRowPosition][noiseColPosition].getContentType() == ContentTypes.EMPTY) {
            this.gameTable[noiseRowPosition][noiseColPosition].setContentType(ContentTypes.NEARBY);
          }
        }
      }
    }
  }


  private countAdjacentMines(tile: Tile) {

    let counter = 0;

    tile.getAdjacentTiles().forEach(adjacentTile => {
      if(adjacentTile.getContentType() == ContentTypes.MINE) {
        counter++;
      }
    }); 

    tile.setAdjacentMineCount(counter);
  }


  private revealOtherMines(startingRowPosition: number, startingColumnPosition: number) {

    let revealRadius = 2;
    let revealDelay = 600;

    let intervalObject = setInterval(() => {

      for(let row = startingRowPosition - revealRadius; row <= startingRowPosition + revealRadius; row++) {
        for(let col = startingColumnPosition - revealRadius; col <= startingColumnPosition + revealRadius; col++) {
  
          if(row >= 0 && col >= 0 && row < this.gameTable.length && col < this.gameTable[0].length) {
            
            if(this.gameTable[row][col].getContentType() == ContentTypes.MINE) {
              this.gameTable[row][col].setExplored(true);
            }
          }
  
          if(revealRadius == this.gameTable.length -1 && revealRadius == this.gameTable[0].length -1) {
            clearInterval(intervalObject);
          }
        }
      }

      revealRadius = revealRadius + 1;
      revealDelay = revealDelay * 0.35;

    }, revealDelay);

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

  public getGameTable(): Array<Array<Tile>> {
    return this.gameTable;
  }

  public isFirstClick(): boolean {
    return this.firstClick;
  }

  public setFirstClick(newValue: boolean) {
    this.firstClick = newValue;
  }
}
