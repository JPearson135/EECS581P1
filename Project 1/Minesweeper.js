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
function printBoard(board) {
    console.log("    A B C D E F G H I J");

    for (let row = 0; row < ROWS; row++) {
        let line = `${row+1} `;
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] == 9) {
                line+="# ";
            }
            else {
                line+= board[row][col] + " ";
            }
        }
        console.log(line);
    }
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

    //mineCount = promptForMineCount();
    //placeMines(mineGrid, mineCount);

    console.log("\nGame setup complete.");
    console.log("Board size:", ROWS," x ", COLS);
    console.log("Mines placed:",mineCount);
    console.log("Columns: A-J | Rows: 1-10");

    printBoard(board);
}
main();