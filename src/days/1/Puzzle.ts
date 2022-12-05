import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    return this.input
      .split('\n\n')
      .map((g) =>
        g
          .split('\n')
          .map((n) => +n)
          .reduce((acc, next) => acc + next, 0)
      )
      .sort((a, b) => (a > b ? -1 : 1))[0]
      .toString();
  }
  public solveSecond(): string {
    const results = this.input
      .split('\n\n')
      .map((g) =>
        g
          .split('\n')
          .map((n) => +n)
          .reduce((acc, next) => acc + next, 0)
      )
      .sort((a, b) => (a > b ? -1 : 1));
    return (results[0] + results[1] + results[2]).toString();
  }

  public getFirstExpectedResult(): string {
    return '72240';
  }
  public getSecondExpectedResult(): string {
    return '210957';
  }
}
