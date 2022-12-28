import Puzzle from '../../types/AbstractPuzzle';

type State = {
  position: number[];
  cost: number;
};

type Blizzard = {
  i: number;
  j: number;
  direction: string;
};

const isBlizzard = (element: string[]) =>
  element.some((e) => ['^', 'v', '<', '>'].includes(e));

const moveBlizzard = (
  blizzards: string[],
  i: number,
  j: number,
  rows: number,
  cols: number
): Blizzard[] => {
  return blizzards.map((blizzard) => {
    const direction = blizzard;
    switch (direction) {
      case '^':
        if (i - 1 === 0) {
          return { i: rows - 2, j, direction };
        } else {
          return { i: i - 1, j, direction };
        }

      case 'v':
        if (i + 1 === rows - 1) {
          return { i: 1, j, direction };
        } else {
          return { i: i + 1, j, direction };
        }

      case '>':
        if (j + 1 === cols - 1) {
          return { i, j: 1, direction };
        } else {
          return { i, j: j + 1, direction };
        }
      case '<':
        if (j - 1 === 0) {
          return { i, j: cols - 2, direction };
        } else {
          return { i, j: j - 1, direction };
        }
    }
  });
};

const getAdjs = (
  state: State,
  blizzards: string[][][],
  rows: number,
  cols: number
) => {
  const [i, j] = state.position;
  const adjs: State[] = [];

  // do nothing
  if (!isBlizzard(blizzards[i][j])) {
    adjs.push({ position: [i, j], cost: state.cost + 1 });
  }

  // north
  if (
    (i - 1 === 0 && j === 1) ||
    (i - 1 === rows - 1 && j === cols - 2) ||
    (i - 1 > 0 && !isBlizzard(blizzards[i - 1][j]))
  ) {
    adjs.push({
      position: [i - 1, j],
      cost: state.cost + 1,
    });
  }
  // south
  if (
    (i + 1 === 0 && j === 1) ||
    (i + 1 === rows - 1 && j === cols - 2) ||
    (i + 1 < rows - 1 && !isBlizzard(blizzards[i + 1][j]))
  ) {
    adjs.push({
      position: [i + 1, j],
      cost: state.cost + 1,
    });
  }
  // east
  if (
    j + 1 < cols - 1 &&
    i > 0 &&
    i < rows - 1 &&
    !isBlizzard(blizzards[i][j + 1])
  ) {
    adjs.push({
      position: [i, j + 1],
      cost: state.cost + 1,
    });
  }
  // west;
  if (j - 1 > 0 && i > 0 && i < rows - 1 && !isBlizzard(blizzards[i][j - 1])) {
    adjs.push({
      position: [i, j - 1],
      cost: state.cost + 1,
    });
  }

  return adjs;
};

const simulateBlizzards = (map: string[][][], rows: number, cols: number) => {
  const newMap = new Array(map.length);
  for (let i = 0; i < newMap.length; i++) {
    newMap[i] = map[i].map((c) => (c[0] === '#' ? ['#'] : ['.']));
  }

  for (let i = 0; i < newMap.length; i++) {
    for (let j = 0; j < newMap[i].length; j++) {
      const blizzardsInPlace = map[i][j].filter((item) =>
        ['^', 'v', '<', '>'].includes(item)
      );
      if (blizzardsInPlace.length > 0) {
        const moved = moveBlizzard(blizzardsInPlace, i, j, rows, cols);
        for (const currentBlizzard of moved) {
          newMap[currentBlizzard.i][currentBlizzard.j].push(
            currentBlizzard.direction
          );
          newMap[currentBlizzard.i][currentBlizzard.j] = newMap[
            currentBlizzard.i
          ][currentBlizzard.j].filter((item: string) => item !== '.');
        }
      }
    }
  }
  return newMap;
};

const buildKey = ({ position: [i, j], cost }: State) => `${i},${j},${cost}`;

const parseInput = (input: string) => {
  const startPosition = [0, 1];
  const lines = input.split(/\r?\n/);
  const rows = lines.length;
  const cols = lines[0].length;
  const map: string[][][] = new Array<string[][]>(new Array(lines));
  for (let i = 0; i < lines.length; i++) {
    map[i] = new Array(cols);
    for (let j = 0; j < lines[0].length; j++) {
      map[i][j] = [lines[i][j]];
    }
  }
  const blizzardsInTime: string[][][][] = [simulateBlizzards(map, rows, cols)];
  const endPosition = [rows - 1, cols - 2];
  return { startPosition, endPosition, blizzardsInTime, rows, cols };
};

const findShortestPath = (
  blizzardsInTime: string[][][][],
  startPosition: number[],
  endPosition: number[],
  rows: number,
  cols: number,
  startTime = 0
) => {
  const initial = { position: startPosition, cost: startTime };
  const toVisit = [initial];

  const visited = new Set<string>();
  visited.add(buildKey(initial));
  let shortestPathCost = 0;

  while (toVisit.length) {
    const visiting = toVisit.shift();
    if (!blizzardsInTime[visiting.cost]) {
      blizzardsInTime.push(
        simulateBlizzards(blizzardsInTime[visiting.cost - 1], rows, cols)
      );
    }

    const blizzardsState = blizzardsInTime[visiting.cost];
    const [currentI, currentJ] = visiting.position;
    if (currentI === endPosition[0] && currentJ === endPosition[1]) {
      shortestPathCost = visiting.cost;
      break;
    }

    const adjs = getAdjs(visiting, blizzardsState, rows, cols);

    for (const currentAdj of adjs) {
      if (!visited.has(buildKey(currentAdj))) {
        toVisit.push(currentAdj);
        visited.add(buildKey(currentAdj));
      }
    }
  }
  return shortestPathCost;
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const { startPosition, endPosition, blizzardsInTime, rows, cols } =
      parseInput(this.input);
    return findShortestPath(
      blizzardsInTime,
      startPosition,
      endPosition,
      rows,
      cols
    ).toString();
  }

  public getFirstExpectedResult(): string {
    return '245';
  }

  public solveSecond(): string {
    const { startPosition, endPosition, blizzardsInTime, rows, cols } =
      parseInput(this.input);

    const costToExit = findShortestPath(
      blizzardsInTime,
      startPosition,
      endPosition,
      rows,
      cols
    );
    const costToStart = findShortestPath(
      blizzardsInTime,
      endPosition,
      startPosition,
      rows,
      cols,
      costToExit
    );
    const costToEndAgain = findShortestPath(
      blizzardsInTime,
      startPosition,
      endPosition,
      rows,
      cols,
      costToStart
    );
    return costToEndAgain.toString();
  }

  public getSecondExpectedResult(): string {
    return '798';
  }
}
