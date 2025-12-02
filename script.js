let board = ["","","","","","","","",""];
let turn = "X";
let score = {X:0, O:0, Draw:0};
let firstPlayer = "X";
let mode = "2players";
let difficulty = "easy";
let colorX = "#ff0000";
let colorO = "#00ff00";
let soundActive = true;

/* --- MENU --- */

function startGame(selectedMode){
  mode = selectedMode;
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("robotMenu").classList.add("hidden");
  document.getElementById("settings").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  resetBoard();
}

function showRobotMenu(){
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("robotMenu").classList.remove("hidden");
}

function startGameRobot(selectedDifficulty){
  difficulty = selectedDifficulty;
  startGame("robot");
}

function backToMenu(){
  document.getElementById("robotMenu").classList.add("hidden");
  document.getElementById("settings").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}

function showSettings(){
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("settings").classList.remove("hidden");
}

function saveSettings(){
  colorX = document.getElementById("colorX").value;
  colorO = document.getElementById("colorO").value;
  soundActive = document.getElementById("soundToggle").checked;
  backToMenu();
}

/* --- GIOCO --- */

function makeMove(index){
  if(board[index] !== "") return; // <--- FIX IMPORTANTE

  board[index] = turn;
  let cell = document.querySelectorAll(".cell")[index];
  cell.textContent = turn;
  cell.style.color = (turn === "X") ? colorX : colorO;

  if(soundActive) document.getElementById("clickSound").play();

  if(checkWin(turn)){
    if(soundActive) document.getElementById("winSound").play();
    alert(`Ha vinto ${turn}!`);
    score[turn]++;
    updateScore();
    resetBoard();
    return;
  }

  if(board.every(c => c!=="")){
    if(soundActive) document.getElementById("drawSound").play();
    alert("Pareggio!");
    score.Draw++;
    updateScore();
    resetBoard();
    return;
  }

  turn = (turn==="X") ? "O" : "X";
  document.getElementById("turn").textContent = `Turno: Giocatore ${turn}`;

  if(mode==="robot" && turn==="O"){
    setTimeout(robotMove, 400);
  }
}

/* --- ROBOT --- */

function robotMove(){
  let empty = getEmptyCells();
  let move;

  if(difficulty==="easy") move = easyAIMove(empty);
  else if(difficulty==="medium") move = mediumAIMove(empty);
  else move = hardAIMove(empty);

  makeMove(move);
}

function easyAIMove(empty){
  return empty[Math.floor(Math.random()*empty.length)];
}

function mediumAIMove(empty){
  // 1️⃣ Cerca vittoria
  for(let i of empty){
    if(wouldWin(i,"O")) return i;
  }

  // 2️⃣ Blocca X
  for(let i of empty){
    if(wouldWin(i,"X")) return i;
  }

  // 3️⃣ Random
  return easyAIMove(empty);
}

function hardAIMove(empty){
  // Per ora usa medium, ma stabile e senza bug
  return mediumAIMove(empty);
}

/* --- SUPPORTO --- */

function wouldWin(index, player){
  board[index] = player;
  let win = checkWin(player);
  board[index] = "";
  return win;
}

function getEmptyCells(){
  return board.map((v,i)=> v==="" ? i : null).filter(v=>v!==null);
}

function checkWin(player){
  const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return wins.some(pattern => pattern.every(i => board[i] === player));
}

function updateScore(){
  document.getElementById("scoreX").textContent = score.X;
  document.getElementById("scoreO").textContent = score.O;
  document.getElementById("scoreDraw").textContent = score.Draw;
}

function resetBoard(){
  board = ["","","","","","","","",""];
  document.querySelectorAll(".cell").forEach(c => c.textContent = "");
  firstPlayer = (firstPlayer === "X") ? "O" : "X";
  turn = firstPlayer;
  document.getElementById("turn").textContent = `Turno: Giocatore ${turn}`;
}

function resetScores(){
  score = {X:0, O:0, Draw:0};
  updateScore();
}
