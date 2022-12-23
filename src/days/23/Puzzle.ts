import { run } from 'node:test';
import Puzzle from '../../types/AbstractPuzzle';

const isAnElf = (element: string) => element === '#';
const buildKey = (i: number, j: number) => `${i}-${j}`;
const hasFreeSlot = (
  state: string[][],
  newI: number,
  newJ: number,
  direction: number[]
) => {
  const direction_ = direction.join(',');
  switch (direction_) {
    case '-1,0':
    case '1,0':
      // NORTH
      // SOUTH
      for (let j = newJ - 1; j <= newJ + 1; j++) {
        if (isAnElf(state[newI][j])) {
          return false;
        }
      }
      break;
    case '0,-1':
    case '0,1':
      // EAST
      // WEST
      for (let i = newI - 1; i <= newI + 1; i++) {
        if (isAnElf(state[i][newJ])) {
          return false;
        }
      }
      break;
    default: {
      throw new Error('unexpected direction');
    }
  }
  return true;
};

const canMove = (state: string[][], row: number, col: number) => {
  let adjsCount = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i === row && j === col) {
        continue;
      }
      if (isAnElf(state[i][j])) {
        adjsCount++;
      }
    }
  }
  return adjsCount > 0;
};

const display = (state: string[][]) => {
  for (let i = 0; i < state.length; i++) {
    console.log(state[i].join(''));
  }
  console.log();
};

const simulate = (input: string, rounds?: number) => {
  let state: string[][] = [];
  const padding = 50;
  input.split('\n').forEach((r, i) => {
    state[i] = [
      ...new Array(padding).fill('.'),
      ...r.split(''),
      ...new Array(padding).fill('.'),
    ];
  });

  const length = state[0].length;
  state = [
    ...new Array(padding).fill(1).map((x) => new Array(length).fill('.')),
    ...state,
    ...new Array(padding).fill(1).map((x) => new Array(length).fill('.')),
  ];

  /**
   * for each elf check if can go to new direction
   * store in a map key: target -> elf
   * if an elf wants to go to target and target alredy marked then delete entry and don't move elf
   */
  const directions = [
    [0, 1], // EAST
    [-1, 0], // NORTH
    [1, 0], // SOUTH
    [0, -1], // WEST
  ];

  let running = true;
  let counter = 1;
  while (running) {
    const elvesToMove = new Map<string, number[][]>();
    // move first direction to bottom
    const tmp = directions.shift();
    directions.push(tmp);
    for (let i = 0; i < state.length; i++) {
      for (let j = 0; j < state[i].length; j++) {
        const element = state[i][j];

        if (isAnElf(element)) {
          if (canMove(state, i, j)) {
            for (const currentDirection of directions) {
              const target = [i + currentDirection[0], j + currentDirection[1]];
              const [newI, newJ] = target;
              if (hasFreeSlot(state, newI, newJ, currentDirection)) {
                if (elvesToMove.has(buildKey(newI, newJ))) {
                  elvesToMove.get(buildKey(newI, newJ)).push([i, j]);
                  break;
                } else {
                  elvesToMove.set(buildKey(newI, newJ), [[i, j]]);
                  break;
                }
              }
            }
          }

          // console.log(i, j, 'can move');
        }
      }
    }

    const entries = Array.from(elvesToMove.entries());
    let moved = false;
    for (const [to, from] of entries) {
      if (from.length === 1) {
        const [newI, newJ] = to.split('-').map(Number);
        const [i, j] = from[0];
        state[i][j] = '.';
        state[newI][newJ] = '#';
        moved = true;
      }
    }
    if (rounds !== undefined) {
      rounds--;
      if (rounds === 0) {
        running = false;
      }
    } else {
      if (!moved) {
        return counter.toString();
      }
    }
    counter++;
  }

  /** get min and max positions */
  let minElfRow = 500000;
  let minElfCol = 500000;
  let maxElfRow = 0;
  let maxElfCol = 0;

  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[i].length; j++) {
      if (isAnElf(state[i][j])) {
        minElfRow = Math.min(minElfRow, i);
        minElfCol = Math.min(minElfCol, j);
        maxElfRow = Math.max(maxElfRow, i);
        maxElfCol = Math.max(maxElfCol, j);
      }
    }
  }

  let freeSpaceCount = 0;
  for (let i = minElfRow; i <= maxElfRow; i++) {
    // console.log(state[i].join(''));
    for (let j = minElfCol; j <= maxElfCol; j++) {
      if (state[i][j] === '.') {
        freeSpaceCount++;
      }
    }
  }

  // WRITE SOLUTION FOR TEST 1
  return freeSpaceCount.toString();
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    return simulate(this.input, 10);
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return 'day 1 solution 1';
  }

  public solveSecond(): string {
    return simulate(this.input);
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return 'day 1 solution 2';
  }
}
