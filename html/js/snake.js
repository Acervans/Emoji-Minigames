// TODO: fix button queueing bug -> need a delay?
class Snake {

    constructor() {
        this.GAME_SPEED = 250
        this.SNAKE_SIZE = 25
        this.CANVAS_COLOR = "#000000"
        this.FOOD_COLOR = "#FF0000"
        this.SNAKE_COLOR = "#00FF00"
        this.SNAKE_BORDER_COLOR = "#007a1d"
        this.SNAKE_BORDER_SIZE = 3
        
        this.setUp()

        this.snakeCanvas.addEventListener('keydown', (event) => {
            var move = false;
            switch (event.key.toLowerCase()) {
                case 'a':
                case 'left':
                case 'arrowleft':
                    // LEFT
                    move = true;
                        
                    if (this.dx === 0) {
                        this.dx = -this.SNAKE_SIZE
                        this.dy = 0
                    }
                    break;
                case 'w':
                case 'up':
                case 'arrowup':
                    // UP
                    move = true;

                    if (this.dy === 0) {
                        this.dx = 0
                        this.dy = -this.SNAKE_SIZE
                    }
                    break;
                case 'd':
                case 'right':
                case 'arrowright':
                    // RIGHT
                    move = true;
                    
                    if (this.dx === 0) {
                        this.dx = this.SNAKE_SIZE
                        this.dy = 0
                    }
                    break;
                case 's':
                case 'down':
                case 'arrowdown':
                    // DOWN
                    move = true;

                    if (this.dy === 0) {
                        this.dx = 0
                        this.dy = this.SNAKE_SIZE
                    }
                    break;
            }
            if (move && !this.gameOver && this.gameLoop === null) {
                this.gameLoop = setInterval(() => this.gameTick(), this.GAME_SPEED)
            }
        });

        document.getElementById('snakeAgain').addEventListener('click', (e) => {
            this.setUp()
            document.getElementById('snakeOver').style.display = 'none'
            document.getElementById('snakeAgain').style.display = 'none'
            document.getElementById('snakeStart').style.display = 'block'
        })
    }

    setUp() {
        this.snakeCanvas = document.getElementById('snakeCanvas')
        this.ctx = this.snakeCanvas.getContext('2d')
        
        this.score = 0
        this.dx = 0
        this.dy = 0
        this.food_x, this.food_y
        this.snake = [{
            x: this.snakeCanvas.width / 2,
            y: this.snakeCanvas.height / 2
        }]
        
        this.gameLoop = null
        this.gameOver = false

        this.clearCanvas()
        this.drawScore()
        this.gameTick()
    }

    drawSnake() {
        this.snake.forEach((segment) => this.drawSnakeSegment(segment))
    }
    
    drawSnakeSegment(segment) {
        this.ctx.fillStyle = this.SNAKE_COLOR;
        this.ctx.fillRect(segment.x, segment.y, this.SNAKE_SIZE, this.SNAKE_SIZE);
        this.ctx.strokeStyle = this.SNAKE_BORDER_COLOR
        this.ctx.lineWidth = this.SNAKE_BORDER_SIZE
        this.ctx.strokeRect(segment.x, segment.y, this.SNAKE_SIZE, this.SNAKE_SIZE);
    }
    
    updateSnake() {
        var x, y
        if (this.snake[0].x + this.dx >= snakeCanvas.width) {
            x = 0
        } else if (this.snake[0].x + this.dx <= -this.SNAKE_SIZE) {
            x = snakeCanvas.width - this.SNAKE_SIZE
        } else {
            x = this.snake[0].x + this.dx
        }
        if (this.snake[0].y + this.dy >= snakeCanvas.height) {
            y = 0
        } else if (this.snake[0].y + this.dy <= -this.SNAKE_SIZE) {
            y = snakeCanvas.height - this.SNAKE_SIZE
        } else {
            y = this.snake[0].y + this.dy
        }
        const head = {
            x: x,
            y: y
        }
        this.snake.unshift(head)
        if (head.x === this.food_x && head.y === this.food_y) {
            [this.food_x, this.food_y] = this.randomCoordinate()
            this.score++
            this.drawScore()
        } else {
            this.snake.pop()
        }
    }
    
    drawFood() {
        if (!this.food_x && !this.food_y)
            [this.food_x, this.food_y] = this.randomCoordinate()
        this.ctx.fillStyle = this.FOOD_COLOR;
        this.ctx.fillRect(this.food_x, this.food_y, this.SNAKE_SIZE, this.SNAKE_SIZE);
    }
    
    drawScore() {
        document.getElementById('snakeScore').innerHTML = this.score
    }
    
    checkGameEnd() {
        this.snake.slice(1).forEach((segment) => {
            if (this.snake[0].x === segment.x && this.snake[0].y === segment.y) {
                this.gameOver = true
                document.getElementById('snakeOver').style.display = 'block'
                document.getElementById('snakeAgain').style.display = 'block'
                clearInterval(this.gameLoop)
                this.gameLoop = null;
            }
        })
    }
    
    clearCanvas() {
        this.ctx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
        this.ctx.fillStyle = this.CANVAS_COLOR;
        this.ctx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    }
    
    randomCoordinate() {
        return [Math.floor(Math.random() * snakeCanvas.width / this.SNAKE_SIZE) * this.SNAKE_SIZE,
            Math.floor(Math.random() * snakeCanvas.height / this.SNAKE_SIZE) * this.SNAKE_SIZE
        ]
    }

    gameTick() {
        if (this.dx || this.dy) {
            // clear instructions
            document.getElementById('snakeStart').style.display = 'none'
        }
        this.clearCanvas()
        this.updateSnake()
        this.checkGameEnd()
        this.drawFood()
        this.drawSnake()
    }
}

export { Snake };