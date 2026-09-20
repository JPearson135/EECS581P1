CC = gcc
CFLAGS = -Wall -Wextra -std=c11
TARGET = minesweeper
TEST_TARGET = minesweepertest
SOURCE = MinesweeperBoard.c

.DEFAULT_GOAL := web

$(TARGET): $(SOURCE)
	$(CC) $(CFLAGS) $(SOURCE) -o $(TARGET)

$(TEST_TARGET): $(SOURCE)
	$(CC) $(CFLAGS) -DTEST_MODE $(SOURCE) -o $(TEST_TARGET)

test: $(TEST_TARGET)
	./$(TEST_TARGET)

web:
ifeq ($(WSL_DISTRO_NAME),)
	start "" index.html
else
	explorer.exe "$(shell wslpath -w "$(CURDIR)/index.html")"
endif

run: web

clean:
	rm -f $(TARGET) $(TEST_TARGET) minesweeper.exe minesweepertest.exe

.PHONY: clean test web run