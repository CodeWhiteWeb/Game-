document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.style.background = "black";
document.body.style.fontFamily = "Arial, sans-serif";

// Screen and grid setup
const gridSize1 = 20;
const cols = Math.floor(window.innerWidth / gridSize1);
const rows = Math.floor(window.innerHeight / gridSize1);
const snakes = [];
let player = { x: Math.floor(cols / 2), y: Math.floor(rows / 2) };
let playerElement;
let direc = null;
let gameRun = false;
let timer = 120; // survival timer

// Create game container
const gameContainer = document.createElement("div");
gameContainer.style.position = "absolute";
gameContainer.style.width = `${cols * gridSize1}px`;
gameContainer.style.height = `${rows * gridSize1}px`;
gameContainer.style.left = "50%";
gameContainer.style.top = "50%";
gameContainer.style.transform = "translate(-50%, -50%)";
document.body.appendChild(gameContainer);

// Create overlay pop-up
const popup = document.createElement("div");
popup.style.position = "fixed";
popup.style.top = "50%";
popup.style.left = "50%";
popup.style.transform = "translate(-50%, -50%)";
popup.style.padding = "20px";
popup.style.background = "rgba(0, 0, 0, 0.9)";
popup.style.color = "white";
popup.style.fontSize = "24px";
popup.style.textAlign = "center";
popup.style.borderRadius = "10px";
popup.style.opacity = "1";
popup.style.transition = "opacity 1s ease";
popup.innerText = "You are the Food! Survive for 2 Minutes! Do not get eaten! GO GO GO!";
document.body.appendChild(popup);

// Fade-out function
function fadeOutPopup() {
    setTimeout(() => {
        popup.style.opacity = "0";
        setTimeout(() => popup.remove(), 1000);
        gameRun = true;
        startGame();
    }, 2000);
}

// Create the player (food)
function createPlayer() {
    playerElement = document.createElement("div");
    playerElement.style.position = "absolute";
    playerElement.style.width = `${gridSize1}px`;
    playerElement.style.height = `${gridSize1}px`;
    playerElement.style.background = "red";
    playerElement.style.left = `${player.x * gridSize1}px`;
    playerElement.style.top = `${player.y * gridSize1}px`;
    gameContainer.appendChild(playerElement);
}

// Move the player
function movePlayer() {
    if (!gameRun) return;

    let newX = player.x;
    let newY = player.y;

    if (direc === "up") newY--;
    if (direc === "down") newY++;
    if (direc === "left") newX--;
    if (direc === "right") newX++;

    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
        player.x = newX;
        player.y = newY;
        playerElement.style.left = `${player.x * gridSize1}px`;
        playerElement.style.top = `${player.y * gridSize1}px`;
    }
}

// Handle keyboard input
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") direc = "up";
    if (e.key === "ArrowDown") direc = "down";
    if (e.key === "ArrowLeft") direc = "left";
    if (e.key === "ArrowRight") direc = "right";
});

// Create snakes
function createSnake() {
    let length = Math.floor(Math.random() * 5) + 2; // Length 2-6
    let startX = Math.floor(Math.random() * cols);
    let startY = Math.floor(Math.random() * rows);
    let snakeBody = [];

    for (let i = 0; i < length; i++) {
        let segment = document.createElement("div");
        segment.style.position = "absolute";
        segment.style.width = `${gridSize1}px`;
        segment.style.height = `${gridSize1}px`;
        segment.style.background = "green";
        segment.style.left = `${startX * gridSize1}px`;
        segment.style.top = `${startY * gridSize1}px`;
        gameContainer.appendChild(segment);
        snakeBody.push({ element: segment, x: startX, y: startY });
    }

    snakes.push({ body: snakeBody, direc: "random" });
}

// Move snakes
function moveSnakes() {
    snakes.forEach((snake) => {
        let head = snake.body[snake.body.length - 1];
        let newX = head.x;
        let newY = head.y;

        let randomDir = ["up", "down", "left", "right"][Math.floor(Math.random() * 4)];

        if (randomDir === "up") newY--;
        if (randomDir === "down") newY++;
        if (randomDir === "left") newX--;
        if (randomDir === "right") newX++;

        if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
            let newHead = { element: snake.body[0].element, x: newX, y: newY };
            newHead.element.style.left = `${newX * gridSize1}px`;
            newHead.element.style.top = `${newY * gridSize1}px`;

            for (let i = 0; i < snake.body.length - 1; i++) {
                snake.body[i].x = snake.body[i + 1].x;
                snake.body[i].y = snake.body[i + 1].y;
                snake.body[i].element.style.left = `${snake.body[i].x * gridSize1}px`;
                snake.body[i].element.style.top = `${snake.body[i].y * gridSize1}px`;
            }

            snake.body[snake.body.length - 1] = newHead;
        }
    });
}

// Check for collisions
function checkCollisions() {
    snakes.forEach((snake) => {
        snake.body.forEach((segment) => {
            if (segment.x === player.x && segment.y === player.y) {
                gameOver();
            }
        });
    });
}

// Timer countdown
function updateTimer() {
    if (!gameRun) return;
    timer--;
    if (timer <= 0) {
        gameWin();
    }
}

// Game over popup
function gameOver() {
    gameRun = false;
    popup.innerText = "You Got Eaten!";
    popup.style.opacity = "1";
    playerElement.style.display = "None";
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.style.opacity = "0";
        setTimeout(() => location.reload(), 1000);
    }, 2000);
}

// Game win popup
function gameWin() {
    gameRun = false;
    popup.innerText = "You Survived!";
    popup.style.opacity = "1";
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.style.opacity = "0";
        setTimeout(loadNextStage, 2000); 
    }, 2000);
}

// Start game function
let playerInterval, snakeMoveInterval, collisionInterval, timerInterval, snakeSpawnInterval;

function startGame() {
    createPlayer();
    playerInterval = setInterval(movePlayer, 200);
    snakeMoveInterval = setInterval(moveSnakes, 200);
    collisionInterval = setInterval(checkCollisions, 100);
    timerInterval = setInterval(updateTimer, 1000);
    snakeSpawnInterval = setInterval(createSnake, 3000); // Spawn new snakes
}

function stopGame() {
    clearInterval(playerInterval);
    clearInterval(snakeMoveInterval);
    clearInterval(collisionInterval);
    clearInterval(timerInterval);
    clearInterval(snakeSpawnInterval);
}

function loadNextStage() { 
    let script = document.querySelector("script[src='js/Stage1.js']");
    if (script) script.remove();
    let newScript = document.createElement("script");
    newScript.src = "js/Stage2.js";
    document.body.appendChild(newScript);
    stopGame();
    document.body.innerHTML = "";
    let styles = document.querySelectorAll("style");
    styles.forEach((style) => style.remove());
} 

// Start the game after fade-out
fadeOutPopup();
