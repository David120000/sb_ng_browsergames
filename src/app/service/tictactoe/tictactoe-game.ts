import { Marks } from "src/app/model/tictactoe/marks";
import { Tile } from "src/app/model/tictactoe/tile";

export class TictactoeGame {

    private tableSize: number;
    private gameTable: Tile[][];
    private whoNext: Marks;
    private playerClicks: number;


    constructor() {
       
        this.tableSize = 3;
        this.gameTable = [];
        this.whoNext = Marks.X;
        this.playerClicks = 0;

        this.buildGameTable();
    }


    public buildGameTable() {

        for(let rowPosition = 0; rowPosition < this.tableSize; rowPosition++) {
            for(let columnPosition = 0; columnPosition < this.tableSize; columnPosition++) {

                if(this.gameTable[rowPosition] == undefined) {
                    this.gameTable[rowPosition] = [];
                }
        
                this.gameTable[rowPosition][columnPosition] = new Tile();
            }
        }

    }


    public playerClick(rowPosition: number, columnPosition: number): boolean {

        let tableChanged = false;
        const tile = this.gameTable[rowPosition][columnPosition];

        if(tile.getMark() == Marks.EMPTY) {

            if(this.whoNext == Marks.X) {

                tile.setMark(Marks.X);
                this.whoNext = Marks.O;
                tableChanged = true;
            }
            else {

                tile.setMark(Marks.O);
                this.whoNext = Marks.X;
                tableChanged = true;
            }

            this.playerClicks++;

            if(this.playerClicks > 5) {
                this.winCheck();
            }
        }

        return tableChanged;
    }


    private winCheck(): Array<Marks> {
        
        let winners = new Array<Marks>;

        for(let row = 0; row < this.tableSize; row++) {
            for(let column = 0; column < this.tableSize; column++) {
    
                let tile = this.gameTable[row][column];
    
                if((row-1) >= 0 && (row+1) < this.tableSize) {

                    let tile2 = this.gameTable[row-1][column];
                    let tile3 = this.gameTable[row+1][column];
    
                    if(tile2.getMark() == tile.getMark() && tile3.getMark() == tile.getMark()) {
                        
                        winners.push(tile.getMark());
                        tile.setVictoryProperties(true);
                        tile2.setVictoryProperties(true);
                        tile3.setVictoryProperties(true);
                    }                    
                }
    
                if((column-1) >= 0 && (column+1) < this.tableSize) {
    
                    let tile2 = this.gameTable[row][column-1];
                    let tile3 = this.gameTable[row][column+1];
    
                    if(tile2.getMark() == tile.getMark() && tile3.getMark() == tile.getMark()) {
                        
                        winners.push(tile.getMark());
                        tile.setVictoryProperties(true);
                        tile2.setVictoryProperties(true);
                        tile3.setVictoryProperties(true);
                    }  
                }
    
                if((row-1) >= 0 && (column-1) >= 0 && (row+1) < this.tableSize && (column+1) < this.tableSize) {
    
                    let tile2 = this.gameTable[row-1][column-1];
                    let tile3 = this.gameTable[row+1][column+1];
    
                    if(tile2.getMark() == tile.getMark() && tile3.getMark() == tile.getMark()) {
                        
                        winners.push(tile.getMark());
                        tile.setVictoryProperties(true);
                        tile2.setVictoryProperties(true);
                        tile3.setVictoryProperties(true);
                    }  
                }
    
                if((row-1) >= 0 && (column+1) < this.tableSize && (row+1) < this.tableSize && (column-1) >= 0) {
    
                    let tile2 = this.gameTable[row-1][column+1];
                    let tile3 = this.gameTable[row+1][column-1];

    
                    if(tile2.getMark() == tile.getMark() && tile3.getMark() == tile.getMark()) {
                        
                        winners.push(tile.getMark());
                        tile.setVictoryProperties(true);
                        tile2.setVictoryProperties(true);
                        tile3.setVictoryProperties(true);
                    } 
                }
            }
        }
        
        return winners;
    }


    public getTile(rowPosition: number, columnPosition: number): Tile {
        return this.gameTable[rowPosition][columnPosition];
    }


    public getTableSize(): number {
        return this.tableSize;
    }


    public whoIsNext(): Marks {
        return this.whoNext;
    }
}
