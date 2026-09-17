CC = gcc
CFLAGS = -Wall -Wextra -std=c11
TARGET = minesweeper
TEST_TARGET = minesweepertest
SOURCE = MinesweeperBoard.c

$(TARGET): $(SOURCE)
	$(CC) $(CFLAGS) $(SOURCE) -o $(TARGET)

$(TEST_TARGET): $(SOURCE)
	$(CC) $(CFLAGS) -DTEST_MODE $(SOURCE) -o $(TEST_TARGET)

test: $(TEST_TARGET)
	./$(TEST_TARGET)

clean:
	rm -f $(TARGET) $(TEST_TARGET) minesweeper.exe minesweepertest.exe

.PHONY: clean test