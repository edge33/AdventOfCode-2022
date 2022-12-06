import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    // const test = [['N', 'Z'], ['D', 'C', 'M'], ['P']];

    const test = [
      ['W', 'L', 'S'],
      ['Q', 'N', 'T', 'J'],
      ['J', 'F', 'H', 'C', 'S'],
      ['B', 'G', 'N', 'W', 'M', 'R', 'T'],
      ['B', 'Q', 'H', 'D', 'S', 'L', 'R', 'T'],
      ['L', 'R', 'H', 'F', 'V', 'B', 'J', 'M'],
      ['M', 'J', 'N', 'R', 'W', 'D'],
      ['J', 'D', 'N', 'H', 'F', 'T', 'Z', 'B'],
      ['T', 'F', 'B', 'N', 'Q', 'L', 'H'],
    ];
    const stacks: string[][] = [];
    test.forEach((list) => {
      const stack: string[] = [];
      list.forEach((item) => {
        stack.push(item);
      });
      stacks.push(stack);
    });

    const instructions = this.input
      .split('\n')
      .map((line) => line.match(/\d+/g).map((i) => +i));

    for (const [howMany, from, to] of instructions) {
      for (let i = 0; i < howMany; i++) {
        const item = stacks[from - 1].shift();
        stacks[to - 1].unshift(item);
      }
    }
    return stacks.map((stack) => stack.shift()).join('');
  }

  public getFirstExpectedResult(): string {
    return 'RLFNRTNFB';
  }

  public solveSecond(): string {
    // const test = [['N', 'Z'], ['D', 'C', 'M'], ['P']];
    const test = [
      ['W', 'L', 'S'],
      ['Q', 'N', 'T', 'J'],
      ['J', 'F', 'H', 'C', 'S'],
      ['B', 'G', 'N', 'W', 'M', 'R', 'T'],
      ['B', 'Q', 'H', 'D', 'S', 'L', 'R', 'T'],
      ['L', 'R', 'H', 'F', 'V', 'B', 'J', 'M'],
      ['M', 'J', 'N', 'R', 'W', 'D'],
      ['J', 'D', 'N', 'H', 'F', 'T', 'Z', 'B'],
      ['T', 'F', 'B', 'N', 'Q', 'L', 'H'],
    ];

    const stacks: string[][] = [];
    test.forEach((list) => {
      const stack: string[] = [];
      list.forEach((item) => {
        stack.push(item);
      });
      stacks.push(stack);
    });

    const instructions = this.input
      .split('\n')
      .map((line) => line.match(/\d+/g).map((i) => +i));

    for (const [howMany, from, to] of instructions) {
      const extracted = stacks[from - 1].slice(0, howMany);
      stacks[from - 1] = stacks[from - 1].slice(howMany);
      stacks[to - 1] = [...extracted, ...stacks[to - 1]];
    }
    return stacks.map((stack) => stack.shift()).join('');
  }

  public getSecondExpectedResult(): string {
    return 'MHQTLJRLB';
  }
}
