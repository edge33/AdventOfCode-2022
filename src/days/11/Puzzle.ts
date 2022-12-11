import Puzzle from '../../types/AbstractPuzzle';

type Monkey = {
  items: number[];
  operation: (old: number) => number;
  divisible: number;
  test: {
    true: number;
    false: number;
  };
  itemsCounter: number;
};

const runIterations = (
  monkeys: Monkey[],
  iterations: number,
  modOperation: (v: number) => number
) => {
  for (let i = 0; i < iterations; i++) {
    for (const currentMonkey of monkeys) {
      let item = currentMonkey.items.shift();
      while (item) {
        const worryLevel = Math.floor(
          modOperation(currentMonkey.operation(item))
        );
        const nextMonkey =
          worryLevel % currentMonkey.divisible === 0
            ? currentMonkey.test.true
            : currentMonkey.test.false;
        monkeys[nextMonkey].items.push(worryLevel);
        item = currentMonkey.items.shift();
        currentMonkey.itemsCounter++;
      }
    }
  }

  const sorted = monkeys.sort((a, b) =>
    a.itemsCounter > b.itemsCounter ? -1 : 1
  );
  return (sorted[0].itemsCounter * sorted[1].itemsCounter).toString();
};

/** TEST INPUT */
// const monkeys = [
//   {
//     items: [79, 98],
//     operation: (old: number) => old * 19,
//     divisible: 23,
//     test: { true: 2, false: 3 },
//     itemsCounter: 0,
//   },
//   {
//     items: [54, 65, 75, 74],
//     operation: (old: number) => old + 6,
//     divisible: 19,
//     test: { true: 2, false: 0 },
//     itemsCounter: 0,
//   },
//   {
//     items: [79, 60, 97],
//     operation: (old: number) => old * old,
//     divisible: 13,
//     test: { true: 1, false: 3 },
//     itemsCounter: 0,
//   },
//   {
//     items: [74],
//     operation: (old: number) => old + 3,
//     divisible: 17,
//     test: { true: 0, false: 1 },
//     itemsCounter: 0,
//   },
// ];
/** REAL INPUT */
const getMonkeys = () => {
  return [
    {
      items: [72, 64, 51, 57, 93, 97, 68],
      operation: (old: number) => old * 19,
      divisible: 17,
      test: { true: 4, false: 7 },
      itemsCounter: 0,
    },
    {
      items: [62],
      operation: (old: number) => old * 11,
      divisible: 3,
      test: { true: 3, false: 2 },
      itemsCounter: 0,
    },
    {
      items: [57, 94, 69, 79, 72],
      operation: (old: number) => old + 6,
      divisible: 19,
      test: { true: 0, false: 4 },
      itemsCounter: 0,
    },
    {
      items: [80, 64, 92, 93, 64, 56],
      operation: (old: number) => old + 5,
      divisible: 7,
      test: { true: 2, false: 0 },
      itemsCounter: 0,
    },
    {
      items: [70, 88, 95, 99, 78, 72, 65, 94],
      operation: (old: number) => old + 7,
      divisible: 2,
      test: { true: 7, false: 5 },
      itemsCounter: 0,
    },
    {
      items: [57, 95, 81, 61],
      operation: (old: number) => old * old,
      divisible: 5,
      test: { true: 1, false: 6 },
      itemsCounter: 0,
    },
    {
      items: [79, 99],
      operation: (old: number) => old + 2,
      divisible: 11,
      test: { true: 3, false: 1 },
      itemsCounter: 0,
    },
    {
      items: [68, 98, 62],
      operation: (old: number) => old + 3,
      divisible: 13,
      test: { true: 5, false: 6 },
      itemsCounter: 0,
    },
  ];
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    return runIterations(getMonkeys(), 20, (value) => value / 3);
  }

  public getFirstExpectedResult(): string {
    return '99852';
  }

  public solveSecond(): string {
    const monkeys = getMonkeys();
    return runIterations(
      monkeys,
      10000,
      (value) =>
        value %
        monkeys.map((m) => m.divisible).reduce((acc, next) => acc * next, 1)
    );
  }

  public getSecondExpectedResult(): string {
    return '25935263541';
  }
}
