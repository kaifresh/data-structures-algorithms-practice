import {Deque} from "@datastructures-js/deque";
import {Cell} from "./Cell";

export class Snake {
    locations: Deque<Cell> = new Deque<Cell>();

    /**
     * Construct a snake
     * @note the snake will be facing left horizontally
     * @param start
     * @param length
     */
    constructor(start: Cell, length: number) {
        // WHAT IS THE INITIAL STATE OF THE SNAKE??
        for (let i = 0; i < length; i++) {
            this.locations.pushBack(
                new Cell(start.x + i, start.y)
            );
        }
    }

    /**
     * Move the snake forward by increasing its forward position in a particular direction and removing its last-most position
     * @note the snake stays the same size at the end of this method
     * @todo disallow moving back on yourself
     * @param directionX
     * @param directionY
     */
    update(directionX: number, directionY: number) {
        this.growFront(directionX, directionY);
        this.locations.popBack();
    }

    growFront(directionX: number, directionY: number) {
        const nextX = this.locations.front().x + directionX;
        const nextY = this.locations.front().y + directionY;
        const nextDirection = new Cell(nextX, nextY);

        if (nextDirection.toString() === this.locations.front().toString()) {
            throw new Error('Snake cannot move back on itself');
        }

        this.locations.pushFront(nextDirection);
    }

    getSnake() {
        return this.locations.clone();
    }

    getSnakeHead() {
        return this.locations.front().clone();
    }
}