CC = gcc
CFLAGS = -Wall -Wextra -std=c11
TARGET = minesweeper
SOURCE = MinesweeperBoard.c

$(TARGET): $(SOURCE)
	$(CC) $(CFLAGS) $(SOURCE) -o $(TARGET)

clean:
	rm -f $(TARGET) minesweeper.exe

.PHONY: clean