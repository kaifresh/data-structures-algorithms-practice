import {assert} from 'chai';
import {Direction, Game, Position, Snake} from "./SnakeGame";

describe('Snake Game', function () {
    it('should instantiate a snake and a board and move the snake', async function () {
        const snakeGame = new Game();
        snakeGame.setSnakeDirection(Direction.UP);
        const pre = snakeGame.getGameState();
        snakeGame.update();
        const post = snakeGame.getGameState();

        assert.equal(pre.snakeBody[0].y, post.snakeBody[0].y + 1, 'The snake moved up one');
        assert.equal(pre.snakeBody[0].x, post.snakeBody[0].x, 'The snake stayed in the same horizontal location');
    });
    it('should wrap around horizontally', async function () {
        const snakeGame = new Game();
        snakeGame.setSnakeDirection(Direction.RIGHT);
        for (let i = 0; i < 5; i++) {
            snakeGame.update();
        }
        const afterMoving = snakeGame.getGameState();

        assert.equal(afterMoving.snakeBody[0].x, 0);
    });
    it('should wrap around vertically going negative', async function () {
        const snakeGame = new Game();
        snakeGame.setSnakeDirection(Direction.UP);
        for (let i = 0; i < 6; i++) {
            snakeGame.update();
        }
        const afterMoving = snakeGame.getGameState();

        assert.equal(afterMoving.snakeBody[0].y, 9, 'You should now be at the bottom most position');
    });
});

describe('Snake', function () {
    let snake: Snake;
    beforeEach(() => {
        snake = new Snake(new Position(5, 5));
    });
    it('should instantiate a snake', async function () {
        const bodyParts = snake.getSnakeBody();

        assert.equal(bodyParts[0].x, 5);
        assert.equal(bodyParts[1].x, 4);
    });
    it('should move a snake and its body length should stay the same', async function () {
        const bodyParts = snake.getSnakeBody();
        snake.updateSnakePosition(new Position(6, 5));
        const bodyPartsPostMove = snake.getSnakeBody();
        assert.equal(bodyParts.length, bodyPartsPostMove.length);
    });
    it('should instantiate a snake and make it move', async function () {
        snake.updateSnakePosition(new Position(6, 5));
        const bodyParts = snake.getSnakeBody();

        assert.lengthOf(bodyParts, 2);
        assert.equal(bodyParts[0].x, 6);
        assert.equal(bodyParts[1].x, 5);
    });
    it('should detect a collision when the snake comes back on itself', async function () {
        snake = new Snake(new Position(5, 5), )

        snake.updateSnakePosition(new Position(6, 5), false);
        snake.updateSnakePosition(new Position(6, 4), false);
        snake.updateSnakePosition(new Position(5, 4), false);
        snake.updateSnakePosition(new Position(5, 5), false);

        assert.isTrue(snake.didCollideWithItself());
    });
});