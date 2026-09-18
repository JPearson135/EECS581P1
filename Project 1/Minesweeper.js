var ROWS = 10;
var COLS = 10;
var MAX_MINES = 20;
var MIN_MINES = 10;
var firstTurn = true;

function initializeBoard(board){
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            board[row][col] = 9;
        }
    }
    return board;
}
function initializeMineGrid(mineGrid) {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            mineGrid[row][col] = false;
        }
    }
    return mineGrid;
}

function initializeFlagGrid(flagGrid) {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            flagGrid[row][col] = false;
        }
    }
    return flagGrid;
}

function promptForMineCount() {
    let mineCount;

    do {
        mineCount = Number(prompt(`Enter number of mines: (${MIN_MINES}-${MAX_MINES})`));
        if (Number.isNaN(mineCount)){
            console.log("Invalid input. Please enter a number.");
            mineCount = -1;
        }
        if (mineCount < MIN_MINES || mineCount > MAX_MINES) {
            console.log(`Mine count must be between ${MIN_MINES} and ${MAX_MINES}`);
        }
    } while (mineCount < MIN_MINES || mineCount > MAX_MINES);

    return mineCount;
}

function placeMines(mineGrid, mineCount) {
    let placedMines = 0;

    while (placedMines < mineCount) {
        let row = Math.floor(Math.random() * ROWS);
        let col = Math.floor(Math.random() * COLS);

        if (!mineGrid[row][col]) {
            mineGrid[row][col] = true;
            placedMines++;
        }
    }
    return mineGrid;
}

function printBoard(board, flagGrid) {
    console.log("   A B C D E F G H I J");

    for (let row = 0; row < ROWS; row++) {
        let line = `${row+1} `;
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] == 9 && flagGrid[row][col]) {
                line+=("f ");
            }
            else if (board[row][col] == 9) {
                line+="# ";
            }
            else {
                line+= board[row][col] + " ";
            }
        }
        console.log(line);
    }
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
            let rowPos = row - 1 + Math.floor(tiles / 3);
            let colPos = col - 1 + (tiles % 3);
            if ((rowPos >= 0 && rowPos < ROWS) && (colPos >= 0 && colPos < COLS) && mineGrid[rowPos][colPos])
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
        printf("Invalid flag placement. Place flag on unrevealed tile\n");
        return;
    }
    flagGrid[row][col] = !flagGrid[row][col];
    return flagGrid
}

function main(){
    let board = Array(ROWS)
    let mineGrid = Array(ROWS)
    let flagGrid = Array(ROWS)
    for(let i=0; i<ROWS; i++){
        board[i] = Array(COLS);
        mineGrid[i] = Array(COLS);
        flagGrid[i] = Array(COLS);
    }
    
    let mineCount;
    
    board = initializeBoard(board);
    mineGrid = initializeMineGrid(mineGrid);
    flagGrid = initializeFlagGrid(flagGrid);

    mineCount = promptForMineCount();
    mineGrid = placeMines(mineGrid, mineCount);

    console.log("\nGame setup complete.");
    console.log("Board size:", ROWS," x ", COLS);
    console.log("Mines placed:",mineCount);
    console.log("Columns: A-J | Rows: 1-10");

    printBoard(board,flagGrid);

    let gameActive = true;
    let rowGuess;
    let cellChoice;

    while(gameActive){
        cellChoice = prompt("Would you like to reveal a cell (r) or place a flag (f)?: ");
        if (cellChoice == null || cellChoice.length === 0 || cellChoice != 'r' && cellChoice != 'f') {
            console.log("Invalid choice. Please enter 'r' or 'f'.\n");
            continue;
        }

        rowGuess = Number(prompt("Enter row: "));
        
        if(Number.isNaN(rowGuess)){
            console.log(`Invalid row. Please enter a number from 1 to ${ROWS}`)
            continue;
        }
        if (rowGuess < 1 || rowGuess > ROWS) {
            console.log(`Invalid row. Please enter a number from 1 to ${ROWS}`);
            continue; 
        }

        colGuess = (prompt("Enter column: "));
        
        if(colGuess == null || colGuess.length === 0){
            console.log("Invalid column. Please enter a letter from A to J")
            continue;
        }
        if (colGuess.length !== 1 || colGuess < 'A' || colGuess > 'J') {
            console.log("Invalid column. Please enter a letter from A to J")
            continue;
        }
        
        let selectedRow = rowGuess - 1;
        let selectedCol = colGuess.charCodeAt(0) - 'A'.charCodeAt(0);
        if (cellChoice == 'f') {
            flagCell(flagGrid, board, selectedRow, selectedCol);
        }

        else if (cellChoice == 'r'){
            if (board[selectedRow][selectedCol] != 9) {
                console.log("That tile has already been revealed. Please choose another tile.");
                continue;
            }
            if (flagGrid[selectedRow][selectedCol]) {
                console.log("Tile has been flagged. Unflag it to reveal it. \n");
                continue;
            }
            let revealResult = revealTile(board, mineGrid, selectedRow, selectedCol);
            gameActive = revealResult < 2 && !checkWin(board, mineGrid);
        }
        
        
        
        printBoard(board,flagGrid);
    } 
    console.log(`Game Over! You ${checkWin(board, mineGrid) ? "Win" : "hit a mine"}`);
}
main();