#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define ROWS 10
#define COLS 10
#define MIN_MINES 10
#define MAX_MINES 20

void initializeBoard(char board[ROWS][COLS]) {
    for (int row = 0; row < ROWS; row++) {
        for (int col = 0; col < COLS; col++) {
            board[row][col] = '#';
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

void printBoard(const char board[ROWS][COLS]) {
    printf("    A B C D E F G H I J\n");

    for (int row = 0; row < ROWS; row++) {
        printf("%2d  ", row + 1);
        for (int col = 0; col < COLS; col++) {
            printf("%c ", board[row][col]);
        }
        printf("\n");
    }
}

int main(void) {
    char board[ROWS][COLS];
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

    return 0;
}
