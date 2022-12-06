import { access } from 'fs';
import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    return this.input
      .split('\n')
      .map((l) => [l.slice(0, l.length / 2), l.slice(l.length / 2)])
      .map(
        ([a, b]) =>
          a
            .split('')
            .map((item) => (b.includes(item) ? item : null))
            .filter((i) => i !== null)[0]
      )
      .map((char) =>
        char === char.toUpperCase()
          ? char.toLowerCase().charCodeAt(0) - 70
          : char.charCodeAt(0) - 96
      )
      .reduce((acc, next) => acc + next, 0)
      .toString();
  }

  public getFirstExpectedResult(): string {
    return '7446';
  }

  public solveSecond(): string {
    return this.input
      .split('\n')
      .reduce((acc, next, index, array) => {
        if (index % 3 === 0) {
          acc.push(array.slice(index, index + 3));
        }
        return acc;
      }, [])
      .map(
        ([a, b, c]) =>
          a
            .split('')
            .map(
              (item: string) =>
                (b.includes(item) && c.includes(item) && item) || null
            )
            .filter((item: string) => item !== null)[0]
      )
      .map((char: string) =>
        char === char.toUpperCase()
          ? char.toLowerCase().charCodeAt(0) - 70
          : char.charCodeAt(0) - 96
      )
      .reduce((acc, next) => acc + next, 0)
      .toString();
  }

  public getSecondExpectedResult(): string {
    return '2646';
  }
}
