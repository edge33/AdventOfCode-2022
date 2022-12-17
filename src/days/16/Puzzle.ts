import path = require('path');
import Puzzle from '../../types/AbstractPuzzle';

// This is basic pathfinding just to find the time to travel from any valid valve to any other valid valve. Important to prevent moving unproductively into worthless rooms
const getLowestCost = (
  start: string,
  end: string,
  valveMap: {
    [k: string]: {
      readonly flowRate: number;
      readonly tunnelConnections: string[];
    };
  }
) => {
  const queue: { room: string; cost: number; visited: string[] }[] = [
    { room: start, cost: 0, visited: [start] },
  ];
  while (queue.length) {
    const { room, cost, visited } = queue.shift()!;
    if (room === end) {
      return cost;
    }
    const { tunnelConnections } = valveMap[room];
    if (tunnelConnections.includes(end)) {
      return cost + 1;
    }
    tunnelConnections.forEach((tunnel) => {
      if (!visited.includes(tunnel)) {
        queue.push({
          room: tunnel,
          cost: cost + 1,
          visited: [...visited, tunnel],
        });
      }
    });
  }
  return -1;
};

// I actually found that it was faster to just generate all the possible routes within the time and then process their scores separately as opposed to pathing and calculating as I went. This is mainly because of how Part 2 works, this just allowed more control over ensuring things could be memoized and be smooth enough
const makeAllPaths = (
  time: number,
  pathCosts: {
    [k: string]: {
      [k: string]: number;
    };
  },
  allValves: string[]
) => {
  const pathList: Set<string> = new Set();
  const getRemainingPath = (
    steps: string[],
    left: string[],
    costThusFar: number
  ): void => {
    const last = steps[steps.length - 1];
    if (!left.length) {
      pathList.add(steps.join('-'));
    }
    return left.forEach((next) => {
      const cost = pathCosts[last][next];
      if (cost + 1 + costThusFar >= time) {
        return pathList.add(steps.join('-'));
      }
      return getRemainingPath(
        [...steps, next],
        left.filter((pos) => pos !== next),
        costThusFar + cost + 1
      );
    });
  };
  getRemainingPath(['AA'], [...allValves], 0);
  return [...pathList].map((path) => path.split('-'));
};

// Takes paths and provides the amount of pressure they can release in the given time. This memoizes paths past a certain point so that the tail end of paths can be sped up. Part 1 simply consists of getting the best path for a single actor moving through and turning valves
const scorePaths = (
  paths: string[][],
  time: number,
  pathCosts: {
    [k: string]: {
      [k: string]: number;
    };
  },
  valveMap: {
    [k: string]: {
      readonly flowRate: number;
      readonly tunnelConnections: string[];
    };
  }
) => {
  const scorePath = (
    opened: string[],
    path: string[],
    timeLeft: number,
    debug = false
  ): number => {
    const nextStep = path[0];
    const remainingSteps = path.slice(1);
    const nextStepCost = pathCosts[opened[0]][nextStep];
    const flowForStep =
      opened[0] === 'AA' ? 0 : valveMap[opened[0]].flowRate * timeLeft;
    if (!path.length) {
      return flowForStep;
    }
    const pressureReleased = scorePath(
      [path[0], ...opened],
      remainingSteps,
      timeLeft - nextStepCost - 1,
      debug
    );
    return pressureReleased + flowForStep;
  };
  const pathScores = paths
    .map(
      (path) =>
        [path, scorePath([path[0]], path.slice(1), time)] as [string[], number]
    )
    .sort(([_, valA], [__, valB]) => valB - valA);
  return pathScores;
};

// Part 2 gives less time, but you have 2 actors moving through the caves. Since there are too many valves for even two actors to turn them all, one of the best ways to handle this is to just get the scores for all possible paths for a single actor and then find the best two that don't overlap to send the two actors to handle separately.
const getBestCombo = (
  pathCosts: {
    [k: string]: {
      [k: string]: number;
    };
  },
  valveMap: {
    [k: string]: {
      readonly flowRate: number;
      readonly tunnelConnections: string[];
    };
  },
  allValves: string[]
) => {
  const pathScores = scorePaths(
    makeAllPaths(26, pathCosts, allValves),
    26,
    pathCosts,
    valveMap
  );
  const candidates = pathScores
    .filter(([_, score]) => score > 0)
    .map(([path, score]) => [path.slice(1), score] as [string[], number]);
  const bestCombo = candidates.reduce((best, [path, score], i) => {
    if (score < ((best / 2) | 0)) {
      return best;
    }
    const splitPoint =
      best === 0
        ? undefined
        : Math.max(
            0,
            candidates.findIndex((candidate) => candidate[1] + score < best) +
              1 -
              i
          );

    const noOverlap = candidates
      .slice(i, splitPoint)
      .find((helper) => helper[0].every((valve) => !path.includes(valve)));
    if (!noOverlap) {
      return best;
    }
    return Math.max(best, noOverlap[1] + score);
  }, 0);
  return bestCombo;
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const valveMap = Object.fromEntries(
      this.input
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          const [valve, tunnels] = line.split(';');
          const label = valve.match(/([A-Z]{2})/)?.[1] ?? 'broken';
          const flowRate = Number(valve.match(/(\d+)/)?.[1] ?? 0);
          const tunnelConnections = Array.from(
            tunnels.matchAll(/([A-Z]{2})/g)
          ).map((match) => match[1]);
          return [label, { flowRate, tunnelConnections }] as const;
        })
    );

    // Rooms with no flowRate aren't worth considering as node worth passing through. Those with flowrate are valid nodes
    const allValves = Object.entries(valveMap)
      .map(([valve, { flowRate }]) => (flowRate > 0 ? valve : null))
      .filter(Boolean) as string[];

    const pathCosts = Object.fromEntries(
      ['AA', ...allValves].map((start) => [
        start,
        Object.fromEntries(
          allValves
            .filter((end) => end !== start)
            .map((end) => [end, getLowestCost(start, end, valveMap)])
        ),
      ])
    );

    return scorePaths(
      makeAllPaths(30, pathCosts, allValves),
      30,
      pathCosts,
      valveMap
    )[0][1].toString();
  }

  public getFirstExpectedResult(): string {
    return '1580';
  }

  public solveSecond(): string {
    const valveMap = Object.fromEntries(
      this.input
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          const [valve, tunnels] = line.split(';');
          const label = valve.match(/([A-Z]{2})/)?.[1] ?? 'broken';
          const flowRate = Number(valve.match(/(\d+)/)?.[1] ?? 0);
          const tunnelConnections = Array.from(
            tunnels.matchAll(/([A-Z]{2})/g)
          ).map((match) => match[1]);
          return [label, { flowRate, tunnelConnections }] as const;
        })
    );

    // Rooms with no flowRate aren't worth considering as node worth passing through. Those with flowrate are valid nodes
    const allValves = Object.entries(valveMap)
      .map(([valve, { flowRate }]) => (flowRate > 0 ? valve : null))
      .filter(Boolean) as string[];

    const pathCosts = Object.fromEntries(
      ['AA', ...allValves].map((start) => [
        start,
        Object.fromEntries(
          allValves
            .filter((end) => end !== start)
            .map((end) => [end, getLowestCost(start, end, valveMap)])
        ),
      ])
    );
    return getBestCombo(pathCosts, valveMap, allValves).toString();
  }

  public getSecondExpectedResult(): string {
    return '2213';
  }
}
