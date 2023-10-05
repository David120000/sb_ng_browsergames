export class GameResult {

    private playerName: string | undefined;
    private score: number;
    private gameTableSize: Array<number>;
    private playDateTime: Date;


    constructor(playerName: string | undefined, score: number, gameTableSize: Array<number>, playDateTime: Date) {
        this.playerName = playerName;
        this.score = score;
        this.gameTableSize = gameTableSize;
        this.playDateTime = playDateTime;
    }


    public setPlayerName(playerName: string) {
        this.playerName = playerName;
    }

    public getPlayerName(): string | undefined {
        return this.playerName;
    }

    public getScore(): number {
        return this.score;
    }

    public getGameTableSize(): Array<number> {
        return this.gameTableSize;
    }

    public getPlayDateTime(): Date {
        return this.playDateTime;
    }
    
}
