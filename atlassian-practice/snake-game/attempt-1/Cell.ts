/**
 * @todo implement clone!
 */
export class Cell {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(x: number, y: number) {
        this.x += x;
        this.y += y;
    }

    clone() {
        return new Cell(this.x, this.y);
    }

    toString() {
        return `[${this.x}]-[${this.y}]`;
    }
}