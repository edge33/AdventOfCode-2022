import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const data = this.input;
    for (let i = 3; i < data.length; i++) {
      const map = new Map();
      map.set(data[i], '');
      if (!map.has(data[i - 1])) {
        map.set(data[i - 1], '');
      } else {
        continue;
      }

      if (!map.has(data[i - 2])) {
        map.set(data[i - 2], '');
      } else {
        continue;
      }
      if (!map.has(data[i - 3])) {
        map.set(data[i - 3], '');
      } else {
        continue;
      }
      return (i + 1).toString();
    }
    return '';
  }

  public getFirstExpectedResult(): string {
    return '1531';
  }

  public solveSecond(): string {
    const data = this.input;
    for (let i = 14; i < data.length; i++) {
      const map = new Map();
      map.set(data[i], '');

      let invalid = false;
      for (let k = i - 1; k > i - 14; k--) {
        if (!map.has(data[k])) {
          map.set(data[k], '');
        } else {
          invalid = true;
          break;
        }
      }
      if (invalid) {
        continue;
      } else {
        return (i + 1).toString();
      }
    }
    return '';
  }

  public getSecondExpectedResult(): string {
    return '2518';
  }
}
