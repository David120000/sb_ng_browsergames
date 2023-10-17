import { MinesweeperScore } from "./minesweeper-score";

export class MineswScorePages {

    private content: Array<MinesweeperScore>;
    private totalPages: number;
    private totalElements: number;
    private first: boolean;
    private last: boolean;
    private size: number;
    private number: number;
    private numberOfElements: number;

    private userName: string | undefined;


    constructor() {
        this.content = [];
        this.totalPages = 0;
        this.totalElements = 0;
        this.first = false;
        this.last = false;
        this.size = 0;
        this.number = 0;
        this.numberOfElements = 0;
    }


    public getUserName(): string | undefined {
        return this.userName;
    }

    public setUserName(userName: string) {
        this.userName = userName;
    }


    public getContent(): Array<MinesweeperScore> {
        return this.content;
    }

    public getTotalPages(): number {
        return this.totalPages;
    }

    public getTotalElements(): number {
        return this.totalElements;
    }

    public isFirst(): boolean {
        return this.first;
    }

    public isLast(): boolean {
        return this.last;
    }

    public getSizePerPage(): number {
        return this.size;
    }

    public getCurrentPageNumber(): number {
        return this.number;
    }

    public getSizeThisPage(): number {
        return this.numberOfElements;
    }

    
}
