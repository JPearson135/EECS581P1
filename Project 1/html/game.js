const ROWS = 10;
const COLS = 10;
const MINE_COUNT = 10;
const HIDDEN = 9;

const boardElement = document.querySelector('#board');
const statusElement = document.querySelector('#status');

let board;
let mines;
let firstTurn;
let gameOver;
let won;

function createEmptyGrid(value) {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(value));
}

function initializeGame() {
  board = createEmptyGrid(HIDDEN);
  mines = createEmptyGrid(false);
  firstTurn = true;
  gameOver = false;
  won = false;

  let placedMines = 0;
  while (placedMines < MINE_COUNT) {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);
    if (!mines[row][col]) {
      mines[row][col] = true;
      placedMines++;
    }
  }

  render();
}

function countAdjacentMines(row, col) {
  let count = 0;
  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    for (let colOffset = -1; colOffset <= 1; colOffset++) {
      const adjacentRow = row + rowOffset;
      const adjacentCol = col + colOffset;
      if (adjacentRow >= 0 && adjacentRow < ROWS && adjacentCol >= 0 && adjacentCol < COLS && mines[adjacentRow][adjacentCol]) {
        count++;
      }
    }
  }
  return count;
}

function revealTile(row, col) {
  if (gameOver || row < 0 || row >= ROWS || col < 0 || col >= COLS || board[row][col] !== HIDDEN) {
    return;
  }

  if (mines[row][col]) {
    if (firstTurn) {
      mines[row][col] = false;
      placeReplacementMine();
    } else {
      gameOver = true;
      return;
    }
  }

  firstTurn = false;
  board[row][col] = countAdjacentMines(row, col);

  if (board[row][col] === 0) {
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let colOffset = -1; colOffset <= 1; colOffset++) {
        revealTile(row + rowOffset, col + colOffset);
      }
    }
  }

  won = board.flat().filter(value => value === HIDDEN).length === MINE_COUNT;
  gameOver = won;
}

function placeReplacementMine() {
  let row;
  let col;
  do {
    row = Math.floor(Math.random() * ROWS);
    col = Math.floor(Math.random() * COLS);
  } while (mines[row][col] || board[row][col] !== HIDDEN);
  mines[row][col] = true;
}

function render() {
  boardElement.replaceChildren();

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement('button');
      cell.className = 'cell';
      cell.type = 'button';
      cell.setAttribute('aria-label', `Row ${row + 1}, column ${String.fromCharCode(65 + col)}`);

      if (gameOver && mines[row][col]) {
        cell.textContent = '*';
        cell.classList.add('mine');
        cell.disabled = true;
      } else if (board[row][col] === HIDDEN) {
        cell.textContent = '#';
        cell.addEventListener('click', () => {
          revealTile(row, col);
          render();
        });
      } else {
        cell.textContent = board[row][col];
        cell.classList.add('revealed');
        cell.disabled = true;
      }

      boardElement.appendChild(cell);
    }
  }

  statusElement.textContent = won ? 'You win!' : gameOver ? 'You hit a mine.' : 'Choose a cell.';
}

document.querySelector('#new-game').addEventListener('click', initializeGame);
initializeGame();
