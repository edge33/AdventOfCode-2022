/**
 * thanks to https://topaz.github.io/paste/#XQAAAQCPFwAAAAAAAAA0m0pnuFI8dAwoq5Hhug5BKdUzT9pBUn273JrE6aRtnvvJ+3fFRTrSbPQG4NWX0ZtWvnueiT3uHqNOpW0yP3u7H9zQwXEDIUwu8nGP7mOsNJ8VflYP4QcrWy9I7F36LCeyWwBuuJ4zWdHKvQ91J19M+r8RogIV6MMOX3em5Eqa2ClgVtsxgqFwyx/w/u9XQHhXxDwcmXBXQrQ+GJLd+SSoCriG7rLLT2cNN5mRrrWOr2qXUHQ7NF+Ue9G8cfh2DRK5bAhKVG7LN4hey6QqB6gi5c8IlGpCbOSB3520uZwmP1dq5c0uv7R9qQFn6D+x0ILDnNIffZd8m/9XvDeAZ5bBajy0Iklvun1Qx27cFiUUnk7xN8mxhT4RR8GHSrKRCVrYGWgD14G432nNjUhbEg93CWVKn++XJyID6zvY9XJnNDbfy5iyfRc/ZayPR6XmBwsGeUrkW/vo7t2ORTwxADJU37Ta4keXjRbvbW+gjRqGOCZzoYMytCk2k1DVuOHo9+AwcsCg00vBib4E/WYkL/aTmHtbQ0/tWCGrU+oLnIXoBl/pDqqwnv9tYbl10Y/zZsdHlYp1iIBfbRQYJ4Imklsgmu88gNB4am3KvE8XG2yfBKz1Z2WPPf2NRRn8SjQ4YHwGZwMWrp5uyeBrT8aviZZfOkmkELmntGOxRKc7wXtxAbqUiWu76jyY7Pnb9t73rvwUeEgpd6I1tAUVjHxFuf0TP0fRfw009MHUJjaqOYK91/ncbdazt7hxNe167WRNtdTN7Wk9/Ouf+na7DNstabuYAPBsXgtB8aZ6LRr3hbWZLKDgeF2mDtQBA8WjoRmrpgCIR9hQL8qxrU0ipCk97Snczk4Igl+9jpUwvO4Un+IFN/A1QTf1y/ZZto4pZnwnJUkixC+GLC6jY+sSX0DRpp7znjxd/Annje+UaHJ4qRkuf9x94jCyxYHp3Rlc0oPPGsl8f2gza5QVfpZSXi2K7RzXlNtPhKks3tkP0aEZFepGYTGYkgDw0PT5J5LBPTs2bQBqk4BFhMGtWqeJRexudscvOOV8DauQXyu8oI21BaevmjO8T9f0BdlPcjmDp3dD6useLLzmZlyeqWWqglYIvXxI7BpO8OBwq810HbkxW4sduE7VGwZATy39k/eF5zsoDfY1NGmO7spkzQTVcUfJKKqvpUqt9ydUS/bRzwToDqsP4trUPLakVwADa2Dk7qFQQw99SjY37Kp73W/545YLm5gtH8V5kwGXjwK7LjLlyyIVdpBGbm5fTiw++8HrHQVLmcUoSSlHbaTAOkCXBTzZW3UxqBlum5mH07/FuMS87HrFowR1myw00nw0OS1/IiF8xPX2ZjRW4OBe/qL09mtZr6Jr8gERl+9+oDOqNXCRKrLGwIWzDtFzVJM3s1TTZ9IXyLhx8QPEDnH8K25E6/XfRlTNTBVkcwo4Z9wpZ3HukizbjYnidhfqFcSF+DdgVnph8vn7mC6/wvt0jrHvvx6nLiaVWNTEWAEM+PzQKOr/IUU/N1Of//618O5eJCNt944y1vnxSi65mnpu+q3SimEmbwb9W/nOE/VIfh3EN+7lNA6OzfaD22eaCNVdxCBM/jrr/15kcJbLjnf4BCaAUY2NtF6BOe/q8CROR8LHLM7fXn+/ssYX4YZOdY24sTfLc2TtKT9FH5w9CQq5scA+S9fwF2OQ9aCThqaY8VARkc2ZWlZcSFlx/2DliH4bvRKCqSmjMBuN5Mw2k/F7+ICo9poZy/BXFeAgwPn8+p/I
 */

import Puzzle from '../../types/AbstractPuzzle';
// flag enum
enum Blizzard {
  Nothing = 0,
  Up = 1,
  Left = 2,
  Down = 4,
  Right = 8,
}

interface Position {
  row: number;
  column: number;
}

class Grid {
  grid: Blizzard[][] = [];
  constructor(lines: string[]) {
    for (let row = 1; row < lines.length - 1; row++) {
      const rowArray: Blizzard[] = [];
      this.grid.push(rowArray);
      for (let column = 1; column < lines[row].length - 1; column++) {
        const letter = lines[row][column];
        let blizzardNode: Blizzard = Blizzard.Nothing;
        switch (letter) {
          case '.':
            break;
          case '>':
            blizzardNode = Blizzard.Right;
            break;
          case '<':
            blizzardNode = Blizzard.Left;
            break;
          case '^':
            blizzardNode = Blizzard.Up;
            break;
          case 'v':
            blizzardNode = Blizzard.Down;
            break;
          default:
            throw new Error("we shouldn't get here");
        }

        rowArray.push(blizzardNode);
      }
    }
  }

  nextMinute = () => {
    const newGrid: Blizzard[][] = [];
    for (let row = 0; row < this.grid.length; row++) {
      newGrid.push(new Array(this.grid[row].length).fill(Blizzard.Nothing));
    }
    for (let row = 0; row < this.grid.length; row++) {
      for (let column = 0; column < this.grid[0].length; column++) {
        const blizzardFlag = this.grid[row][column];
        if (blizzardFlag !== Blizzard.Nothing) {
          if (blizzardFlag & Blizzard.Left) {
            const newColumn =
              (column - 1 + this.grid[0].length) % this.grid[0].length;
            newGrid[row][newColumn] |= Blizzard.Left;
          }
          if (blizzardFlag & Blizzard.Up) {
            const newRow = (row - 1 + this.grid.length) % this.grid.length;
            newGrid[newRow][column] |= Blizzard.Up;
          }
          if (blizzardFlag & Blizzard.Down) {
            const newRow = (row + 1) % this.grid.length;
            newGrid[newRow][column] |= Blizzard.Down;
          }
          if (blizzardFlag & Blizzard.Right) {
            const newColumn = (column + 1) % this.grid[0].length;
            newGrid[row][newColumn] |= Blizzard.Right;
          }
        }
      }
    }
    this.grid = newGrid;
  };

  toKey = (position: Position) =>
    `${String(position.row)},${String(position.column)}`;

  minutes = 0;
  minutesGo = () => {
    let queue: Position[] = [];
    while (true) {
      this.minutes++;
      this.nextMinute();
      if (this.grid[0][0] === Blizzard.Nothing) {
        queue.push({ row: 0, column: 0 });
      }

      const newQueue: Position[] = [];
      const visited = new Set<string>();
      for (const entry of queue) {
        if (visited.has(this.toKey(entry))) {
          continue;
        }
        if (
          entry.row === this.grid.length - 1 &&
          entry.column === this.grid[0].length - 1
        ) {
          return this.minutes;
        }
        newQueue.push(...this.iterateMinute(entry));
        visited.add(this.toKey(entry));
      }
      queue = newQueue;
    }
  };

  minutesReturn = () => {
    let queue: Position[] = [];
    const endRow = this.grid.length - 1;
    const endColumn = this.grid[0].length - 1;
    while (true) {
      this.minutes++;
      this.nextMinute();
      if (this.grid[endRow][endColumn] === Blizzard.Nothing) {
        queue.push({ row: endRow, column: endColumn });
      }

      const newQueue: Position[] = [];
      const visited = new Set<string>();
      for (const entry of queue) {
        if (visited.has(this.toKey(entry))) {
          continue;
        }
        if (entry.row === 0 && entry.column === 0) {
          return this.minutes;
        }
        newQueue.push(...this.iterateMinute(entry));
        visited.add(this.toKey(entry));
      }
      queue = newQueue;
    }
  };

  iterateMinute = (position: Position) => {
    const up = position.row - 1;
    const down = position.row + 1;
    const left = position.column - 1;
    const right = position.column + 1;
    const result: Position[] = [];
    if (this.grid[position.row][position.column] === Blizzard.Nothing) {
      result.push(position);
    }
    if (up >= 0 && this.grid[up][position.column] === Blizzard.Nothing) {
      result.push({ row: up, column: position.column });
    }
    if (
      down < this.grid.length &&
      this.grid[down][position.column] === Blizzard.Nothing
    ) {
      result.push({ row: down, column: position.column });
    }
    if (left >= 0 && this.grid[position.row][left] === Blizzard.Nothing) {
      result.push({ row: position.row, column: left });
    }
    if (
      right < this.grid[0].length &&
      this.grid[position.row][right] === Blizzard.Nothing
    ) {
      result.push({ row: position.row, column: right });
    }
    return result;
  };
}

function solution(grid: Grid) {
  const part1 = grid.minutesGo();
  grid.minutesReturn();
  const part2 = grid.minutesGo();
  return { part1, part2 };
}

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const lines = this.input.split(/\r?\n/);
    const grid = new Grid(lines);
    return solution(grid).part1.toString();
  }

  public getFirstExpectedResult(): string {
    return '245';
  }

  public solveSecond(): string {
    const lines = this.input.split(/\r?\n/);
    const grid = new Grid(lines);
    return solution(grid).part2.toString();
  }

  public getSecondExpectedResult(): string {
    return '798';
  }
}
