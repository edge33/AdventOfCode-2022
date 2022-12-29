/**
 * Built from an idea got in the AoC subreddit
 */
import Puzzle from '../../types/AbstractPuzzle';

type Valve = {
  flow: number;
  adjs: string[];
};

type ValveMap = {
  [k: string]: Valve;
};

const buildPath = (
  path: string[],
  valves: string[],
  cost: number,
  pathCosts: {
    [k: string]: {
      [k: string]: number;
    };
  },
  paths: Set<string>,
  maxCost = 30
) => {
  if (!valves.length) {
    return paths.add(path.join(','));
  }
  const last = path[path.length - 1];
  for (const next of valves) {
    const nextCost = pathCosts[last][next];
    if (cost + nextCost + 1 >= maxCost) {
      paths.add(path.join(','));
      continue;
    }

    buildPath(
      [...path, next],
      valves.filter((v) => v !== next),
      cost + nextCost + 1,
      pathCosts,
      paths,
      maxCost
    );
  }
};

const buildAllPaths = (
  valves: string[],
  pathCosts: {
    [k: string]: {
      [k: string]: number;
    };
  },
  maxCost = 30
) => {
  const paths: Set<string> = new Set();
  buildPath(['AA'], [...valves], 0, pathCosts, paths, maxCost);
  return [...paths].map((path) => path.split(','));
};

const getPathCost = (start: string, end: string, valveMap: ValveMap) => {
  const toVisit = [{ node: start, cost: 0 }];
  const visited = [start];
  while (toVisit.length) {
    const visiting = toVisit.shift();
    if (visiting.node === end) {
      return visiting.cost;
    }
    const ajds = valveMap[visiting.node].adjs;
    for (const currentAdj of ajds) {
      if (!visited.includes(currentAdj)) {
        toVisit.push({ node: currentAdj, cost: visiting.cost + 1 });
        visited.push(currentAdj);
      }
    }
  }
};

const scorePath = (
  path: string[],
  valveMap: ValveMap,
  pathCosts: {
    [k: string]: {
      [k: string]: number;
    };
  },
  time = 30
) => {
  let score = 0;
  let flow = 0;
  let from = path.shift();
  let openValveAtTime = -1;
  let canOpenValve = true;
  let newFlow = 0;
  for (let t = 0; t < time; t++) {
    if (path.length && canOpenValve) {
      const next = path.shift();
      openValveAtTime += pathCosts[from][next] + 1;
      newFlow = valveMap[next].flow;
      from = next;
      canOpenValve = false;
    }
    score += flow;
    if (t === openValveAtTime && !canOpenValve) {
      canOpenValve = true;
      flow += newFlow;
      newFlow = 0;
    }
  }
  return score;
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const valveMap: ValveMap = Object.fromEntries(
      this.input
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          const [valve, tunnels] = line.split(';');
          const label = valve.match(/([A-Z]{2})/)?.[1] ?? 'broken';
          const flow = Number(valve.match(/(\d+)/)?.[1] ?? 0);
          const adjs = Array.from(tunnels.matchAll(/([A-Z]{2})/g)).map(
            (match) => match[1]
          );
          return [label, { flow, adjs }] as const;
        })
    );
    const valves = Object.entries(valveMap)
      .map(([valve, { flow }]) => (flow > 0 ? valve : undefined))
      .filter(Boolean);

    const pathCosts = Object.fromEntries(
      ['AA', ...valves].map((valve) => [
        valve,
        Object.fromEntries(
          valves
            .filter((v) => v !== valve)
            // .map((v) => ({ to: v, cost: getPathCost(valve, v, valveMap) })),
            .map((v) => [v, getPathCost(valve, v, valveMap)])
        ),
      ])
    );

    const paths = buildAllPaths(valves, pathCosts);
    const withScores = paths.map((path) => [
      [...path],
      scorePath([...path], valveMap, pathCosts),
    ]);
    return withScores.sort((a, b) => (a[1] > b[1] ? -1 : 1))[0][1].toString();
  }

  public getFirstExpectedResult(): string {
    return '1580';
  }

  public solveSecond(): string {
    const valveMap: ValveMap = Object.fromEntries(
      this.input
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          const [valve, tunnels] = line.split(';');
          const label = valve.match(/([A-Z]{2})/)?.[1] ?? 'broken';
          const flow = Number(valve.match(/(\d+)/)?.[1] ?? 0);
          const adjs = Array.from(tunnels.matchAll(/([A-Z]{2})/g)).map(
            (match) => match[1]
          );
          return [label, { flow, adjs }] as const;
        })
    );
    const valves = Object.entries(valveMap)
      .map(([valve, { flow }]) => (flow > 0 ? valve : undefined))
      .filter(Boolean);

    const pathCosts = Object.fromEntries(
      ['AA', ...valves].map((valve) => [
        valve,
        Object.fromEntries(
          valves
            .filter((v) => v !== valve)
            // .map((v) => ({ to: v, cost: getPathCost(valve, v, valveMap) })),
            .map((v) => [v, getPathCost(valve, v, valveMap)])
        ),
      ])
    );

    const paths = buildAllPaths(valves, pathCosts, 26);

    const withScores: [string[], number][] = paths
      .map(
        (path) =>
          [[...path], scorePath([...path], valveMap, pathCosts, 26)] as [
            string[],
            number
          ]
      )
      .filter((items) => items[1] > 0)
      .sort((a, b) => (a[1] >= b[1] ? -1 : 1));

    return withScores
      .reduce((best, [path, score], i) => {
        const others = withScores.slice(i);
        const nonOverlapping = others.find((entry) =>
          path.slice(1).every((p) => !entry[0].slice(1).includes(p))
        );
        if (!nonOverlapping) {
          return best;
        }
        return Math.max(best, score + nonOverlapping[1]);
      }, 0)
      .toString();
  }

  public getSecondExpectedResult(): string {
    return '2213';
  }
}
