/**
 * huge thanks to Hyper neutrino: https://www.youtube.com/watch?v=H3PSODv4nf0
 */

import Puzzle from '../../types/AbstractPuzzle';

const zip = (arr: number[], ...arrs: number[][]) => {
  return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
};

const getKey = (time: number, bots: number[], amt: number[]) =>
  `${time},${bots.join('$')},${amt.join('$')}`;

const dfs = (
  bp: number[][][],
  maxSpend: number[],
  cache: Map<string, number>,
  time: number,
  bots: number[],
  amt: number[]
) => {
  if (time === 0) {
    return amt[3];
  }
  const key = getKey(time, bots, amt);

  const fromCache = cache.get(key);
  if (fromCache) {
    return fromCache;
  }

  let maxVal = amt[3] + bots[3] * time;

  for (const [botType, recipe] of bp.entries()) {
    if (botType !== 3 && bots[botType] >= maxSpend[botType]) {
      continue;
    }

    let wait = 0;
    let broke = false;
    for (const [resourceAmount, resourceType] of recipe) {
      if (bots[resourceType] === 0) {
        broke = true;
        break;
      }
      wait = Math.max(
        wait,
        Math.ceil((resourceAmount - amt[resourceType]) / bots[resourceType])
      );
    }

    if (!broke) {
      const remTime = time - wait - 1;
      if (remTime <= 0) {
        continue;
      }
      const bots_ = bots.slice();
      const amt_ = zip(amt, bots).map(([x, y]) => x + y * (wait + 1));
      for (const [resourceAmount, resourceType] of recipe) {
        amt_[resourceType] -= resourceAmount;
      }
      bots_[botType] += 1;
      for (const i of [0, 1, 2]) {
        amt_[i] = Math.min(amt_[i], maxSpend[i] * remTime);
      }
      maxVal = Math.max(maxVal, dfs(bp, maxSpend, cache, remTime, bots_, amt_));
    }
  }

  cache.set(key, maxVal);
  return maxVal;
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const lines = this.input.split('\n');
    let total = 0;
    for (const [i, line] of lines.entries()) {
      const bp = [];
      const maxSpend = [0, 0, 0];
      for (const section of line.split(': ')[1].split('. ')) {
        const recipe = [];
        const data = [...section.matchAll(/(\d+) (\w+)/g)];
        for (const [_, a, b] of data) {
          const x = +a;
          const y = ['ore', 'clay', 'obsidian'].indexOf(b);
          maxSpend[y] = Math.max(maxSpend[y], x);
          recipe.push([x, y]);
        }
        bp.push(recipe);
      }

      const v = dfs(
        bp,
        maxSpend,
        new Map<string, number>(),
        24,
        [1, 0, 0, 0],
        [0, 0, 0, 0]
      );
      total += (i + 1) * v;
    }

    return total.toString();
  }

  public getFirstExpectedResult(): string {
    return '1650';
  }

  public solveSecond(): string {
    const lines = this.input.split('\n').slice(0, 3);
    let total = 1;
    for (const line of lines) {
      const bp = [];
      const maxSpend = [0, 0, 0];
      for (const section of line.split(': ')[1].split('. ')) {
        const recipe = [];
        const data = [...section.matchAll(/(\d+) (\w+)/g)];
        for (const [_, a, b] of data) {
          const x = +a;
          const y = ['ore', 'clay', 'obsidian'].indexOf(b);
          maxSpend[y] = Math.max(maxSpend[y], x);
          recipe.push([x, y]);
        }
        bp.push(recipe);
      }

      const v = dfs(
        bp,
        maxSpend,
        new Map<string, number>(),
        32,
        [1, 0, 0, 0],
        [0, 0, 0, 0]
      );

      total *= v;
    }
    return total.toString();
  }

  public getSecondExpectedResult(): string {
    return '5824';
  }
}
