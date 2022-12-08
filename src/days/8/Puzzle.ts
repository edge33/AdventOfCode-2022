import Puzzle from '../../types/AbstractPuzzle';

const getVisibilityAndVisibleTrees = (
  data: number[][],
  i: number,
  j: number,
  iIncrement = 0,
  jIncrement = 0
) => {
  let targetI = i + iIncrement;
  let targetJ = j + jIncrement;
  const currentValue = data[i][j];
  let visibleTrees = 0;
  while (data[targetI] && data[targetI][targetJ] !== undefined) {
    const target = data[targetI][targetJ];
    visibleTrees++;
    if (target >= currentValue) {
      return { visible: false, visibleTrees: visibleTrees };
    }

    targetI += iIncrement;
    targetJ += jIncrement;
  }
  return { visible: true, visibleTrees: visibleTrees };
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const data = this.input.split('\n').map((l) => l.split('').map((c) => +c));
    let totalVisibile = data.length * 4 - 4;
    for (let i = 1; i < data.length - 1; i++) {
      for (let j = 1; j < data[i].length - 1; j++) {
        const visible = [
          getVisibilityAndVisibleTrees(data, i, j, 1, 0).visible,
          getVisibilityAndVisibleTrees(data, i, j, -1, 0).visible,
          getVisibilityAndVisibleTrees(data, i, j, 0, 1).visible,
          getVisibilityAndVisibleTrees(data, i, j, 0, -1).visible,
        ];
        if (visible.filter((i) => i).length > 0) {
          totalVisibile = totalVisibile + 1;
        }
      }
    }

    return totalVisibile.toString();
  }

  public getFirstExpectedResult(): string {
    return '1849';
  }

  public solveSecond(): string {
    const data = this.input.split('\n').map((l) => l.split('').map((c) => +c));
    let maxScenicScore = 0;
    for (let i = 1; i < data.length - 1; i++) {
      for (let j = 1; j < data[i].length - 1; j++) {
        const scores = [
          getVisibilityAndVisibleTrees(data, i, j, 1, 0).visibleTrees,
          getVisibilityAndVisibleTrees(data, i, j, -1, 0).visibleTrees,
          getVisibilityAndVisibleTrees(data, i, j, 0, 1).visibleTrees,
          getVisibilityAndVisibleTrees(data, i, j, 0, -1).visibleTrees,
        ];
        const scenicScore = scores.reduce((acc, next) => acc * next, 1);
        if (scenicScore > maxScenicScore) {
          maxScenicScore = scenicScore;
        }
      }
    }

    return maxScenicScore.toString();
  }

  public getSecondExpectedResult(): string {
    return '201600';
  }
}
