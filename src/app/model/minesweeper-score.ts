export class MinesweeperScore {

    private id: number;
    private userName: string;
    private score: number;
    private tableSize: string;
    private date: Date;


    constructor(id: number, userName: string, score: number, tableSize: string, date: Date) {
        this.id = id;
        this.userName = userName;
        this.score = score;
        this.tableSize = tableSize;
        this.date = date;
    }


    public getId(): number {
        return this.id;
    }

    public getUserName(): string {
        return this.userName;
    }

    public getScore(): number {
        return this.score;
    }

    public getTableSize(): string {
        return this.tableSize;
    }

    public getDate(): Date {
        return this.date;
    }

}
