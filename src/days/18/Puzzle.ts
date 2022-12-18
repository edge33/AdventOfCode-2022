import Puzzle from '../../types/AbstractPuzzle';

const checkAdjs = (cubeA: number[], cubeB: number[]) => {
  const [ax, ay, az] = cubeA;
  const [bx, by, bz] = cubeB;

  const pos = [
    [ax - 1, ay, az],
    [ax + 1, ay, az],
    [ax, ay - 1, az],
    [ax, ay + 1, az],
    [ax, ay, az - 1],
    [ax, ay, az + 1],
  ];

  return pos.some(([px, py, pz]) => px === bx && py === by && pz === bz);
};

const buildKey = ([x, y, z]: number[]) => `${x},${y},${z}`;

const splitKey = (key: string) => key.split(',').map(Number);

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const cubes = this.input.split('\n').map((l) => l.split(',').map(Number));

    let counter = 0;
    for (let i = 0; i < cubes.length; i++) {
      const cubeA = cubes[i];
      let adjsCount = 0;
      for (let j = 0; j < cubes.length; j++) {
        if (j === i) {
          continue;
        }
        const cubeB = cubes[j];
        if (checkAdjs(cubeA, cubeB)) {
          adjsCount += 1;
        }
      }

      counter += 6 - adjsCount;
    }
    return counter.toString();
  }

  public getFirstExpectedResult(): string {
    return '4310';
  }

  public solveSecond(): string {
    const cubes = new Map<string, string>();
    const water = new Map<string, string>();
    let minX = 1000000;
    let maxX = 0;
    let minY = 1000000;
    let maxY = 0;
    let minZ = 1000000;
    let maxZ = 0;
    this.input.split('\n').forEach((l) => {
      const [x, y, z] = l.split(',').map(Number);
      cubes.set(buildKey([x, y, z]), '1');
      if (x > maxX) {
        maxX = x;
      }
      if (x < minX) {
        minX = x;
      }

      if (y > maxY) {
        maxY = y;
      }
      if (y < minY) {
        minY = y;
      }

      if (z > maxZ) {
        maxZ = z;
      }
      if (z < minZ) {
        minZ = z;
      }
    });

    minX -= 1;
    maxX += 1;
    minY -= 1;
    maxY += 1;
    minZ -= 1;
    maxZ += 1;

    // BFS to flood fill the space
    const toVisit = [
      [minX + 1, minY, minZ],
      [minX, minY + 1, minZ],
      [minX, minY, minZ + 1],
    ];
    while (toVisit.length) {
      const node = toVisit.shift();
      const [x, y, z] = node;

      const possibleNeighboors = [
        [x - 1, y, z],
        [x + 1, y, z],
        [x, y - 1, z],
        [x, y + 1, z],
        [x, y, z - 1],
        [x, y, z + 1],
      ];
      for (const n of possibleNeighboors) {
        const [nx, ny, nz] = n;
        // if in bounds
        if (
          nx >= minX &&
          nx <= maxX &&
          ny >= minY &&
          ny <= maxY &&
          nz >= minZ &&
          nz <= maxZ
        ) {
          const key = buildKey(n);
          if (!water.has(key) && !cubes.has(key)) {
            toVisit.push(n);
            water.set(key, '1');
          }
        }
      }
    }

    const waterBlocks = Array.from(water.entries());
    const lavaBlocks = Array.from(cubes.entries());

    let adjsCounter = 0;
    for (const [key] of waterBlocks) {
      const [x, y, z] = splitKey(key);

      for (const [cubeKey] of lavaBlocks) {
        const [cX, cY, cZ] = splitKey(cubeKey);
        if (checkAdjs([x, y, z], [cX, cY, cZ])) {
          adjsCounter++;
        }
      }
    }

    return adjsCounter.toString();
  }

  public getSecondExpectedResult(): string {
    return '2466';
  }
}
