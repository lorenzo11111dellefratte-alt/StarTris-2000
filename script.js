
let board = [];
let turn = "X";
let mode = "2p";
let difficulty = "easy";
let colorX = "#ff0000";
let colorO = "#00ff00";
let robotBusy = false;

/* ---------- CREA TRIS ---------- */
function createBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    board = ["", "", "", "", "", "", "", "", ""];

    for (let i = 0; i < 9; i++) {
        let cell = document.createElement("div");
        cell.className = "cell";
        cell.onclick = () => makeMove(i);
        boardDiv.appendChild(cell);
    }
}

/* ---------- MENU ---------- */
function hideAll() {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
}

function startGame(selectedMode) {
    mode = selectedMode;
    turn = "X";
    robotBusy = false;

    hideAll();
    document.getElementById("game").classList.remove("hidden");

    createBoard();
    updateTurn();
}

function showRobotMenu() {
    hideAll();
    document.getElementById("robotMenu").classList.remove("hidden");
}

function showSettings() {
    hideAll();
    document.getElementById("settings").classList.remove("hidden");
}

function backToMenu() {
    hideAll();
    document.getElementById("menu").classList.remove("hidden");
}

function exitToMenu() {
    hideAll();
    document.getElementById("menu").classList.remove("hidden");
}

/* ---------- IMPOSTA SFONDO ---------- */
function applyBackground() {
    let file = document.getElementById("bgInput").files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = e => {
        document.body.style.background = `url(${e.target.result}) center/cover`;
    };
    reader.readAsDataURL(file);
}

function resetBackground() {
    document.body.style.background = "radial-gradient(circle, #0a0a2a, #000)";
}

/* ---------- ROBOT ---------- */
function startGameRobot(diff) {
    difficulty = diff;
    startGame("robot");
}

function robotMove() {
    robotBusy = true;

    let empty = board.map((v, i) => v === "" ? i : null).filter(i => i !== null);
    let move = empty[Math.floor(Math.random() * empty.length)];

    makeMove(move, true);
    robotBusy = false;
}

/* ---------- MOSSA PLAYER ---------- */
function makeMove(index, robot = false) {
    if (board[index] !== "") return;
    if (mode === "robot" && turn === "O" && !robot) return;
    if (robotBusy) return;

    board[index] = turn;

    let cell = document.querySelectorAll(".cell")[index];
    cell.textContent = turn;
    cell.style.color = turn === "X" ? colorX : colorO;

    if (checkWin()) {
        alert(`Ha vinto ${turn}!`);
        startGame(mode);
        return;
    }

    if (board.every(v => v !== "")) {
        alert("Pareggio!");
        startGame(mode);
        return;
    }

    turn = turn === "X" ? "O" : "X";
    updateTurn();

    if (mode === "robot" && turn === "O") {
        setTimeout(robotMove, 80);
    }
}

function updateTurn() {
    document.getElementById("turn").textContent = "Turno: " + turn;
}

/* ---------- VITTORIA ---------- */
function checkWin() {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    return wins.some(p => p.every(i => board[i] === turn));
}
