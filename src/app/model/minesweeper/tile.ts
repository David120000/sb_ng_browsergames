import { ContentTypes } from './contentTypeEnum';

export class Tile {

    private containerDiv: HTMLDivElement;
    private explored: boolean;
    private flagged: boolean;
    private contentType: ContentTypes;
    private adjacentMineCount: number;
    private adjacentTiles: Array<Tile>;   


    constructor(containerDiv: HTMLDivElement) {
        this.containerDiv = containerDiv;
        this.explored = false;
        this.flagged = false;
        this.contentType = ContentTypes.EMPTY;
        this.adjacentMineCount = 0;
        this.adjacentTiles = new Array();    
    }


    public getContainerDiv(): HTMLDivElement {
        return this.containerDiv;
    }

    public isExplored(): boolean {
        return this.explored;
    }

    public setExplored(explored: boolean) {
        this.explored = explored;
    }

    public isFlagged(): boolean {
        return this.flagged;
    }

    public setFlagged(newValue: boolean) {
        this.flagged = newValue;
    }

    public getContentType(): ContentTypes {
        return this.contentType;
    }

    public setContentType(contentType: ContentTypes) {
        this.contentType = contentType;
    }

    public getAdjacentMineCount(): number {
        return this.adjacentMineCount;
    }

    public setAdjacentMineCount(count: number) {
        this.adjacentMineCount = count;
    }

    public getAdjacentTiles(): Array<Tile> {
        return this.adjacentTiles;
    }

    public addAdjacentTile(tile: Tile) {
        this.adjacentTiles.push(tile);
    }
}
