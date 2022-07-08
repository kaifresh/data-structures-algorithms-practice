import { assert } from 'chai';
import {Game, GameState} from "./SnakeGame";

describe('SnakeGame', function () {
    describe('Playing States', function () {
        it('should not allow you to move the snake diagonally', async function () {
            const game = new Game();
            assert.throws( () => game.executeGameLoop(1, 1));
        });
        it('should create a game, with a horizontal snake in the middle', async function () {
            const game = new Game();

            const gameState = game.getGameState();

            const {snake, board} = gameState;

            const snakeArray = snake.toArray();

            const boardMiddle = Math.floor((board.bottomRight.x - board.topLeft.x)/2);

            assert.lengthOf(snakeArray, 2);
            assert.equal(snakeArray[0].x, boardMiddle);
            assert.equal(snakeArray[0].y, boardMiddle);
            assert.equal(snakeArray[1].x, boardMiddle + 1);
            assert.equal(snakeArray[1].y, boardMiddle);
        });
        it('should move the snake forward', async function () {
            const game = new Game();

            const gameStateT1 = game.getGameState();

            game.executeGameLoop(1, 0);

            const gameStateT2 = game.getGameState();

            assert.equal(
                gameStateT2.snake.front().x,
                gameStateT1.snake.front().x + 1,
            );
        });
        it('should move the snake forward and it should not change length', async function () {
            // arrange
            const game = new Game();

            // act
            game.executeGameLoop(1, 0);

            // assert
            const gameStateT2 = game.getGameState();
            assert.equal(gameStateT2.snake.size(), 2);
        });
    });
    describe('Losing states', function () {
        let game: Game;
        beforeEach(() =>{
            game = new Game(9);

            // Move left 4 times
            game.executeGameLoop(-1, 0);
            game.executeGameLoop(-1, 0);
            game.executeGameLoop(-1, 0);
            game.executeGameLoop(-1, 0);

            // DIE
            game.executeGameLoop(-1, 0);
        });
        it('should set the game to lost if the snake collides with a wall', async function () {
            const {gameState} = game.getGameState();
            assert.equal(gameState, GameState.Lost);
        });
        it('should end the game (via an error) if the snake collides with a wall', async function () {
            // assert
            assert.throws(() => game.executeGameLoop(-1, 0));
        });
    });
    describe('Fruit', function () {
        it('should add fruit based on the fruit period', async function () {
            const game = new Game(9, undefined, 1);

            game.executeGameLoop(1, 0);
            game.executeGameLoop(1, 0);

            const {fruit} = game.getGameState();
            assert.lengthOf(Object.keys(fruit), 1);
        });
    });
});