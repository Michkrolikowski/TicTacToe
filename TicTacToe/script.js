const board = document.getElementById("board");
const cells = document.querySelectorAll("[data-cell]");
const scoreXElement = document.getElementById("scoreX");
const scoreOElement = document.getElementById("scoreO");
const resetBtn = document.getElementById("resetBtn");
const resetScoresBtn = document.getElementById("resetScoresBtn");
const playerSlider = document.getElementById("playerSlider");
const playerLabel = document.getElementById("playerLabel");
let scoreX = getCookie("scoreX") || 0;
let scoreO = getCookie("scoreO") || 0;

let currentPlayer = "X";
let gameActive = true;

scoreXElement.textContent = scoreX;
scoreOElement.textContent = scoreO;

playerSlider.addEventListener("input", () => {
  currentPlayer = playerSlider.value === "0" ? "X" : "O";
  playerLabel.textContent = `Gracz ${currentPlayer}`;
});

cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick, { once: true });
});

resetBtn.addEventListener("click", resetBoard);
resetScoresBtn.addEventListener("click", resetScores);

function handleCellClick(e) {
  const cell = e.target;
  if (gameActive && cell.textContent === "") {
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);
    if (checkWin(currentPlayer)) {
      endGame(currentPlayer);
    } else if (isDraw()) {
      endGame(null);
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      playerSlider.value = currentPlayer === "X" ? "0" : "1";
      playerLabel.textContent = `Gracz ${currentPlayer}`;
    }
  }
}

function checkWin(player) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const cellValues = Array.from(cells).map((cell) => cell.textContent);
  for (let pattern of winPatterns) {
    if (pattern.every((index) => cellValues[index] === player)) {
      pattern.forEach((index) => cells[index].classList.add("win"));
      return true;
    }
  }
  return false;
}

function isDraw() {
  return Array.from(cells).every((cell) => cell.textContent !== "");
}

function endGame(winner) {
  gameActive = false;
  if (winner) {
    if (winner === "X") {
      scoreX++;
      setCookie("scoreX", scoreX, 365);
      scoreXElement.textContent = scoreX;
    } else {
      scoreO++;
      setCookie("scoreO", scoreO, 365);
      scoreOElement.textContent = scoreO;
    }
    setTimeout(() => alert(`${winner} wygrywa!`), 100);
  } else {
    setTimeout(() => alert("Remis!"), 100);
  }
}

function resetBoard() {
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.className = "";
    cell.removeEventListener("click", handleCellClick);
    cell.addEventListener("click", handleCellClick, { once: true });
  });
  currentPlayer = "X";
  gameActive = true;
  playerSlider.value = "0";
  playerLabel.textContent = `Gracz ${currentPlayer}`;
}

function resetScores() {
  scoreX = 0;
  scoreO = 0;
  setCookie("scoreX", scoreX, 365);
  setCookie("scoreO", scoreO, 365);
  scoreXElement.textContent = scoreX;
  scoreOElement.textContent = scoreO;
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

function getCookie(name) {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
