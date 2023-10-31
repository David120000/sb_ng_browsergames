import { IconDefinition, faO, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Marks } from './marks';

export class Tile {

    private mark: Marks;
    private victoryAnimation: 'flip' | undefined;
    private recolor: 'color: #a80000' | undefined;


    constructor() {
        this.mark = Marks.EMPTY;
        this.recolor = undefined;
        this.victoryAnimation = undefined;
    }


    public setMark(mark: Marks) {
        this.mark = mark;
    }


    public getMark(): Marks {
        return this.mark;
    }


    public getIconDefinition(): IconDefinition {

        let returnValue = faSpinner;

        if(this.mark == Marks.X) {
            returnValue = faXmark;
        }
        else if(this.mark == Marks.O) {
            returnValue = faO;
        }

        return returnValue;
    }

    public getAnimation(): 'flip' | undefined {
        return this.victoryAnimation;
    }

    public getRecolor(): 'color: #a80000' | undefined {
        return this.recolor;
    }

    public setVictoryProperties(winnerTile: boolean) {

        if(winnerTile == true) {

            this.victoryAnimation = 'flip';
            this.recolor = 'color: #a80000';
        }
        else {

            this.victoryAnimation = undefined;
            this.recolor = undefined;
        }

    }
}
