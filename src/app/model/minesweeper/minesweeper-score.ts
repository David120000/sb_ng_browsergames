export class MinesweeperScore {

    public id: number;
    public userName: string;
    public score: number;
    public tableSize: string;
    public date: Date;


    constructor(id: number, userName: string, score: number, tableSize: string, date: Date) {
        this.id = id;
        this.userName = userName;
        this.score = score;
        this.tableSize = tableSize;
        this.date = date;
    }


}
