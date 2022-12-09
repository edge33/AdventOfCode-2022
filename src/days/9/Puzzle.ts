import Puzzle from '../../types/AbstractPuzzle';

type Position = {
  x: number;
  y: number;
};

const isAdj = (a: Position, b: Position) => {
  for (let x = a.x - 1; x <= a.x + 1; x++) {
    for (let y = a.y - 1; y <= a.y + 1; y++) {
      if (b.x === x && b.y === y) {
        return true;
      }
    }
  }
};

const movePlanks = (n: number, input: string) => {
  const instructions = input.split('\n').map((l) => {
    const [direction, steps] = l.split(' ');
    let xIncrement = 0;
    let yIncrement = 0;
    switch (direction) {
      case 'U': {
        yIncrement = 1;
        break;
      }
      case 'R': {
        xIncrement = 1;
        break;
      }
      case 'D': {
        yIncrement = -1;
        break;
      }
      case 'L': {
        xIncrement = -1;
        break;
      }
    }
    return {
      increment: (position: Position) => {
        return {
          x: position.x + xIncrement,
          y: position.y + yIncrement,
        };
      },
      steps: +steps,
    };
  });

  /**
   * all the ropes are in the array,
   * first one is the head
   * last one is the tail
   */
  const ropesPositions = new Array(n).fill(0).map((_) => ({ x: 0, y: 0 }));
  const visited = new Set();
  visited.add(
    `${ropesPositions[ropesPositions.length - 1].x}-${
      ropesPositions[ropesPositions.length - 1].y
    }`
  );
  for (const instr of instructions) {
    const steps = instr.steps;
    for (let i = 0; i < steps; i++) {
      ropesPositions[0] = instr.increment(ropesPositions[0]);
      for (let k = 1; k < ropesPositions.length; k++) {
        const head = ropesPositions[k - 1];
        const tail = ropesPositions[k];
        if (!isAdj(head, tail)) {
          if (head.x === tail.x) {
            /** check same col */
            if (head.y > tail.y) {
              tail.y = tail.y + 1;
            } else {
              tail.y = tail.y - 1;
            }
          } else if (head.y === tail.y) {
            /** check same row */
            if (head.x > tail.x) {
              tail.x = tail.x + 1;
            } else {
              tail.x = tail.x - 1;
            }
          } else if (head.x !== tail.x && head.y !== tail.y) {
            /** check if head moved diagonally */
            if (head.y > tail.y) {
              tail.y = tail.y + 1;
            } else {
              tail.y = tail.y - 1;
            }
            if (head.x > tail.x) {
              tail.x = tail.x + 1;
            } else {
              tail.x = tail.x - 1;
            }
          }
          /** if the last tail moved I want to track it */
          if (k === ropesPositions.length - 1) {
            visited.add(`${tail.x}-${tail.y}`);
          }
        }
      }
    }
  }
  return visited.size;
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    return movePlanks(2, this.input).toString();
  }

  public getFirstExpectedResult(): string {
    return '6243';
  }

  public solveSecond(): string {
    return movePlanks(10, this.input).toString();
  }

  public getSecondExpectedResult(): string {
    return '2630';
  }
}
