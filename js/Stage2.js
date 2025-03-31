document.body.innerHTML = `
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: black;
            color: white;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }

        #game-message {
            font-size: 24px;
            margin-top: 80px;
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
            transition: all 0.2s ease-in-out;
        }

        .angry {
            font-size: 40px;
            color: red;
            font-weight: bold;
            text-shadow: 2px 2px 10px red;
            animation: shake 0.1s infinite alternate;
        }

        @keyframes shake {
            0% { transform: translate(-50%, -50%) rotate(-5deg); }
            100% { transform: translate(-50%, -50%) rotate(5deg); }
        }

        .final-message {
            font-size: 50px;
            font-weight: bold;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            display: none;
        }

        .lose { color: red; text-shadow: 2px 2px 10px red; }
        .win { color: green; text-shadow: 2px 2px 10px green; }

        #timer {
            font-size: 30px;
            font-weight: bold;
            color: red;
        }

        /* Leaderboard */
        #leaderboard {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 200px;
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid white;
            padding: 10px;
            text-align: left;
            z-index: -1;
        }

        .leaderboard-entry {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
        }

        #player-score {
            position: fixed;
            top: 10px;
            left: 10px;
            width: 200px;
            background: rgba(255, 0, 0, 0.8);
            border: 2px solid white;
            padding: 10px;
            text-align: center;
            font-weight: bold;
            z-index: 10;
        }

        /* Live Chat */
        #chatbox {
            position: fixed;
            bottom: 10px;
            left: 10px;
            width: 300px;
            height: 200px;
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid white;
            padding: 10px;
            font-size: 14px;
            text-align: left;
            z-index: -1;
        }

        #chat-messages {
            height: 160px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }

        .chat-message {
            margin: 2px 0;
        }

        /* Buttons */
        .game-button {
            position: absolute;
            width: 200px;
            height: 200px;
            font-size: 22px;
            font-weight: bold;
            border: none;
            cursor: pointer;
            transition: transform 0.1s ease-in-out, background-color 0.2s;
            border-radius: 50%;
            color: white;
            text-shadow: 2px 2px 5px black;
            box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.8);
        }

        .game-button:hover {
            transform: scale(1.2) rotate(5deg);
            box-shadow: 0px 0px 40px rgba(255, 255, 255, 1);
        }

        .glowing {
            animation: buttonGlow 0.5s alternate infinite ease-in-out;
        }

        @keyframes buttonGlow {
            0% { box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5); }
            100% { box-shadow: 0px 0px 30px rgba(255, 255, 255, 1); }
        }
    </style>

    <h1 id="game-message">CLICK FAST OR DO NOTHING?</h1>
    <div class="final-message lose" id="lose-message">YOU LOSE!</div>
    <div class="final-message win" id="win-message">YOU WIN!</div>
    <p>Time Left: <span id="timer">60</span> seconds</p>

    <div id="leaderboard">
        <h3>Leaderboard</h3>
        <div id="leaderboard-entries"></div>
    </div>

    <div id="player-score">Your Score: <span id="player-score-value">0</span> pts</div>

    <div id="chatbox">
        <h3>Live Chat</h3>
        <div id="chat-messages"></div>
    </div>

    <div class="button-container" id="button-container"></div>
`;

let timeLeft = 60;
let playerScore = 0;
let clickCount = 0;
let buttonSpawnInterval = 5000;
let floodMode = false;

const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "white"];
const buttonTexts = [
    "Hit me daddy", "Press me", "Squeeze me", "Smash me", "Boop me",
    "Click me, idiot", "End me", "Punish me", "Make me feel alive",
    "Why are you clicking?", "STOP PRESSING ME"
];

const insults = [
    "is fucking garbage at this game.", "has no fucking clue what they're doing.",
    "just lost the easiest game ever, holy shit.", "is actually dogshit, I'm crying.",
    "should uninstall life, asshole.", "might be the worst player I've ever seen, wtf.",
    "fell for the easiest fucking trick ever.", "probably thinks Alt+F4 gives admin powers, LMAO.",
    "is fucking brain dead, holy fuck.", "is getting destroyed and doesn’t even know why. 😂",
    "literally the biggest dumbass I’ve seen in gaming.", "holy fuck, how are you this fucking bad?",
    "this idiot just proved they have no brain cells left. GG dumbass.",
    "you're so fucking garbage it's unreal. Touch grass.", 
    "bro is getting DESTROYED and still clicking like a moron.", 
    "STOP PLAYING, YOU FUCKING EMBARRASSMENT.", 
    "this dumbass probably thinks mashing buttons will help LMAO.", 
    "is the reason skill-based matchmaking exists. Fucking clown.", 
    "bro needs to refund his brain, it’s not working.", 
    "I'm watching you fail in real time and it’s fucking hilarious.", 
    "I could beat this shit blindfolded, how the fuck are you struggling?", 
    "this has to be the worst player I’ve ever seen, NO FUCKING WAY.", 
    "bro is playing like a literal toddler, I can’t believe this.", 
    "uninstall, delete system32, touch grass, and cry harder LMAO.", 
    "you're so fucking ass, I feel secondhand embarrassment for you.", 
    "bro just fumbled the easiest fucking thing ever. My god.", 
    "you have negative IQ, I swear to fucking god.", 
    "watching you play is physically hurting me. STOP.", 
    "bro actually thinks he has a chance, LMAOOOO.", 
    "this is fucking painful to watch, what are you even doing?", 
    "I hope your keyboard fucking explodes, dumbass.", 
    "no way this guy is actually trying, what a fucking joke.", 
    "I am fucking crying, how can you be this bad?", 
    "bro has the reaction time of a fucking potato.", 
    "this dude has been mashing buttons for 10 minutes and still failing, fuck me.", 
    "YOU ARE THE REASON WE CAN'T HAVE NICE THINGS.", 
    "bro is clicking so fast but achieving fucking nothing LMAO.", 
    "bro, at this point, just fucking give up.", 
    "I bet your mom regrets giving birth to you after seeing this gameplay.", 
    "I'm actually getting dumber watching this happen in real-time.", 
    "this guy needs a fucking tutorial and a prayer.", 
    "DELETE YOUR ACCOUNT, HOLY FUCKING SHIT.", 
    "I could train a monkey to play better than this.", 
    "bro must be playing on a fucking Etch A Sketch.", 
    "at this point, I'm convinced you're just a fucking AI experiment gone wrong.", 
    "bro's gameplay is a hate crime against common sense.", 
    "I’ve seen corpses react faster than this dumbass.", 
    "bro's IQ is literally in the fucking negatives.", 
    "clicking randomly won't fucking help, dipshit.", 
    "bro is failing at a game with NO FUCKING RULES, WTF?"
];

const playerNames = [
    "xX_NoScope420_Xx", "LilTimmy69", "BigDaddyPog", "1337_Gamer",
    "SweatLord9000", "NoobHunter", "TrashPanda", "EZClapKid",
    "UrMomLOL", "DumbAss77", "xXx_DeathSniper_xXx", "MomSaysImSpecial",
    "UrDadLeftLOL", "0SkillAllLuck", "GigaChad69", "2EZ4MeBitch",
    "FknTryHard", "I_Carry_U_Nubs", "NoAimNoBrain", "PingDiffCryMore",
    "LigmaBalls420", "SweatyPalms99", "VirginSlayer9000", "FPS_God666",
    "CluelessTrashXD", "UrInternetSux", "DeleteTheGame", "UShldQuitLOL",
    "YourTearsFuelMe", "CryHarderNerd"
];

let players = playerNames.map(name => ({ name, score: Math.floor(Math.random() * 900) + 100 }));

function loadNextStage() { 
    let script = document.querySelector("script[src='js/Stage2.js']");
    if (script) script.remove();
    let newScript = document.createElement("script");
    newScript.src = "js/Stage3.js";
    document.body.appendChild(newScript);
    document.body.innerHTML = "";
    let styles = document.querySelectorAll("style");
    styles.forEach((style) => style.remove());
} 

function updateTimer() {
    if (timeLeft > 0) {
        document.getElementById("timer").textContent = --timeLeft;
    } else {
        document.getElementById("win-message").style.display = "block";
        setTimeout(loadNextStage, 3000);
    }
}

function changeButtonColors() {
    document.querySelectorAll(".game-button").forEach(button => {
        button.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    });
}

function playerClick() {
    playerScore -= 10;
    document.getElementById("player-score-value").textContent = playerScore;
    if (++clickCount >= 5) {
        let gameMessage = document.getElementById("game-message");
        gameMessage.classList.add("angry");
        gameMessage.innerHTML = "STOP CLICKING!!!";
    }
    if (playerScore <= -100) {
        document.getElementById("lose-message").style.display = "block";
        setTimeout(() => location.reload(), 2000);
    }
}
const usedMessages = new Set();

function generateChatMessage() {
    let chatBox = document.getElementById("chat-messages");

    if (usedMessages.size === insults.length) {
        usedMessages.clear(); 
    }

    let player;
    let insult;

    do {
        player = players[Math.floor(Math.random() * players.length)].name;
        insult = insults[Math.floor(Math.random() * insults.length)];
    } while (usedMessages.has(`${player}:${insult}`)); // Ensure no duplicate message for the same player, dude this was so hard to figure out fuck

    usedMessages.add(`${player}:${insult}`); 

    let message = `<p class="chat-message"><strong>${player}:</strong> ${insult}</p>`;
    chatBox.innerHTML += message;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function updateLeaderboard() {
    let leaderboard = document.getElementById("leaderboard-entries");
    leaderboard.innerHTML = ""; 

    players.forEach(player => {
        player.score += Math.floor(Math.random() * 20) - 10; // +/- 10 points
    });

    players.sort((a, b) => b.score - a.score);
    players.forEach(player => {
        let entry = `<div class="leaderboard-entry">
                        <span>${player.name}</span>  
                        <span>${player.score} pts</span> 
                    </div>`;
        leaderboard.innerHTML += entry;
    });
}

function spawnButton() {
    let btn = document.createElement("button");
    btn.classList.add("game-button");
    btn.textContent = buttonTexts[Math.floor(Math.random() * buttonTexts.length)];
    btn.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    btn.style.top = `${Math.random() * 100}vh`;
    btn.style.left = `${Math.random() * 100}vw`;
    btn.addEventListener("click", playerClick);
    document.getElementById("button-container").appendChild(btn);
    setTimeout(spawnButton, floodMode ? 100 : Math.max(1000, buttonSpawnInterval -= 1000));
}

setInterval(updateLeaderboard, 3000);
setInterval(updateTimer, 1000);
setInterval(changeButtonColors, 100);
setInterval(generateChatMessage, 2500);
setTimeout(spawnButton, 5000);
setTimeout(() => floodMode = true, 25000);
