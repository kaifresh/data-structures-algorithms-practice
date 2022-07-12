import {Cell} from "./Cell";

export class Board {
    topLeft: Cell;
    bottomRight: Cell;

    constructor(topLeft: Cell, bottomRight: Cell) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }

    getBoard() {
        return {
            topLeft: this.topLeft,
            bottomRight: this.bottomRight,
        }
    }
}