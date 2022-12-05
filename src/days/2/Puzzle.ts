import Puzzle from '../../types/AbstractPuzzle';

const mapChar = (char: string): number => {
  switch (char) {
    case 'A':
    case 'X':
      return 0;
    case 'B':
    case 'Y':
      return 1;
    case 'C':
    case 'Z':
      return 2;
  }
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const data = this.input
      .split('\n')
      .map((line) => line.split(' ').map(mapChar))
      .reduce((acc, [a, b]) => {
        let winScore = 0;
        if (a === b) {
          winScore = 3;
        }
        if ((a + 1) % 3 === b) {
          winScore = 6;
        }
        return acc + b + winScore + 1;
      }, 0);
    return data.toString();
  }

  public getFirstExpectedResult(): string {
    return '9177';
  }

  public solveSecond(): string {
    const data = this.input
      .split('\n')
      .map((line) => line.split(' ').map(mapChar))
      .reduce((acc, [a, b]) => {
        let winScore = 0;
        let draw = (((a - 1) % 3) + 3) % 3;

        if (b === 1) {
          winScore = 3;
          draw = a;
        }
        if (b === 2) {
          draw = (a + 1) % 3;
          winScore = 6;
        }
        return acc + draw + 1 + winScore;
      }, 0);
    return data.toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return 'day 1 solution 2';
  }
}
