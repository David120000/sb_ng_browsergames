export class MinesweeperScore {

    private _id: number;
    private _userName: string;
    private _score: number;
    private _tableSize: string;
    private _date: Date;


    constructor(id: number, userName: string, score: number, tableSize: string, date: Date) {
        this._id = id;
        this._userName = userName;
        this._score = score;
        this._tableSize = tableSize;
        this._date = date;
    }


    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public get userName(): string {
        return this._userName;
    }
    public set userName(value: string) {
        this._userName = value;
    }

    public get score(): number {
        return this._score;
    }
    public set score(value: number) {
        this._score = value;
    }

    public get tableSize(): string {
        return this._tableSize;
    }
    public set tableSize(value: string) {
        this._tableSize = value;
    }

    public get date(): Date {
        return this._date;
    }
    public set date(value: Date) {
        this._date = value;
    }


    // public getId(): number {
    //     return this.id;
    // }

    // public getUserName(): string {
    //     return this.userName;
    // }

    // public getScore(): number {
    //     return this.score;
    // }

    // public getTableSize(): string {
    //     return this.tableSize;
    // }

    // public getDate(): Date {
    //     return this.date;
    // }

    // public setUserName(userName: string) {
    //     this.userName = userName;
    // }

}
