let ballLaunched = false; // Variable to track if the ball has been launched
let animationFrameId; // To track the current animation frame ID

function addNoScrollClass() {
    if (window.innerWidth > 768) {
        document.body.classList.add("no-scroll");
    }
}

function removeNoScrollClass() {
    document.body.classList.remove("no-scroll");
}

function checkDeviceAndInitializeGame() {
    const isMobile = window.innerWidth <= 768;
    const gameContainer = document.getElementById("gameContainer");
    const mainContent = document.getElementById("mainContent");

    if (isMobile) {
        gameContainer.style.display = "none";
        mainContent.classList.remove("show-game");
    } else {
        gameContainer.style.display = "block";
        mainContent.classList.add("show-game");

        initializeBreakoutGame();
        window.addEventListener("resize", restartGameOnResize); // Add event listener for window resize
    }
}

function restartGameOnResize() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId); // Stop the current game loop
    }
    initializeBreakoutGame();
}

function initializeBreakoutGame() {
    ballLaunched = false; // Reset ball launch state

    const canvas = document.getElementById("breakoutCanvas");
    const ctx = canvas.getContext("2d");

    const sidebarWidth = document.querySelector(".sidebar").offsetWidth;
    canvas.width = window.innerWidth - sidebarWidth;
    canvas.height = window.innerHeight;

    const ballRadius = 10;
    const initialSpeed = 4;
    const maxSpeed = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 60;
    let dx = initialSpeed;
    let dy = -initialSpeed;
    const paddleHeight = 10;
    const paddleWidth = 100;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let paddleSpeed = 10;

    let rightPressed = false;
    let leftPressed = false;

    // Colors
    const ballColor = "#FFFFFF";
    const paddleColor = "#00AA00";
    const brickColorTier1 = "#FF5733";
    const brickColorTier2 = "#FFBD33";
    const brickColorTier3 = "#33FF57";
    const brickColorTier4 = "#337BFF";
    const brickColorTier5 = "#D433FF";

    const brickRowCount = 5;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 80;
    const brickColumnCount = Math.floor(canvas.width / (brickWidth + brickPadding));
    const brickOffsetLeft = (canvas.width - (brickColumnCount * (brickWidth + brickPadding))) / 2;

    const bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = true;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = true;
        } else if (e.key === " " && !ballLaunched) { // Spacebar to launch the ball
            ballLaunched = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = false;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = false;
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = ballColor;
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight - 40, paddleWidth, paddleHeight);
        ctx.fillStyle = paddleColor;
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;

                    let brickColor;

                    switch (r) {
                        case 0:
                            brickColor = brickColorTier1;
                            break;
                        case 1:
                            brickColor = brickColorTier2;
                            break;
                        case 2:
                            brickColor = brickColorTier3;
                            break;
                        case 3:
                            brickColor = brickColorTier4;
                            break;
                        case 4:
                            brickColor = brickColorTier5;
                            break;
                    }

                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = brickColor;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                const b = bricks[c][r];
                if (b.status === 1) {
                    if (
                        x > b.x &&
                        x < b.x + brickWidth &&
                        y > b.y &&
                        y < b.y + brickHeight
                    ) {
                        dy = -dy;
                        b.status = 0;

                        if (r === 0) {
                            dx *= 1.1;
                            dy *= 1.1;
                        }

                        if (Math.abs(dx) > maxSpeed) {
                            dx = maxSpeed * Math.sign(dx);
                        }
                        if (Math.abs(dy) > maxSpeed) {
                            dy = maxSpeed * Math.sign(dy);
                        }
                    }
                }
            }
        }
    }

    function resetGame() {
        ballLaunched = false; // Reset ball launch state
        x = paddleX + paddleWidth / 2;
        y = canvas.height - paddleHeight - 50;
        dx = initialSpeed;
        dy = -initialSpeed;

        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r].status = 1;
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();

        if (ballLaunched) {
            if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                dx = -dx;
            }
            if (y + dy < ballRadius) {
                dy = -dy;
            } else if (y + dy > canvas.height - paddleHeight - 40) {
                if (x > paddleX && x < paddleX + paddleWidth) {
                    dy = -dy;
                } else {
                    resetGame();
                }
            }

            x += dx;
            y += dy;
        } else {
            // Position the ball on top of the paddle before launch
            x = paddleX + paddleWidth / 2;
            y = canvas.height - paddleHeight - 50;
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += paddleSpeed;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= paddleSpeed;
        }

        animationFrameId = requestAnimationFrame(draw);
    }

    draw();
}
