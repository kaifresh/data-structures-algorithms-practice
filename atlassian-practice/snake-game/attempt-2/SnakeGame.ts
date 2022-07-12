import {LinkedList} from "mnemonist";

export enum Direction {
    LEFT,
    RIGHT,
    UP,
    DOWN,
}

export enum GameState {
    PLAYING,
    LOST
}

export class Game {
    private board: Board;
    private snake: Snake;
    private currentDirection: Direction;
    private currentGameState: GameState;

    constructor() {
        const boardSize = 10;
        const topLeft = new Position(0,0);
        const bottomRight = new Position(boardSize,boardSize);
        this.board = new Board(topLeft, bottomRight);

        const halfBoardSize = Math.floor(boardSize/2);
        const snakeStartPosition = new Position(halfBoardSize, halfBoardSize);
        this.snake = new Snake(snakeStartPosition);

        this.currentDirection = Direction.RIGHT;

        this.currentGameState = GameState.PLAYING;
    }

    update() {
        if (this.currentGameState === GameState.LOST) {
            throw new Error('You lost the game');
        }

        const nextSnakePosition = this.getNextSnakePosition();
        this.snake.updateSnakePosition(nextSnakePosition);
        this.updateGameState();
    }

    setSnakeDirection(nextDirection: Direction) {
        this.currentDirection = this.getValidDirection(nextDirection);
    }

    private updateGameState() {
        if (this.snake.didCollideWithItself()) {
            this.currentGameState = GameState.LOST;
        }
    }

    /**
     * Handle new directions & only allow valid ones w.r.t. the current direction
     * @param direction
     * @private
     */
    private getValidDirection(direction: Direction) {
        // Handle invalid combinations - drop the input
        if (
            direction === Direction.LEFT && this.currentDirection === Direction.RIGHT ||
            direction === Direction.RIGHT && this.currentDirection === Direction.LEFT ||
            direction === Direction.UP && this.currentDirection === Direction.DOWN ||
            direction === Direction.DOWN && this.currentDirection === Direction.UP
        ) {
            return this.currentDirection;
        }

        return direction;
    }

    /**
     * Get the next snake position based on the current direction of the snake
     * @note we expect that this is a valid direction relative to the snake's previous direction
     * @private
     */
    private getNextSnakePosition() {
        const head = this.snake.getSnakeHead();

        if (this.currentDirection === Direction.LEFT) {
            return this.getInBoundsPosition(head.x - 1, head.y);
        } else if (this.currentDirection === Direction.RIGHT) {
            return  this.getInBoundsPosition(head.x + 1, head.y);
        } else if (this.currentDirection === Direction.UP) {
            return  this.getInBoundsPosition(head.x, head.y - 1);
        } else { // Down is implicit
            return  this.getInBoundsPosition(head.x, head.y + 1);
        }
    }

    /**
     * Convenience function to ensure values stay within bounds
     * @param nextX
     * @param nextY
     * @private
     */
    private getInBoundsPosition(nextX: number, nextY: number) {
        const inBoundsX = nextX % this.board.boundaries.bottomRight.x;
        const inBoundsY = nextY % this.board.boundaries.bottomRight.y;
        const validNextX = nextX < 0 ? this.board.boundaries.bottomRight.x + inBoundsX : inBoundsX;
        const validNextY = nextY < 0 ? this.board.boundaries.bottomRight.y + inBoundsY : inBoundsY;
        return new Position(validNextX, validNextY);
    }
    /**
     * @todo return clones of the actual game instance variables!
     */
    getGameState() {
        return {
            board: this.board,
            snakeBody: this.snake.getSnakeBody(),
        }
    }
}

class Board {
    // Has boundaries of positions
    boundaries:  {
        topLeft: Position,
        bottomRight: Position,
    }

    constructor(topLeft: Position, bottomRight: Position) {
        this.boundaries = { topLeft, bottomRight };
    }
}


export class Snake {
    // Body is a queue of positions to facilitate snake movement AND a set to facilitate quick lookup
    body: LinkedList<Position>;
    /**
     * Create a snake
     * @note the snake will always be horizontal
     * @note the front of the queue is the fail
     * @param snakeLength
     * @param headPosition
     */
    constructor(headPosition: Position, snakeLength = 2) {
        // Initialise the body,
        this.body = new LinkedList<Position>();

        for (let i = 0; i < snakeLength; i++) {
            const bodyPart = new Position(headPosition.x - i, headPosition.y);
            this.addToBack(bodyPart);
        }
    }

    updateSnakePosition (nextPosition: Position, remainSameSize = true) {
        // add a new node to the front
        this.addToFront(nextPosition);

        // remove the tail node if the snake should remain the same size
        if (remainSameSize) {
            this.removeFromBack();
        }
    }

    didCollideWithItself() {
        const snakeHead = this.getSnakeHead();
        for (const [i, part] of this.body.entries() ){
            if (this.isIndexOfHead(i)) {
                continue;
            }
            if (snakeHead.x === part.x && snakeHead.y === part.y) {
                return true;
            }
        }
        return false;
    }

    getSnakeHead(){
        return this.body.last()!;
    }

    getSnakeBody() {
        return this.body.toArray().reverse();
    }

    private isIndexOfHead(i: number) {
        return i === this.body.size - 1;
    }

    private removeFromBack() {
        return this.body.shift();
    }

    private addToBack(pos: Position) {
        return this.body.unshift(pos);
    }

    private addToFront(pos: Position) {
        return this.body.push(pos);
    }

}

export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

}