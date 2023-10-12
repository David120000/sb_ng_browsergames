export class MinesweeperScorePersistResponse {

    private successfullyPersisted: boolean;
    private id: number;

    
    constructor() {
        this.successfullyPersisted = false;
        this.id = -1;
    }


    public isSuccessfullyPersisted(): boolean {
        return this.successfullyPersisted;
    }

    public setSuccessfullyPersisted(successfullyPersisted: boolean) {
        this.successfullyPersisted = successfullyPersisted;
    }

    public getId(): number {
        return this.id;
    }

    public setId(id: number) {
        this.id = id;
    }
}
