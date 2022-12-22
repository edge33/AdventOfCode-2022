/**
 *  partially based on https://github.com/doingthisalright/AdventOfCode2022/blob/e4767c8909195ffc50114c7ea511d0dcfd1bcf2c/Day22/solution.js
 */
import Puzzle from '../../types/AbstractPuzzle';

let parsedBoard: string[][];
let maxRows: number;
let maxCols: number;

let currentRow = 0;
let currentCol = 0;
let currentDirection = 'R';

let currentRowCursor = 0;
let currentColCursor = 0;
let currentDirectionCursor = 'R';

let directionsParsed: string[];

const findStartingPosition = () => {
  currentRow = 0;
  currentCol = 0;
  while (parsedBoard[currentRow][currentCol] != '.') {
    currentCol++;
  }
  currentRowCursor = currentRow;
  currentColCursor = currentCol;
};

const putCursorInBounds = () => {
  if (currentRowCursor > maxRows - 1) {
    currentRowCursor = 0;
  }
  if (currentRowCursor < 0) {
    currentRowCursor = maxRows - 1;
  }
  if (currentColCursor > maxCols - 1) {
    currentColCursor = 0;
  }
  if (currentColCursor < 0) {
    currentColCursor = maxCols - 1;
  }
};

const moveCursorToNextPosition = () => {
  currentDirectionCursor = currentDirection;

  do {
    switch (currentDirectionCursor) {
      case 'T':
        currentRowCursor--;
        break;
      case 'R':
        currentColCursor++;
        break;
      case 'D':
        currentRowCursor++;
        break;
      case 'L':
        currentColCursor--;
        break;
    }
    putCursorInBounds();
  } while (parsedBoard[currentRowCursor][currentColCursor] == ' ');
};

const getDirectionNum = () => {
  if (currentDirection === 'R') {
    return 0;
  }
  if (currentDirection === 'D') {
    return 1;
  }
  if (currentDirection === 'L') {
    return 2;
  }
  if (currentDirection === 'T') {
    return 3;
  }
  return null;
};
const getResult = () => {
  return 1000 * (currentRow + 1) + 4 * (currentCol + 1) + getDirectionNum();
};

const moveCursorToNextNonEmptyPositionInCube = () => {
  currentDirectionCursor = currentDirection;

  do {
    moveCursorToNextPositionInCube();
  } while (parsedBoard[currentRowCursor][currentColCursor] == ' ');
};

const moveCursorToNextPositionInCube = () => {
  let finalRow = currentRowCursor;
  let finalCol = currentColCursor;
  let finalDir = currentDirectionCursor;

  const row = currentRowCursor;
  const col = currentColCursor;

  if (0 <= row && row <= 49 && 50 <= col && col <= 99) {
    /*
            Face1
            0-49
            50-99
                row 0, col 50-99 -> up -> Face 6, row 150-199 col 0
                row 0-49, col 50 -> left -> Face 5, row 149-100 col 0
        */
    if (currentDirectionCursor == 'T' && row == 0) {
      finalRow = 150 + (col - 50);
      finalCol = 0;
      finalDir = 'R';
    } else if (currentDirectionCursor == 'L' && col == 50) {
      finalRow = 149 - (row - 0);
      finalCol = 0;
      finalDir = 'R';
    }
  } else if (0 <= row && row <= 49 && 100 <= col && col <= 149) {
    /*
            Face2
            0-49
            100-149
                row 0-49, col 100 -> top -> Face 6, row 199, col 0-49
                row 0-49, col 149 -> right -> Face 4, row 149-100, col99
                row 49, col 100-149 -> down -> Face 3, row 50-99, col99
        */
    if (currentDirectionCursor == 'T' && row == 0) {
      finalRow = 199;
      finalCol = 0 + (col - 100);
      finalDir = 'T';
    } else if (currentDirectionCursor == 'R' && col == 149) {
      finalRow = 149 - (row - 0);
      finalCol = 99;
      finalDir = 'L';
    } else if (currentDirectionCursor == 'D' && row == 49) {
      finalRow = 50 + (col - 100);
      finalCol = 99;
      finalDir = 'L';
    }
  } else if (50 <= row && row <= 99 && 50 <= col && col <= 99) {
    /*
            VER
            Face3
            50-99
            50-99
                row 50-99, col 50 -> left -> Face 5, row 100, col 0-49
                row 50-99, col 99 -> right -> Face 2, row 49, col 100-149
        */
    if (currentDirectionCursor == 'L' && col == 50) {
      finalRow = 100;
      finalCol = 0 + (row - 50);
      finalDir = 'D';
    } else if (currentDirectionCursor == 'R' && col == 99) {
      finalRow = 49;
      finalCol = 100 + (row - 50);
      finalDir = 'T';
    }
  } else if (100 <= row && row <= 149 && 50 <= col && col <= 99) {
    /*
            Face4
            100-149
            50-99
                row 100-149, col99 -> right -> Face 2, row 49-0, col 149
                row 149, col50-99 -> down -> Face 6, row 150-199, col 49
        */
    if (currentDirectionCursor == 'R' && col == 99) {
      finalRow = 49 - (row - 100);
      finalCol = 149;
      finalDir = 'L';
    } else if (currentDirectionCursor == 'D' && row == 149) {
      finalRow = 150 + (col - 50);
      finalCol = 49;
      finalDir = 'L';
    }
  } else if (100 <= row && row <= 149 && 0 <= col && col <= 49) {
    /*
            Face5
            100-149
            0-49
                row 100-149 col 0 -> left -> Face 1 row 49-0, col 50
                row 100, col 0-49 -> up -> Face 3 row 50-99, col 50
        */
    if (currentDirectionCursor == 'L' && col == 0) {
      finalRow = 49 - (row - 100);
      finalCol = 50;
      finalDir = 'R';
    } else if (currentDirectionCursor == 'T' && row == 100) {
      finalRow = 50 + (col - 0);
      finalCol = 50;
      finalDir = 'R';
    }
  } else if (150 <= row && row <= 199 && 0 <= col && col <= 49) {
    /*
            Face6
            150-199
            0-49
                row 150-199 col 0 -> left -> Face 1, row 0, col 50-99
                row 199, col 0-49 -> down -> Face2, row 0-49, col 100
                row 150-199, col 49 -> right -> Face 4, row 149, col 50-99 
        */
    if (currentDirectionCursor == 'L' && col == 0) {
      finalRow = 0;
      finalCol = 50 + (row - 150);
      finalDir = 'D';
    } else if (currentDirectionCursor == 'D' && row == 199) {
      finalRow = 0;
      finalCol = 100 + (col - 0);
      finalDir = 'D';
    } else if (currentDirectionCursor == 'R' && col == 49) {
      finalRow = 149;
      finalCol = 50 + (row - 150);
      finalDir = 'T';
    }
  }

  if (row === finalRow && col === finalCol) {
    switch (currentDirectionCursor) {
      case 'T':
        currentRowCursor--;
        break;
      case 'R':
        currentColCursor++;
        break;
      case 'D':
        currentRowCursor++;
        break;
      case 'L':
        currentColCursor--;
        break;
    }
  } else {
    currentRowCursor = finalRow;
    currentColCursor = finalCol;
    currentDirectionCursor = finalDir;
  }
};

const solve = (movingFunction: () => void) => {
  findStartingPosition();
  for (const direction of directionsParsed) {
    if (direction == 'L') {
      switch (currentDirection) {
        case 'T':
          currentDirection = 'L';
          break;
        case 'R':
          currentDirection = 'T';
          break;
        case 'D':
          currentDirection = 'R';
          break;
        case 'L':
          currentDirection = 'D';
          break;
      }
    } else if (direction == 'R') {
      switch (currentDirection) {
        case 'T':
          currentDirection = 'R';
          break;
        case 'R':
          currentDirection = 'D';
          break;
        case 'D':
          currentDirection = 'L';
          break;
        case 'L':
          currentDirection = 'T';
          break;
      }
    } else {
      let steps = +direction;
      while (steps > 0) {
        movingFunction();
        if (parsedBoard[currentRowCursor][currentColCursor] === '#') {
          currentRowCursor = currentRow;
          currentColCursor = currentCol;
          currentDirectionCursor = currentDirection;
          break;
        } else {
          currentRow = currentRowCursor;
          currentCol = currentColCursor;
          currentDirection = currentDirectionCursor;
          steps--;
        }
      }
    }
  }

  return getResult().toString();
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const [rawBoard, directions] = this.input.split('\n\n');
    parsedBoard = rawBoard.split('\n').map((row) => row.split(''));
    directionsParsed = directions.match(/(\d+)|(L|R)/g);
    maxRows = parsedBoard.length;
    maxCols = parsedBoard[0].length;
    for (let i = 1; i < parsedBoard.length; i++) {
      const row = parsedBoard[i];
      if (row.length < parsedBoard[0].length) {
        parsedBoard[i] = [
          ...row,
          ...new Array(parsedBoard[0].length - row.length).fill(' '),
        ];
      }
    }
    return solve(moveCursorToNextPosition);
  }

  public getFirstExpectedResult(): string {
    return '189140';
  }

  public solveSecond(): string {
    const [rawBoard, directions] = this.input.split('\n\n');
    parsedBoard = rawBoard.split('\n').map((row) => row.split(''));
    directionsParsed = directions.match(/(\d+)|(L|R)/g);
    maxRows = parsedBoard.length;
    maxCols = parsedBoard[0].length;
    return solve(moveCursorToNextNonEmptyPositionInCube);
  }

  public getSecondExpectedResult(): string {
    return '115063';
  }
}
