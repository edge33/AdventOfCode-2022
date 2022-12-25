import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const sum = this.input
      .split('\n')
      .map((snafuN) => {
        return snafuN
          .split('')
          .reverse()
          .reduce((acc, next, i) => {
            let digit = +next;
            if (next === '-') {
              digit = -1;
            } else if (next === '=') {
              digit = -2;
            }
            acc += digit * Math.pow(5, i);
            return acc;
          }, 0);
      })
      .reduce((acc, next) => acc + next, 0);

    const base5 = [];
    let result = sum;
    while (result !== 0) {
      base5.push(result % 5);
      result = Math.floor(result / 5);
    }
    // base5 = [3, 4, 3, 3, 4, 0];
    let added = false;
    let snafu = base5.reverse().reduceRight((acc, next, i, array) => {
      if (next > 4) {
        if (i - 1 < 0) {
          array.unshift(1);
        } else {
          array[i - 1] += 1;
        }
        next = 0;
      }

      if (next === 3) {
        acc = `=${acc}`;
        // if (i % 2 === 0) {
        if (i - 1 < 0) {
          array.unshift(1);
          added = true;
        } else {
          array[i - 1] += 1;
        }

        // }
      } else if (next === 4) {
        acc = `-${acc}`;
        if (i - 1 < 0) {
          added = true;
          array.unshift(1);
        } else {
          // if (i % 2 === 0) {
          array[i - 1] += 1;
        }
        // }
      } else {
        acc = `${next}${acc}`;
      }
      return acc;
    }, '');
    if (added) {
      const num = base5[0];
      if (num === 3) {
        snafu = `1=${snafu}`;
      } else if (num === 4) {
        snafu = `1-${snafu}`;
      } else {
        snafu = `${num}${snafu}`;
      }
    }

    return snafu;
  }

  public getFirstExpectedResult(): string {
    return '2-=0-=-2=111=220=100';
  }

  public solveSecond(): string {
    return '';
  }

  public getSecondExpectedResult(): string {
    return '';
  }
}
