var ROWS = 10;
var COLS = 10;
var MAX_MINES = 20;
var MIN_MINES = 10;
var firstTurn = true;
var board, mineGrid, flagGrid, gameOver;

function initializeBoard(board){ //go thorugh every row and col, populating the board with 9s
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            board[row][col] = 9;
        }
    }
    return board;
}
function initializeMineGrid(mineGrid) { //go thorugh every row and col, populating the board with false
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            mineGrid[row][col] = false;
        }
    }
    return mineGrid;
}

function initializeFlagGrid(flagGrid) { //go thorugh every row and col, populating the board with false
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            flagGrid[row][col] = false;
        }
    }
    return flagGrid;
}

function placeMines(mineGrid, mineCount) {
    let placedMines = 0;

    while (placedMines < mineCount) { 
        let row = Math.floor(Math.random() * ROWS); //get random row number
        let col = Math.floor(Math.random() * COLS); //ger random column number

        if (!mineGrid[row][col]) { //if theres not a mine there
            mineGrid[row][col] = true; //set cell to true
            placedMines++;
        }
    }
    return mineGrid;
}

function revealTile(board,mineGrid,row,col) {
    let adjacentMines = 0;
    if (mineGrid[row][col]) { // Check for mine
        if (firstTurn) { // Cannot hit mine on first turn.
            placeMines(mineGrid, 1);
            mineGrid[row][col] = false;
        }
        else {
            return 2; // Hit a mine.
        }
    }
    firstTurn = false;
    if (board[row][col] == 9) {
        for (let tiles = 0; tiles < 9; tiles++) { 
            //starting from top left, go through every adjacent tile
            let rowPos = row - 1 + Math.floor(tiles / 3); 
            let colPos = col - 1 + (tiles % 3);
            
            if ((rowPos >= 0 && rowPos < ROWS) && (colPos >= 0 && colPos < COLS) && mineGrid[rowPos][colPos]) //if tile in bounds and contains a mine
                adjacentMines++;
        }
        board[row][col] = adjacentMines;

        if (adjacentMines == 0) {//If user selects a tile with no near mines reveal surroundin tiles
            for (let rowPos = row - 1; rowPos <= row + 1; rowPos++) {
                for (let colPos = col - 1; colPos <= col + 1; colPos++) {
                    if (rowPos >= 0 && rowPos < ROWS && colPos >= 0 && colPos < COLS) {
                        revealTile(board, mineGrid, rowPos, colPos);
                    }
                }
            }
        }
        return 1; // Success.
    }
    return 0; // Nothing Occured.
}

function checkWin(board,mineGrid) { //Goes through the board to see if every non-mine cell has been revealed, signifying a win
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (!mineGrid[row][col] && board[row][col] == 9) {
                return false; //If a non-mine cell is not revealed, continue playing
            }
        }
    }
    return true; //If every non-mine cell has been revealed, the game has been won
}

function flagCell(flagGrid, board, row, col) {
    if (board[row][col] != 9) {
        console.log("Invalid flag placement. Place flag on unrevealed tile");
        return;
    }
    flagGrid[row][col] = !flagGrid[row][col];
    return flagGrid
}



// Code chunk below replaces prompt-based input
// ========================================================================================================================================

function buildGrid() {
    const gameBoard = document.getElementById('board');
    gameBoard.innerHTML = ''; // Clear previous game

    // Create table rows and cells
    for (let row = 0; row < ROWS; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < COLS; col++) {
            const td = document.createElement('td'); // table cell data
            td.id = 'cell-' + row + '-' + col; // Unique ID for each cell
            td.onclick = () => handleReveal(row, col);
            td.oncontextmenu = (e) => {
                e.preventDefault(); // allows right click without browser menu popup
                handleFlag(row, col);
            };
            tr.appendChild(td); // Append cell to row
        }
        gameBoard.appendChild(tr); // Append row to table
    }
}

function render() {
    // Update the display based on current state of the board and flagGrid
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const td = document.getElementById('cell-' + row + '-' + col);
            const val = board[row][col];
            td.className = '';
            td.textContent = '';

            // flag
            if (val === 9) {
                if (flagGrid[row][col]) {
                    td.textContent = 'F';
                }
            // mine
            } else if (val === -1) {
                td.className = 'revlealed';
                td.textContent = '*'; 
            // safe cell
            } else {
                td.className = 'revealed';
                if (val > 0) {
                    td.textContent = val;
                }
            }
        }
    }
}

function revealAllMines() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (mineGrid[row][col]) {
                board[row][col] = -1; // -1 represents a mine
            }
        }
    }
}

function handleReveal(row, col) {
    if (gameOver) return;

    let revealResult = revealTile(board, mineGrid, row, col);
    render();

    // revealResult === 2 reprensents hitting a mine
    if (revealResult === 2) {
        gameOver = true;
        revealAllMines();
        render();
    } else if (checkWin(board, mineGrid)) {
        gameOver = true;
    }
    if (gameOver) {
        document.getElementById('status').textContent = `Game Over You ${checkWin(board, mineGrid) ? "Win!" : "Hit a Mine..."}`;
    } else {
        document.getElementById('status').textContent = '';
    }
}

function handleFlag(row, col) {
    if (gameOver) return;
    flagGrid = flagCell(flagGrid, board, row, col); // Update the flagGrid
    render();
}

function newGame() {
    // Create 2D arrays for board, mineGrid, and flagGrid
    board = Array(ROWS);
    mineGrid = Array(ROWS);
    flagGrid = Array(ROWS);
    for (let i = 0; i < ROWS; i++) {
        board[i] = Array(COLS);
        mineGrid[i] = Array(COLS);
        flagGrid[i] = Array(COLS);
    }
    board = initializeBoard(board);
    mineGrid = initializeMineGrid(mineGrid);
    flagGrid = initializeFlagGrid(flagGrid);
    mineGrid = placeMines(mineGrid, MIN_MINES); // fixed count for now
    firstTurn = true;
    gameOver = false;
    buildGrid();
    render();
    document.getElementById('status').textContent = '';


}

// ========================================================================================================================================



function main(){
    newGame();
}