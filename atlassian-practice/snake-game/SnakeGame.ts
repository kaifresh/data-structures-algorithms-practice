import { Deque } from '@datastructures-js/deque';

type AllowedInputs = 0 | 1 | -1;

export enum GameState {
    Playing =  "PLAYING",
    Lost = "LOST"
}

export class Game {
    private snake: Snake;
    private board: Board;
    private fruits: {[key: string]: Fruit};
    private gameState: GameState;

    private fruitAddFrequency: number;
    private gameLoopCount: number;

    // TODO: Use a vector object or something more generic
    private lastUserVector: Cell;

    /**
     * TODO: make this customisable? Or not? is this a 3310?
     */
    constructor(squareWidth: number = 9, initialSnakeSize: number = 2, fruitAddFrequency: number = 4) {
        const topLeft = new Cell(0,0);
        const bottomRight = new Cell(squareWidth,squareWidth);
        this.board = new Board(topLeft, bottomRight);

        const middle = Math.floor(squareWidth/2);
        const initialSnakePosition = new Cell(middle, middle);
        this.snake  = new Snake(initialSnakePosition, initialSnakeSize);

        this.fruitAddFrequency = fruitAddFrequency;
        this.fruits = {};

        this.gameLoopCount = 0;
        this.gameState = GameState.Playing;

        this.lastUserVector = new Cell(0,0);
    }

    executeGameLoop(userInputDirectionX: AllowedInputs, userInputDirectionY: AllowedInputs) {
        // Validation - ensure you can play the game
        if (!this.canPlay()){
            throw new Error('The game is over! We cannot execute any more game loops');
        }

        // Validate input range
        if (Math.abs(userInputDirectionX) === 1 && Math.abs(userInputDirectionY) === 1) {
            throw new Error('The snake may not move diagonally!');
        }

        // Validation - Allow the user to input invalid data and we just drop the values
        if (this.isInvalidMovementDirection(userInputDirectionX, userInputDirectionY)) {
            userInputDirectionX = this.lastUserVector.x as AllowedInputs;
            userInputDirectionY = this.lastUserVector.y as AllowedInputs;
        }

        // If it is valid then store the vector
        this.lastUserVector = new Cell(userInputDirectionX, userInputDirectionY);

        // Snake needs to move one direction
        this.snake.update(userInputDirectionX, userInputDirectionY);

        // Compute death/continuation
        if (this.isGameOver()) {
            this.setGameToLost();
        }

        // Compute intersections with fruit
        if (this.didSnakeEatFruit()) {
            this.registerEatenFruit();
        }

        // Maybe add a piece of fruit
        this.periodicallyAddFruit();

        this.incrementRoundCount();
    }

    /**
     * Convenience function for testing
     */
    getGameState() {
        const snake = this.snake.getSnake();
        const board = this.board.getBoard();
        const fruit = {...this.fruits};
        const gameState = this.gameState;

        return {
            snake, board, gameState, fruit,
        }
    }

    private incrementRoundCount() {
        this.gameLoopCount += 1;
    }

    private isGameOver () {
        const snakeCollidedWithBorder = this.didSnakeCollideWithBorder();

        return snakeCollidedWithBorder;
    }

    /**
     * The only way we change the snake is by moving in an orthogonal direction
     * @note if you're moving up or down the only valid next input is to move right or left.
     * @param userInputDirectionX
     * @param userInputDirectionY
     * @private
     */
    private isInvalidMovementDirection(userInputDirectionX: number, userInputDirectionY: number) {
        return Math.abs(this.lastUserVector.x + userInputDirectionX) !== 1 ||
        Math.abs(this.lastUserVector.y + userInputDirectionY) !== 1
    }

    private didSnakeCollideWithBorder(): boolean {
        const snakeHead = this.snake.getSnakeHead();
        return snakeHead.x < this.board.topLeft.x
            || snakeHead.y < this.board.topLeft.y
            || snakeHead.x > this.board.bottomRight.x
            || snakeHead.y > this.board.bottomRight.y;
    }

    private setGameToLost() {
        this.gameState = GameState.Lost;
    }

    private canPlay(): boolean {
        return this.gameState == GameState.Playing;
    }

    private periodicallyAddFruit() {
        if (this.gameLoopCount > 0 && this.gameLoopCount % this.fruitAddFrequency === 0) {
            this.addFruit();
        }
    }

    private addFruit() {
        // choose a random location
        const fruitLocation = this.chooseRandomValidFruitLocation();
        // create the fruit
        const fruit = new Fruit(fruitLocation);
        // add it to the hashmap
        this.fruits[fruit.toString()] = fruit;
    }

    private didSnakeEatFruit() {
        const snakeHeadString = this.snake.getSnakeHead().toString();
        return !!this.fruits[snakeHeadString];
    }

    /**
     * @todo implement scoring
     * @private
     */
    private registerEatenFruit() {
        const snakeHeadString = this.snake.getSnakeHead().toString();
        delete this.fruits[snakeHeadString];
    }

    /**
     * @todo optimise the location selection process
     * @todo find a way to mock this function
     * @private
     */
    private chooseRandomValidFruitLocation() {
        let randomX: number;
        let randomY: number;
        const snakeBody = this.snake.getSnake().toArray();

        let fruitLocationIsInBody = true;
        while (fruitLocationIsInBody) {
            randomX = Math.floor(Math.random() * this.board.getBoard().bottomRight.x);
            randomY = Math.floor(Math.random() * this.board.getBoard().bottomRight.y);

            // Make sure there's not already a fruit here
            if (this.fruits[new Cell(randomX, randomY).toString()]) {
                continue;
            }

            // Brute force search for somewhere to put a new piece of fruit (that's not inside the snake!)
            fruitLocationIsInBody = false;
            for (let snakePart of snakeBody) {
                const randomLocationIsInSnake = randomX === snakePart.x && randomY === snakePart.y;
                if (randomLocationIsInSnake) {
                    fruitLocationIsInBody = true;
                }
            }
        }

        return new Cell(randomX!, randomY!)
    }
}


class Board {
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

class Snake {
    locations: Deque<Cell> = new Deque<Cell>();

    /**
     * Construct a snake
     * @note the snake will be facing left horizontally
     * @param start
     * @param length
     */
    constructor (start: Cell, length: number) {
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

class Fruit {
    location: Cell;

    constructor(location: Cell) {
        this.location = location;
    }

}

/**
 * @todo implement clone!
 */
class Cell {
    x: number;
    y: number;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add (x: number, y: number) {
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
