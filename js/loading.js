let progress = 0;
const progressBar = document.getElementById("progress");
const loadingText = document.getElementById("loading-text");
const loadingBox = document.getElementById("loading-box");
const hintText = document.getElementById("hint-text"); // Reference to the hint text
let isTransforming = false;
let snake = [];
let direction = "right";
let gridSize = 20;
let gameInterval;
let canChangeDirection = true;
let autoFill = true; // Controls whether the bar auto-fills or needs player input
let messageIndex = 0;
let messageInterval;
let randomKey = localStorage.getItem("loadingKey") || "SPACE"; // Get stored key
let gameRunning = false;
let stopMessages = false; // Flag to stop messages
let messages = [ 
    "Help me, I am stuck step brother 😭😭😭😭😭😭", 
    "There is a 50% chance you will die eating air while breathing water 🌊", 
    "Loading… but why? 🤔 for a website?", 
    "I am tracking your car, Say hi! 👋", 
    "Maybe you know how to continue? 🤨 Help me complete loading...", 
    "Did you try pressing a certain key? Just saying... 😏", 
    "Congratulations! You are now stuck at 50%. 🎉", 
    "If you wait here long enough, nothing will happen. Just saying. 🙃" ,
    "Pressing random keys might help... or not. 🤷",
    "Did you know? The loading bar is sentient. Be nice to it. 🧠",
    "Hint: The key to success is literally a key. 🔑",
    "Fun fact: This loading bar has more personality than most people. 😎",
    "Try yelling at your screen. It might work. 📢",
    "Loading bars are like cats. They do what they want. 🐱",
    "Hint: The answer is closer than you think. 👀 (hint: keyboard)",
    "Pro tip: Patience is a virtue, but pressing keys is faster. ⌨️",
    "Ever wondered what happens if you press the wrong key? Try it. 😏",
    "Hint: Nah man, you are dumb, I won't say anything now. 🕵️"
]; 

if (hintText) { 
    hintText.innerHTML = `Press <b>${randomKey}</b> to continue loading.`; 
}

function updateProgress() { 
    if (progress < 50 && autoFill) {  
        progress += Math.random() * 10 + 5;  
        progress = Math.min(50, progress); // Stop at 50%  
        progressBar.style.width = progress + "%";  
        loadingText.innerText = `Loading ${progress}%`;  
        setTimeout(updateProgress, 500);  
    }  
     
    if (progress === 50) { 
        startFunnyMessages(); 
    } 
} 
// Show random funny messages & hints after 50% 
function startFunnyMessages() { 
    loadingText.innerText = "loading 50%";  
    messageIndex = 0;  

    function showNextMessage() {  
        if (stopMessages) return; // Stop messages if flag is set
        if (messageIndex >= messages.length) return; // Stop if no more messages  

        let message = messages[messageIndex];  
        loadingText.innerText = message;  
        messageIndex++;  

        // Dynamic delay based on message length (80ms per character)
        let delay = Math.max(message.length * 80, 2000); // Min 2 sec, longer messages stay longer  

        messageInterval = setTimeout(showNextMessage, delay);  
    }  

    setTimeout(showNextMessage, 3000); // Start showing messages after 3 seconds  
}  

// Start auto-filling up to 50% 
setTimeout(updateProgress, 500); 

// Listen for the correct key to continue loading after 50% 
document.addEventListener("keydown", (event) => {  
    if (event.key.toUpperCase() === randomKey && progress < 100) {  
        stopMessages = true; // Stop showing messages
        clearTimeout(messageInterval); // Clear ongoing message timeout
        progress += Math.random() * 10 + 5;  
        progress = Math.min(100, progress);  
        progressBar.style.width = progress + "%"; 
        loadingText.innerText = `Loading ${progress}%`; 

        if (progress === 100 && !isTransforming) { 
            setTimeout(() => { 
                isTransforming = true; 
                transformIntoSnake(); 
            }, 1000); 
        } 
    } 
});


document.addEventListener("keydown", handleKeyPress); 
 
function handleKeyPress(event) { 
    if (!gameRunning) return; 
 
    if (event.key === "ArrowUp" && direction !== "down") direction = "up"; 
    if (event.key === "ArrowDown" && direction !== "up") direction = "down"; 
    if (event.key === "ArrowLeft" && direction !== "right") direction = "left"; 
    if (event.key === "ArrowRight" && direction !== "left") direction = "right"; 
} 

function spawnPortal() { 
    let portal = document.createElement("div"); 
    portal.classList.add("portal"); 
    document.body.appendChild(portal); 
 
    let portalX = Math.floor(Math.random() * (window.innerWidth - 60)); 
    let portalY = Math.floor(Math.random() * (window.innerHeight - 60)); 
 
    portal.style.left = portalX + "px"; 
    portal.style.top = portalY + "px"; 
 
    console.log("Portal spawned at:", portalX, portalY); 
 
    let portalCheckInterval = setInterval(() => { 
        if (checkPortalCollision(portal)) { 
            clearInterval(portalCheckInterval); 
            enterPortal(portal); 
        } 
    }, 50); 
} 
 
function checkPortalCollision(portal) { 
    let head = snake[snake.length - 1]; // Snake's head 
    let headRect = head.element.getBoundingClientRect(); 
    let portalRect = portal.getBoundingClientRect(); 
 
    // console.log("Checking collision - Head:", headRect, "Portal:", portalRect); 
 
    return ( 
        headRect.left < portalRect.right && 
        headRect.right > portalRect.left && 
        headRect.top < portalRect.bottom && 
        headRect.bottom > portalRect.top 
    ); 
} 
 
function enterPortal(portal) { 
    console.log("Snake is entering the portal..."); 
    clearInterval(gameInterval); 
    gameRunning = false; 
    document.removeEventListener("keydown", handleKeyPress); 
 
    function absorbSegment(segmentIndex) { 
        if (segmentIndex < 0) { 
            setTimeout(loadNextStage, 100); 
            return; 
        } 
 
        let segment = snake[segmentIndex].element; 
 
        // Instantly make it disappear 
        segment.style.transform = "scale(0)"; 
        segment.style.opacity = "0"; 
 
        setTimeout(() => { 
            if (segment.parentNode) { 
                document.body.removeChild(segment); 
            } 
        }, 10); // Super-fast removal 
 
        requestAnimationFrame(() => absorbSegment(segmentIndex - 1)); // Instant next segment absorption 
    } 
 
    absorbSegment(snake.length - 1); // Start absorbing from the head 
} 
 
function stopErrors() { 
    loadingBox.classList.remove("error-mode"); 
    document.body.classList.remove("flashing"); 
    loadingText.innerText = "Processing..."; 
} 
 
function loadNextStage() { 
    let script = document.createElement("script"); 
    script.src = "js/nextStage.js"; 
    document.body.appendChild(script); 
} 
 
function transformIntoSnake() { 
    let rect = progressBar.getBoundingClientRect(); 
    let barWidth = rect.width; 
    let barHeight = rect.height; 
    let startX = rect.left; 
    let startY = rect.top; 
 
    let numSegments = Math.floor(barWidth / gridSize); 
     
    progressBar.style.display = "none"; // Hide the green bar 
    setTimeout(() => {loadingText.innerText = "Wait what..."}, 4000);
    // Create snake segments matching the exact loading bar size 
    for (let i = 0; i < numSegments; i++) { 
        let segment = document.createElement("div"); 
        segment.classList.add("snake-segment"); 
        segment.style.width = gridSize + "px"; 
        segment.style.height = gridSize + "px"; 
        segment.style.left = (startX + i * gridSize) + "px"; 
        segment.style.top = startY + "px"; 
        document.body.appendChild(segment); 
        snake.push({ element: segment, x: startX + i * gridSize, y: startY }); 
    } 

    gameInterval = setInterval(moveSnake, 100);

    // Start error mode after 5 seconds
    setTimeout(triggerErrorMode, 5000);
    setTimeout(spawnPortal, 10000);

}

function moveSnake() {
    let head = snake[snake.length - 1];
    let newX = head.x;
    let newY = head.y;

    if (direction === "right") newX += gridSize;
    if (direction === "left") newX -= gridSize;
    if (direction === "down") newY += gridSize;
    if (direction === "up") newY -= gridSize;

    // Move snake body properly
    let newHead = { element: snake[0].element, x: newX, y: newY };
    newHead.element.style.left = newX + "px";
    newHead.element.style.top = newY + "px";

    // Shift all segments forward
    for (let i = 0; i < snake.length - 1; i++) {
        snake[i].x = snake[i + 1].x;
        snake[i].y = snake[i + 1].y;
        snake[i].element.style.left = snake[i].x + "px";
        snake[i].element.style.top = snake[i].y + "px";
    }

    snake[snake.length - 1] = newHead;

    canChangeDirection = true;
}

// Handle controls
document.addEventListener("keydown", (event) => {
    if (!canChangeDirection) return;

    if (event.key === "ArrowRight" && direction !== "left") {
        direction = "right";
        canChangeDirection = false;
    }
    if (event.key === "ArrowLeft" && direction !== "right") {
        direction = "left";
        canChangeDirection = false;
    }
    if (event.key === "ArrowDown" && direction !== "up") {
        direction = "down";
        canChangeDirection = false;
    }
    if (event.key === "ArrowUp" && direction !== "down") {
        direction = "up";
        canChangeDirection = false;
    }
});

// Error mode after 5 seconds
function triggerErrorMode() {
    loadingBox.classList.add("error-mode"); // Red glow & shake effect
    document.body.classList.add("flashing"); // Flashing screen

    let warnings = ["SYSTEM FAILURE", "ERROR 404: BAR ESCAPED", "CRITICAL ERROR", "AAAAAAAAAAAAAAAAAA!!!", "WHAT THE HECK", "I'M ERROR"];
    let index = 0;

    setInterval(() => {
        loadingText.innerText = warnings[index % warnings.length];
        index++;
    }, 500);
}