import { ContentTypes } from './contentTypeEnum';

export class Tile {

    private containerDiv: any;
    private explored: boolean;
    private flagged: boolean;
    private contentType: ContentTypes;
    private adjacentTiles: Array<Tile>;    


    constructor(containerDiv: any) {
        this.containerDiv = containerDiv;
        this.explored = false;
        this.flagged = false;
        this.contentType = ContentTypes.EMPTY;
        this.adjacentTiles = new Array();    
    }


    public getContainerDiv(): any {
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

    public getContentType(): ContentTypes {
        return this.contentType;
    }

    public setContentType(contentType: ContentTypes) {
        this.contentType = contentType;
    }

    public getAdjacentTiles(): Array<Tile> {
        return this.adjacentTiles;
    }

    public addAdjacentTile(tile: Tile) {
        this.adjacentTiles.push(tile);
    }
}
