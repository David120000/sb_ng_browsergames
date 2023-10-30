import { Marks } from "src/app/model/tictactoe/marks";
import { Tile } from "src/app/model/tictactoe/tile";

export class TictactoeGame {

    private tableSize: number;
    private gameTable: Tile[][];
    private gameIsOn: boolean;
    private whoNext: Marks;
    private playerClicks: number;
    private winners: Array<Marks>;


    constructor(startImmediately: boolean) {
       
        this.tableSize = 3;
        this.gameTable = [];
        this.playerClicks = 0;
        this.winners = new Array<Marks>;

        if(Math.random() < 0.5) {
            this.whoNext = Marks.X;
        }
        else {
            this.whoNext = Marks.O;
        }

        this.buildGameTable();

        this.gameIsOn = startImmediately;
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

        if(this.gameIsOn == true) {

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
    
                if(this.playerClicks > 5 && this.playerClicks % 2 == 0) {
                    this.winCheck();
                }

                if(this.playerClicks == (this.tableSize * this.tableSize)) {
                    this.gameIsOn = false;
                }
            }
        }
   

        return tableChanged;
    }


    private winCheck() {

        for(let row = 0; row < this.tableSize; row++) {
            for(let column = 0; column < this.tableSize; column++) {
    
                let tile = this.gameTable[row][column];
    
                if(tile.getMark() != Marks.EMPTY) {

                    if((row-1) >= 0 && (row+1) < this.tableSize) {

                        let tile2 = this.gameTable[row-1][column];
                        let tile3 = this.gameTable[row+1][column];
        
                        if(tile2.getMark() == tile.getMark() && tile3.getMark() == tile.getMark()) {
    
                            this.winners.push(tile.getMark());
                            this.gameIsOn = false;
                            tile.setVictoryProperties(true);
                            tile2.setVictoryProperties(true);
                            tile3.setVictoryProperties(true);
                        }                    
                    }
        
                    if((column-1) >= 0 && (column+1) < this.tableSize) {
        
                        let tile2 = this.gameTable[row][column-1];
                        let tile3 = this.gameTable[row][column+1];
        
                        if(tile2.getMark() == tile.getMark() && tile3.getMark() == tile.getMark()) {
                            
                            this.winners.push(tile.getMark());
                            this.gameIsOn = false;
                            tile.setVictoryProperties(true);
                            tile2.setVictoryProperties(true);
                            tile3.setVictoryProperties(true);
                        }  
                    }
        
                    if((row-1) >= 0 && (column-1) >= 0 && (row+1) < this.tableSize && (column+1) < this.tableSize) {
        
                        let tile2 = this.gameTable[row-1][column-1];
                        let tile3 = this.gameTable[row+1][column+1];
        
                        if(tile2.getMark() == tile.getMark() && tile3.getMark() == tile.getMark()) {
                            
                            this.winners.push(tile.getMark());
                            this.gameIsOn = false;
                            tile.setVictoryProperties(true);
                            tile2.setVictoryProperties(true);
                            tile3.setVictoryProperties(true);
                        }  
                    }
        
                    if((row-1) >= 0 && (column+1) < this.tableSize && (row+1) < this.tableSize && (column-1) >= 0) {
        
                        let tile2 = this.gameTable[row-1][column+1];
                        let tile3 = this.gameTable[row+1][column-1];
    
        
                        if(tile2.getMark() == tile.getMark() && tile3.getMark() == tile.getMark()) {
                            
                            this.winners.push(tile.getMark());
                            this.gameIsOn = false;
                            tile.setVictoryProperties(true);
                            tile2.setVictoryProperties(true);
                            tile3.setVictoryProperties(true);
                        } 
                    }
                }
              
            }
        }
    }


    public getTile(rowPosition: number, columnPosition: number): Tile {
        return this.gameTable[rowPosition][columnPosition];
    }


    public getTableSize(): number {
        return this.tableSize;
    }


    public getPlayerClickCount(): number {
        return this.playerClicks;
    }


    public whoIsNext(): Marks {
        return this.whoNext;
    }


    public isGameOn(): boolean {
        return this.gameIsOn;
    }


    public setGameOn(onOrOff: boolean) {
        this.gameIsOn = onOrOff;
    }


    public getWinners(): Array<Marks> {
        return this.winners;
    }


    public getGameData(prefix: string): string {

        let data = prefix + "|";
        data += this.gameIsOn + "|";
        data += this.whoNext + "|";
        
        data += this.winners.length + ",";
        for(let index = 0; index < this.winners.length; index++) {
            data += this.winners[index] + ",";
        }
        data += "|";

        for(let rowIndex = 0; rowIndex < this.gameTable.length; rowIndex++) {
            for(let colIndex = 0; colIndex < this.gameTable[0].length; colIndex++) {

                data += this.gameTable[rowIndex][colIndex].getMark() + ",";
            }
        }
        data += "|";

        data += this.playerClicks + "|";

        return data;
    }


    public setGameData(data: string) {

        if(data.startsWith("game|") == true || data.startsWith("newgame|") == true) {

            let dataArray = data.split("|");

            /* GAME IS ON: boolean */
            if(dataArray[1] == "true") {
                this.gameIsOn = true;
            }
            else if(dataArray[1] == "false") {
                this.gameIsOn = false;
            }

            /* WHO IS NEXT: Marks enum */
            if(dataArray[2] == "EMPTY") {
                this.whoNext = Marks.EMPTY;
            }
            else if(dataArray[2] == "X") {
                this.whoNext = Marks.X;
            }
            else if(dataArray[2] == "O") {
                this.whoNext = Marks.O;
            }

            /* WINNERS: number of winners & winner Marks */
            let winnerDataArray = dataArray[3].split(",");
            if(winnerDataArray.length > 1) {
                
                for(let index = 1; index < winnerDataArray.length; index++) {
                    if(winnerDataArray[index] == "X") {
                        this.winners.push(Marks.X);
                    }
                    else if(winnerDataArray[index] == "O") {
                        this.winners.push(Marks.O);
                    }
                }
            }

            /* GAME TABLE: Tile Marks */
            let gameTableArray = dataArray[4].split(",");
            let parserIndex = 0;

            for(let rowIndex = 0; rowIndex < this.gameTable.length; rowIndex++) {
                for(let colIndex = 0; colIndex < this.gameTable[0].length; colIndex++) {

                    if(gameTableArray[parserIndex] == "EMPTY") {
                        this.gameTable[rowIndex][colIndex].setMark(Marks.EMPTY);
                    }
                    else if(gameTableArray[parserIndex] == "X") {
                        this.gameTable[rowIndex][colIndex].setMark(Marks.X);
                    }
                    else if(gameTableArray[parserIndex] == "O") {
                        this.gameTable[rowIndex][colIndex].setMark(Marks.O);
                    }

                    parserIndex++;
                }
            }

            this.playerClicks = Number(dataArray[5]);
        }
    }


    public buildClickData(clickRowPosition: number, clickColumnPosition: number, playersMark: Marks): string {
        return ("click|" + clickRowPosition + "|" + clickColumnPosition + "|" + playersMark);
    }


    public remoteClick(data: string): boolean {

        let tableChanged = false;

        if(data.startsWith("click|") == true) {

            let dataArray = data.split("|");

            if(dataArray[3] == this.whoNext) {

                tableChanged = this.playerClick(Number(dataArray[1]), Number(dataArray[2]));
            }
        }

        return tableChanged;
    }


}
