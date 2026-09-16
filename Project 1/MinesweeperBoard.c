#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define ROWS 10
#define COLS 10
#define MIN_MINES 10
#define MAX_MINES 20
bool firstTurn = true;

void initializeBoard(int board[ROWS][COLS]) {
    for (int row = 0; row < ROWS; row++) {
        for (int col = 0; col < COLS; col++) {
            board[row][col] = 9;
        }
    }
}

void initializeMineGrid(bool mineGrid[ROWS][COLS]) {
    for (int row = 0; row < ROWS; row++) {
        for (int col = 0; col < COLS; col++) {
            mineGrid[row][col] = false;
        }
    }
}

void initializeFlagGrid(bool flagGrid[ROWS][COLS]) {
    for (int row = 0; row < ROWS; row++) {
        for (int col = 0; col < COLS; col++) {
            flagGrid[row][col] = false;
        }
    }
}

int promptForMineCount(void) {
    int mineCount;

    do {
        printf("Enter number of mines (%d-%d): ", MIN_MINES, MAX_MINES);
        if (scanf("%d", &mineCount) != 1) {
            printf("Invalid input. Please enter a number.\n");
            while (getchar() != '\n') {
                ;
            }
            mineCount = -1;
        }

        if (mineCount < MIN_MINES || mineCount > MAX_MINES) {
            printf("Mine count must be between %d and %d.\n", MIN_MINES, MAX_MINES);
        }
    } while (mineCount < MIN_MINES || mineCount > MAX_MINES);

    return mineCount;
}

void placeMines(bool mineGrid[ROWS][COLS], int mineCount) {
    int placedMines = 0;

    while (placedMines < mineCount) {
        int row = rand() % ROWS;
        int col = rand() % COLS;

        if (!mineGrid[row][col]) {
            mineGrid[row][col] = true;
            placedMines++;
        }
    }
}

void printBoard(const int board[ROWS][COLS]) {
    printf("    A B C D E F G H I J\n");

    for (int row = 0; row < ROWS; row++) {
        printf("%2d  ", row + 1);
        for (int col = 0; col < COLS; col++) {
            printf("%d ", board[row][col]);
        }
        printf("\n");
    }
}
void printMines(const bool board[ROWS][COLS]) {
    printf("    A B C D E F G H I J\n");

    for (int row = 0; row < ROWS; row++) {
        printf("%2d  ", row + 1);
        for (int col = 0; col < COLS; col++) {
            printf("%d ", board[row][col]);
        }
        printf("\n");
    }
}

int revealTile(int board[ROWS][COLS], bool mineGrid[ROWS][COLS], int row, int col) {
    int adjacentMines = 0;
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
        for (int tiles = 0; tiles < 9; tiles++) {
            int rowPos = row - 1 + (tiles / 3);
            int colPos = col - 1 + (tiles % 3);
            if ((rowPos >= 0 && rowPos < ROWS) && (colPos >= 0 && colPos < COLS) && mineGrid[rowPos][colPos])
                adjacentMines++;
        }
        board[row][col] = adjacentMines;
        return 1; // Success.
    }
    return 0; // Nothing Occured.
}

int main(void) {
    int board[ROWS][COLS];
    bool mineGrid[ROWS][COLS];
    bool flagGrid[ROWS][COLS];
    int mineCount;

    srand((unsigned int)time(NULL));

    initializeBoard(board);
    initializeMineGrid(mineGrid);
    initializeFlagGrid(flagGrid);

    mineCount = promptForMineCount();
    placeMines(mineGrid, mineCount);

    printf("\nGame setup complete.\n");
    printf("Board size: %d x %d\n", ROWS, COLS);
    printf("Mines placed: %d\n", mineCount);
    printf("Columns: A-J | Rows: 1-10\n");

    printBoard(board);
    printMines(mineGrid); // Mine printing for debugging.

    bool gameActive = true;
    int rowGuess;
    int colGuess;
    while (gameActive) {
        printf("Enter row: ");
        scanf("%d", &rowGuess);
        printf("Enter column: ");
        scanf("%d", &colGuess);
        gameActive = (revealTile(board, mineGrid, rowGuess, colGuess) < 2); // 2 = Mine Hit, 3 = Tiles cleared. 0/1 aren't states that end the game.
        printBoard(board);
        printMines(mineGrid); // Mine printing for debugging.
    }

    return 0;
}
