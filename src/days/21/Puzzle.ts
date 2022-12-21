import Puzzle from '../../types/AbstractPuzzle';

type Monkey = {
  number: number;
  name: string;
  a: number;
  b: number;
};

type Operation = {
  name: string;
  a: string;
  b: string;
  sign: OperationSign;
};

type OperationSign = '+' | '-' | '*' | '/';

const getOpFunction = (op: OperationSign) => {
  switch (op) {
    case '+':
      return (a: number, b: number) => a + b;
    case '-':
      return (a: number, b: number) => a - b;
    case '*':
      return (a: number, b: number) => a * b;
    case '/':
      return (a: number, b: number) => a / b;
    default: {
      const _exhaustiveCheck: never = op;
    }
  }
};

const runOperations = (input: string, initialValue = 0) => {
  const monkeys = new Map<string, Monkey>();
  let operationsToSolve: Operation[] = [];

  input.split('\n').forEach((l) => {
    const [name, monkey] = l.split(': ');
    const number = monkey.match(/\d+/);
    if (number) {
      monkeys.set(name, { number: +number, name, a: -1, b: -1 });
    } else {
      const [_, a, op, b] = monkey.match(/(\w+) (\S)\s(\w+)/);
      operationsToSolve.push({ name, a, b, sign: op as OperationSign });
    }
  });
  if (initialValue !== 0) {
    monkeys.get('humn').number = initialValue;
  }

  // monkeys.get('humn').number = 300;

  while (operationsToSolve.length > 0) {
    // find first op we can solve
    const index = operationsToSolve.findIndex(
      ({ a, b }) => monkeys.has(a) && monkeys.has(b)
    );
    // should be safe to use index witouth checking for -1
    const operation = operationsToSolve[index];
    operationsToSolve = [
      ...operationsToSolve.slice(0, index),
      ...operationsToSolve.slice(index + 1),
    ];
    const aNumber = monkeys.get(operation.a).number;
    const bNumber = monkeys.get(operation.b).number;
    const newMonkey: Monkey = {
      a: aNumber,
      b: bNumber,
      name: operation.name,
      number: getOpFunction(operation.sign)(aNumber, bNumber),
    };

    monkeys.set(operation.name, newMonkey);
    if (newMonkey.name === 'root') {
      return newMonkey;
    }
  }
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    return runOperations(this.input).number.toString();
  }

  public getFirstExpectedResult(): string {
    return '104272990112064';
  }

  public solveSecond(): string {
    /**
     * this max works for the real input use a smaller for the test
     */
    const max = 10000000000000;
    let split = 2;
    let candidate = Math.floor(max / split);
    split *= 2;
    let { a, b } = runOperations(this.input, candidate);
    while (a !== b) {
      if (a > b) {
        candidate = candidate + Math.floor(max / split);
      } else {
        candidate = candidate - Math.floor(max / split);
      }
      split *= 2;
      ({ a, b } = runOperations(this.input, candidate));
    }
    return candidate.toString();
  }

  public getSecondExpectedResult(): string {
    return '3220993874133';
  }
}
