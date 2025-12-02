let board = ["","","","","","","","",""];
let turn = "X";
let score = {X:0, O:0, Draw:0};
let firstPlayer = "X";
let mode = "2players";
let difficulty = "easy";
let colorX = "#ff0000";
let colorO = "#00ff00";
let soundActive = true;
let defaultBackground = "radial-gradient(circle, #0a0a2a, #000)";

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

function backToMenu(){
  document.getElementById("robotMenu").classList.add("hidden");
  document.getElementById("settings").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}

function backToMenuFromGame(){
  document.getElementById("game").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}

function startGameRobot(selectedDifficulty){
  difficulty = selectedDifficulty;
  startGame("robot");
}

function showSettings(){
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("settings").classList.remove("hidden");
  document.getElementById("previewX").style.backgroundColor = colorX;
  document.getElementById("previewO").style.backgroundColor = colorO;
}

function saveSettings(){
  colorX = document.getElementById("colorX").value;
  colorO = document.getElementById("colorO").value;
  soundActive = document.getElementById("soundToggle").checked;

  document.getElementById("previewX").style.backgroundColor = colorX;
  document.getElementById("previewO").style.backgroundColor = colorO;

  backToMenu();
}

/* --- SFONDO --- */
function applyBackground(){
  let url = document.getElementById("bgUrl").value.trim();
  if(url){
    document.body.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundColor = "transparent";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  }
}

function resetBackground(){
  document.body.style.backgroundImage = "";
  document.body.style.background = defaultBackground;
}

/* --- GIOCO --- */
function makeMove(index){
  if(board[index] === ""){
    board[index] = turn;
    let cell = document.querySelectorAll(".cell")[index];
    cell.textContent = turn;
    cell.style.color = (turn === "X") ? colorX : colorO;
    if(soundActive) document.getElementById("clickSound").play();

    if(checkWin(turn)){
      if(soundActive) document.getElementById("winSound").play();
      showPopup(`Ha vinto ${turn}!`);
      score[turn]++;
      updateScore();
      return;
    }

    if(board.every(c => c!=="")){
      if(soundActive) document.getElementById("drawSound").play();
      showPopup("Pareggio!");
      score.Draw++;
      updateScore();
      return;
    }

    turn = (turn==="X")?"O":"X";
    document.getElementById("turn").textContent = `Turno: Giocatore ${turn}`;

    if(mode==="robot" && turn==="O"){
      setTimeout(robotMove, 500);
    }
  }
}

/* --- ROBOT --- */
function robotMove(){
  let empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  let move;
  if(difficulty==="easy"){
    move = empty[Math.floor(Math.random()*empty.length)];
  } else if(difficulty==="medium"){
    move = mediumAIMove();
  } else {
    move = hardAIMove();
  }
  makeMove(move);
}

function mediumAIMove(){
  for(let i=0;i<9;i++){
    if(board[i]===""){
      board[i]="O";
      if(checkWin("O")){board[i]=""; return i;}
      board[i]="X";
      if(checkWin("X")){board[i]=""; return i;}
      board[i]="";
    }
  }
  let empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

function hardAIMove(){
  return mediumAIMove();
}

/* --- SUPPORTO --- */
function checkWin(player){
  const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return wins.some(pattern=>pattern.every(i=>board[i]===player));
}

function updateScore(){
  document.getElementById("scoreX").textContent = score.X;
  document.getElementById("scoreO").textContent = score.O;
  document.getElementById("scoreDraw").textContent = score.Draw;
}

function resetBoard(){
  board=["","","","","","","","",""];
  document.querySelectorAll(".cell").forEach(c=>c.textContent="");
  firstPlayer = (firstPlayer==="X")?"O":"X";
  turn = firstPlayer;
  document.getElementById("turn").textContent = `Turno: Giocatore ${turn}`;
}

function resetScores(){
  score={X:0,O:0,Draw:0};
  updateScore();
}

/* --- POPUP --- */
function showPopup(message){
  document.getElementById("popupText").textContent = message;
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup(){
  document.getElementById("popup").classList.add("hidden");
  resetBoard();
}
