import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const state = new Map<string, number>();
    let maxDepth = 0;
    this.input
      .split('\n')
      .map((l) => l.match(/\d+,\d+/g))
      .map((path) => {
        for (let i = 0; i < path.length - 1; i++) {
          const [xStart, yStart] = path[i].split(',').map((s) => +s);
          const [xEnd, yEnd] = path[i + 1].split(',').map((s) => +s);
          const xIncrement = xStart === xEnd ? 0 : xStart > xEnd ? -1 : 1;
          if (xIncrement !== 0) {
            let start = xStart;
            while (start !== xEnd) {
              state.set(`${start}-${yStart}`, 1);
              start += xIncrement;
            }
            state.set(`${start}-${yStart}`, 1);
          }

          const yIncrement = yStart === yEnd ? 0 : yStart > yEnd ? -1 : 1;
          if (yIncrement !== 0) {
            let start = yStart;
            while (start !== yEnd) {
              state.set(`${xStart}-${start}`, 1);
              start += yIncrement;
            }
            state.set(`${xStart}-${start}`, 1);
          }

          if (yEnd > maxDepth) {
            maxDepth = yEnd;
          }
        }
      });

    const pouringPositionStart = 500;
    let stillPouring = true;
    let counter = 0;
    while (stillPouring) {
      const [x, y] = [pouringPositionStart, 0];
      let yTarget = y + 1;
      let xTarget = x;
      let dropping = stillPouring;
      while (dropping) {
        // if falling off, just exit
        if (yTarget > maxDepth) {
          stillPouring = false;
          break;
        }
        // if can go down
        if (!state.get(`${xTarget}-${yTarget}`)) {
          yTarget += 1;
        } else if (!state.get(`${xTarget - 1}-${yTarget}`)) {
          // can go left down
          xTarget -= 1;
        } else if (!state.get(`${xTarget + 1}-${yTarget}`)) {
          // can go right down
          xTarget += 1;
        } else {
          state.set(`${xTarget}-${yTarget - 1}`, 1);
          dropping = false;
          counter++;
        }
      }
    }

    // console.log(state);
    // console.log('max', maxDepth);

    return counter.toString();
  }

  public getFirstExpectedResult(): string {
    return '888';
  }

  public solveSecond(): string {
    const state = new Map<string, number>();
    let maxDepth = 0;
    this.input
      .split('\n')
      .map((l) => l.match(/\d+,\d+/g))
      .map((path) => {
        for (let i = 0; i < path.length - 1; i++) {
          const [xStart, yStart] = path[i].split(',').map((s) => +s);
          const [xEnd, yEnd] = path[i + 1].split(',').map((s) => +s);
          const xIncrement = xStart === xEnd ? 0 : xStart > xEnd ? -1 : 1;
          if (xIncrement !== 0) {
            let start = xStart;
            while (start !== xEnd) {
              state.set(`${start}-${yStart}`, 1);
              start += xIncrement;
            }
            state.set(`${start}-${yStart}`, 1);
          }

          const yIncrement = yStart === yEnd ? 0 : yStart > yEnd ? -1 : 1;
          if (yIncrement !== 0) {
            let start = yStart;
            while (start !== yEnd) {
              state.set(`${xStart}-${start}`, 1);
              start += yIncrement;
            }
            state.set(`${xStart}-${start}`, 1);
          }

          if (yEnd > maxDepth) {
            maxDepth = yEnd;
          }
        }
      });

    const pouringPositionStart = 500;
    let counter = 0;
    while (true) {
      const [x, y] = [pouringPositionStart, 0];
      let yTarget = y;
      let xTarget = x;
      let dropping = true;
      while (dropping) {
        // if touched base
        if (yTarget === maxDepth + 2) {
          state.set(`${xTarget}-${yTarget - 1}`, 1);
          counter++;
          break;
        }
        // if can go down
        if (!state.get(`${xTarget}-${yTarget}`)) {
          yTarget += 1;
        } else if (!state.get(`${xTarget - 1}-${yTarget}`)) {
          // can go left down
          xTarget -= 1;
        } else if (!state.get(`${xTarget + 1}-${yTarget}`)) {
          // can go right down
          xTarget += 1;
        } else {
          state.set(`${xTarget}-${yTarget - 1}`, 1);
          if (xTarget === 500 && yTarget - 1 === 0) {
            return (1 + counter).toString();
          }
          dropping = false;
          counter++;
        }
      }
    }

    // console.log(state);
    // console.log('max', maxDepth);

    return counter.toString();
  }

  public getSecondExpectedResult(): string {
    return '26461';
  }
}
