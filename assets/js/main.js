'use strict';

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let x = canvas.width/2;
let y = canvas.height-30;
let ballRadius = 10;

let dx = 2;
let dy = -2;

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth)/2;

let paddleDx = 7;
let rightPressed;
let leftPressed;

let xAsRectangle;
let yAsRectange;

let brickRowCount = 5;
let brickColumnCount = 3;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffSetTop = 30;
let brickOffSetLeft = 30;
let bricks;

let score = 0;
let lives = 3;

document.addEventListener('DOMContentLoaded', init);

function init() {
    requestAnimationFrame(draw);
	amountOfBricks();
	document.addEventListener('keydown', keyDownHandler, false);
	document.addEventListener('keyup', keyupHandler, false);
	document.addEventListener("mousemove", mouseMoveHandler, false)
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function amountOfBricks() {
	bricks = [];
	for (let c = 0; c < brickColumnCount; c++) {
		bricks[c] = [];
		for (let r = 0; r < brickRowCount; r++) {
			bricks[c][r] = { x: 0, y: 0, status: 1 };
		}
	}
}

function keyDownHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = true;
	} else if (e.keyCode == 37) {
		leftPressed = true;
	}
}

function keyupHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = false;
	} else if (e.keyCode == 37) {
		leftPressed = false;
	}
}

function collisionDetection() {
	for (let c = 0; c < brickColumnCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			let b = bricks[c][r];
			if (b.status == 1) {
				if (x > b.x && x < b.x+brickWidth && y > b.y && y < b.y + brickHeight) {
					dy = -dy;
					b.status = 0;
					score++;
					if (score == brickRowCount*brickColumnCount) {
						alert("YOU WIN!!!");
						document.location.reload();

					}
				}
			}
		}
	}
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawScore() {
	ctx.font = '16px Arial';
	ctx.fillStyle = "orange";
	ctx.fillText("Score: " + score, 8, 20);
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "blue";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = 'red';
	ctx.fill();
	ctx.closePath();
}

function dwawBricks() {
	for(let c=0; c<brickColumnCount; c++) {
    	for(let r=0; r<brickRowCount; r++) {
      		if(bricks[c][r].status == 1) {
        	let brickX = (r*(brickWidth+brickPadding))+brickOffSetLeft;
        	let brickY = (c*(brickHeight+brickPadding))+brickOffSetTop;
        	bricks[c][r].x = brickX;
        	bricks[c][r].y = brickY;
        	ctx.beginPath();
        	ctx.rect(brickX, brickY, brickWidth, brickHeight);
        	ctx.fillStyle = "#0095DD";
        	ctx.fill();
        	ctx.closePath();
			}
		}
	}
}


function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	dwawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();
	collisionDetection();

	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}
	if (y + dy < ballRadius ||
	(
		y + dy > canvas.height - paddleHeight - ballRadius
		&& x + dx > paddleX
		&& x + dx < paddleX + paddleWidth
	)
	) {
		dy = -dy;
	} else if (y + dy > canvas.height- ballRadius) {
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		}
		else {
			lives --;
			if (!lives) {
				alert("Game over");
				document.location.reload();
			}
		 	else {
			 	x = canvas.width/2;
			 	y = canvas.height-30;
			 	dx = 3;
			 	dy = -3
			 	paddleX = (canvas.width-paddleWidth)/2;
		 	}
	 	}
	}
	if (rightPressed && (paddleX + paddleWidth) < canvas.width) {
		paddleX += paddleDx;
	} else if (leftPressed && paddleX > 0) {
		paddleX -= paddleDx;
	}
	x += dx;
	y += dy;

	requestAnimationFrame(draw);
	// or
	// setInterval(draw, 1000);
}
