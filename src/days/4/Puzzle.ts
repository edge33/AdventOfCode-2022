import Puzzle from '../../types/AbstractPuzzle';

const fullOverlap = (a: number, b: number, c: number, d: number) =>
  (c >= a && d <= b) || (a >= c && b <= d);

const partialOverlap = (a: number, b: number, c: number, d: number) =>
  (a >= c && a <= d) ||
  (b >= c && b <= d) ||
  (c >= a && c <= b) ||
  (d >= a && d <= b);

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    return this.input
      .split('\n')
      .map((line) =>
        line.split(',').map((pair) => pair.split('-').map((item) => +item))
      )
      .map(([[a, b], [c, d]]) => fullOverlap(a, b, c, d))
      .reduce((acc, next) => acc + (next ? 1 : 0), 0)
      .toString();
  }

  public getFirstExpectedResult(): string {
    return '556';
  }

  public solveSecond(): string {
    return this.input
      .split('\n')
      .map((line) =>
        line.split(',').map((pair) => pair.split('-').map((item) => +item))
      )
      .map(([[a, b], [c, d]]) => partialOverlap(a, b, c, d))
      .reduce((acc, next) => acc + (next ? 1 : 0), 0)
      .toString();
  }

  public getSecondExpectedResult(): string {
    return '876';
  }
}
