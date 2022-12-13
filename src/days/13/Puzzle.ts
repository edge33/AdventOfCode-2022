import Puzzle from '../../types/AbstractPuzzle';

type Group = number | number[] | number[][];

const isGroupInOrder = (a: Group, b: Group): boolean => {
  if (typeof a === 'number' && typeof b === 'number') {
    return a === b ? undefined : a < b;
  }
  if (typeof a === 'object' && typeof b === 'object') {
    for (let i = 0; i < a.length; i++) {
      const aElement = a[i];
      const bElement = b[i];
      if (aElement === undefined) {
        return true;
      }
      if (bElement === undefined) {
        // b has no more items
        return false;
      }
      const validationResult = isGroupInOrder(aElement, bElement);

      if (validationResult !== undefined) {
        return validationResult;
      }
    }
    if (a.length < b.length) {
      return true;
    }
  }
  if (typeof a === 'object' && typeof b === 'number') {
    return isGroupInOrder(a, [b]);
  }
  if (typeof a === 'number' && typeof b === 'object') {
    return isGroupInOrder([a], b);
  }
  return undefined;
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const groups: Group[][] = this.input
      .split('\n\n')
      .map((g) => g.split('\n').map((l) => JSON.parse(l)));

    let sum = 0;
    for (let i = 0; i < groups.length; i++) {
      const [left, right] = groups[i];
      if (isGroupInOrder(left, right)) {
        sum += i + 1;
      }
    }

    return sum.toString();
  }

  public getFirstExpectedResult(): string {
    return '6623';
  }

  public solveSecond(): string {
    const dividerPackets = ['[[2]]', '[[6]]'];
    const packets: Group[] = this.input
      .split('\n')
      .filter((l) => l !== '')
      .map((l) => JSON.parse(l));
    packets.push(...dividerPackets.map((p) => JSON.parse(p)));
    for (let i = 0; i < packets.length - 1; i++) {
      for (let j = i + 1; j < packets.length; j++) {
        if (!isGroupInOrder(packets[i], packets[j])) {
          const temp = packets[i];
          packets[i] = packets[j];
          packets[j] = temp;
        }
      }
    }

    return packets
      .reduce((acc: number, next: Group, i: number) => {
        const stringifiedNext = JSON.stringify(next);
        return stringifiedNext === dividerPackets[0] ||
          stringifiedNext === dividerPackets[1]
          ? acc * (i + 1)
          : acc;
      }, 1)
      .toString();
  }

  public getSecondExpectedResult(): string {
    return '23049';
  }
}
