import Puzzle from '../../types/AbstractPuzzle';

const solve = (input: string) => {
  let x = 1;
  const cyclesToCheck = [20, 60, 100, 140, 180, 220];
  const program = input.split('\n').map((line) => line.split(' '));

  let cycles = 1;
  let instructionToProcess = program.shift();
  let pending = false;
  let cycleToMatch = cyclesToCheck.shift();
  const products = [];
  const output = [];
  let lastCyclePerRow = 40;
  let currentRow = [];
  while (instructionToProcess) {
    if ([x - 1, x, x + 1].includes(currentRow.length)) {
      currentRow.push('#');
    } else {
      currentRow.push('.');
    }

    if (cycles === cycleToMatch) {
      cycleToMatch = cyclesToCheck.shift();
      products.push(cycles * x);
    }
    if (cycles === lastCyclePerRow) {
      output.push(currentRow.join(''));

      currentRow = [];
      lastCyclePerRow = lastCyclePerRow + 40;
    }
    cycles++;

    const [instruction, value] = instructionToProcess;
    switch (instruction) {
      case 'noop': {
        instructionToProcess = program.shift();
        break;
      }
      case 'addx': {
        if (pending) {
          x += +value;
          pending = false;
          instructionToProcess = program.shift();
        } else {
          pending = true;
        }
        break;
      }
      default: {
        console.log('here', instructionToProcess);
        return '';
      }
    }
  }
  for (const line of output) {
    console.log(line);
  }

  return products.reduce((acc, next) => acc + next, 0).toString();
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    return solve(this.input);
  }

  public getFirstExpectedResult(): string {
    return '14340';
  }

  public solveSecond(): string {
    return solve(this.input);
  }

  public getSecondExpectedResult(): string {
    return '14340';
  }
}
