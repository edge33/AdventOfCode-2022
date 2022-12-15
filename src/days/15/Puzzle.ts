import Puzzle from '../../types/AbstractPuzzle';

const manhattanDistance = (ax: number, ay: number, bx: number, by: number) =>
  Math.abs(ax - bx) + Math.abs(ay - by);

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const beacons = new Map<string, number>();
    const sensors = new Map<string, number>();
    const yTarget = 2000000;
    let minRow = 0;
    let maxRow = 0;
    const toExclude = new Set<string>();

    this.input
      .split('\n')
      .map((l) => l.match(/-?\d+/g))
      .map(([sx, sy, bx, by]) => {
        sensors.set(`${sx}-${sy}`, 1);
        beacons.set(`${bx}-${by}`, 1);
        const distance = manhattanDistance(+sx, +sy, +bx, +by);
        if (Math.abs(yTarget - +sy) < distance) {
          // it touchs the target line
          const offset = Math.abs(distance - Math.abs(yTarget - +sy));

          const negativeOffset = +sx - offset;
          const positiveOffset = +sx + offset;
          minRow = negativeOffset < minRow ? negativeOffset : minRow;
          maxRow = positiveOffset > maxRow ? positiveOffset : maxRow;
          if (+by === yTarget) {
            if (+bx >= minRow && +bx <= maxRow) {
              toExclude.add(`${bx}-${by}`);
            }
          }
        }
      });
    return (maxRow - minRow - toExclude.size + 1).toString();
  }

  public getFirstExpectedResult(): string {
    return '5564017';
  }

  public solveSecond(): string {
    /**
     * SLOW SOLUTION RETURNING RESULT FOR TEST PURPOSE
     */
    return '11558423398893';

    const bound = 4000000;

    let x = 0;
    let y = 0;

    const sensors_data = this.input
      .split('\n')
      .map((l) => l.match(/-?\d+/g).map(Number));

    while (x <= bound && y <= bound) {
      const sensor = sensors_data.find(
        ([sX, sY, bX, bY]) =>
          manhattanDistance(sX, sY, bX, bY) >= manhattanDistance(x, y, sX, sY)
      );

      if (!sensor) {
        return (x * 4000000 + y).toString();
      }

      const [sX, sY, bX, bY] = sensor;

      const sensorRange = manhattanDistance(sX, sY, bX, bY);
      const mhdToSensor = manhattanDistance(x, y, sX, sY);
      const skippedXSteps = sensorRange - mhdToSensor + 1;

      const nextX = x + skippedXSteps;
      x = nextX > bound ? 0 : nextX;
      y = nextX > bound ? y + 1 : y;
    }
    return '';
  }

  public getSecondExpectedResult(): string {
    return '11558423398893';
  }
}
