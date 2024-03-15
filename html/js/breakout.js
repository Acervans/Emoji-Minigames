import { getMousePos } from "./utils.js";

class Breakout {
    constructor() {

        this.setUp()

        document.addEventListener("keydown", e => this.keyDownHandler(e), false);
        document.addEventListener("keyup", e => this.keyUpHandler(e), false);
        this.breakoutCanvas.addEventListener("mousemove", e => this.mouseMoveHandler(e), false);

        this.runBtn.addEventListener("click", () => {
            this.draw();
            this.runBtn.disabled = true;
        });
    }

    setUp() {

        this.breakoutCanvas = document.getElementById("breakoutCanvas");
        this.runBtn = document.getElementById("runBreakoutButton");

        this.ctx = breakoutCanvas.getContext("2d");
        this.ballRadius = 15;

        this.x = breakoutCanvas.width / 2;
        this.y = breakoutCanvas.height - 30;
        this.dx = 2;
        this.dy = -2;

        this.paddleHeight = 10;
        this.paddleWidth = 75;

        this.paddleX = (breakoutCanvas.width - this.paddleWidth) / 2;
        this.rightPressed = false;
        this.leftPressed = false;

        this.brickRowCount = 10;
        this.brickColumnCount = 8;
        this.brickWidth = 90;
        this.brickHeight = 20;
        this.brickPadding = 15;
        this.brickOffsetTop = 50;
        this.brickOffsetLeft = 20;

        this.score = 0;
        this.lives = 3;

        this.bricks = [];
        this.gameOver = false;

        for (let c = 0; c < this.brickColumnCount; c++) {
            this.bricks[c] = [];
            for (let r = 0; r < this.brickRowCount; r++) {
                this.bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
        
        this.runBtn.disabled = false;
        this.drawFrame()
    }


    keyDownHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            this.rightPressed = true;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            this.leftPressed = true;
        }
    }

    keyUpHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            this.rightPressed = false;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            this.leftPressed = false;
        }
    }

    mouseMoveHandler(e) {
        const pos = getMousePos(breakoutCanvas, e)

        if (pos.x > 0 && pos.x < breakoutCanvas.width) {
            this.paddleX = pos.x - this.paddleWidth / 2;
        }
    }

    collisionDetection() {
        for (let c = 0; c < this.brickColumnCount; c++) {
            for (let r = 0; r < this.brickRowCount; r++) {
                let b = this.bricks[c][r];
                if (b.status == 1) {
                    if (
                        this.x + this.ballRadius > b.x &&
                        this.x - this.ballRadius < b.x + this.brickWidth &&
                        this.y + this.ballRadius > b.y &&
                        this.y - this.ballRadius < b.y + this.brickHeight
                    ) {
                        this.dy = -this.dy;
                        b.status = 0;
                        this.score++;
                        if (this.score == this.brickRowCount * this.brickColumnCount) {
                            alert("YOU WIN, CONGRATS!");
                            this.gameOver = true;
                        }
                    }
                }
            }
        }
    }

    drawBall() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawPaddle() {
        this.ctx.beginPath();
        this.ctx.rect(this.paddleX, breakoutCanvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawBricks() {
        for (let c = 0; c < this.brickColumnCount; c++) {
            for (let r = 0; r < this.brickRowCount; r++) {
                if (this.bricks[c][r].status == 1) {
                    const brickX = r * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
                    const brickY = c * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
                    this.bricks[c][r].x = brickX;
                    this.bricks[c][r].y = brickY;
                    this.ctx.beginPath();
                    this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
                    this.ctx.fillStyle = "#0095DD";
                    this.ctx.fill();
                    this.ctx.closePath();
                }
            }
        }
    }

    drawScore() {
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fillText("Score: " + this.score, 8, 20);
    }

    drawLives() {
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fillText("Lives: " + this.lives, breakoutCanvas.width - 65, 20);
    }

    drawFrame() {
        this.ctx.clearRect(0, 0, breakoutCanvas.width, breakoutCanvas.height);
        this.drawBricks();
        this.drawBall();
        this.drawPaddle();
        this.drawScore();
        this.drawLives();
        this.collisionDetection();
    }

    draw() {
        this.drawFrame()

        if (this.x + this.dx > breakoutCanvas.width - this.ballRadius || this.x + this.dx < this.ballRadius) {
            this.dx = -this.dx;
        }
        if (this.y + this.dy < this.ballRadius) {
            this.dy = -this.dy;
        } else if (this.y + this.dy > breakoutCanvas.height - this.ballRadius) {
            if (this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth) {
                this.dy = -this.dy;
            } else {
                this.lives--;
                if (!this.lives) {
                    alert("GAME OVER");
                    this.gameOver = true;
                } else {
                    this.x = breakoutCanvas.width / 2;
                    this.y = breakoutCanvas.height - 30;
                    this.dx = 3;
                    this.dy = -3;
                    this.paddleX = (breakoutCanvas.width - this.paddleWidth) / 2;
                }
            }
        }

        if (this.rightPressed && this.paddleX < breakoutCanvas.width - this.paddleWidth) {
            this.paddleX += 7;
        } else if (this.leftPressed && this.paddleX > 0) {
            this.paddleX -= 7;
        }

        this.x += this.dx;
        this.y += this.dy;

        if (!this.gameOver)
            requestAnimationFrame(() => this.draw());
        else
            this.setUp();
    }
}

export { Breakout };