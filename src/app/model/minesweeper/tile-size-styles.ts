export class TileSizeStyles {

    private tileSize: string;
    private borderSize: string;
    private fontSize: string;


    constructor(tableWidth: number, tableHorizontalSize: number) {

        let tileSizeTotal = Math.floor( tableWidth / tableHorizontalSize );
        let borderSize = Math.ceil( tileSizeTotal * 0.23 );

        this.tileSize = (tileSizeTotal - borderSize) + "px";
        this.borderSize = Math.floor(borderSize * 0.5) + "px";
        this.fontSize = Math.floor((tileSizeTotal - borderSize) * 0.8) + "px";
    }


    public getTileSize(): string {
        return this.tileSize;
    }

    public getBorderSize(): string {
        return this.borderSize;
    }

    public getFontSize(): string {
        return this.fontSize;
    }
}
