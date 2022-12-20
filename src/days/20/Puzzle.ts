import Puzzle from '../../types/AbstractPuzzle';

type Node = {
  value: number;
  key: number;
  prev?: Node;
  next?: Node;
  index?: number;
  decryptedValue?: number;
};

class List {
  private head: Node;
  // private tail: Node;
  private size: number;

  constructor() {
    this.size = 0;
  }

  public pushBack(value: number, key: number, decryptedValue = 0) {
    const newNode: Node = { value, key, decryptedValue };
    if (this.size === 0) {
      this.head = newNode;
      this.size++;
      return;
    }

    // this.tail.next = newNode;
    // newNode.prev = this.tail;
    // this.tail = newNode;

    let currentNode = this.head;
    while (currentNode.next) {
      currentNode = currentNode.next;
    }

    currentNode.next = newNode;
    newNode.prev = currentNode;

    this.size++;
  }

  public toArray() {
    const toReturn = [];
    let currentNode = this.head;
    while (currentNode) {
      toReturn.push({ key: currentNode.key, value: currentNode.value });
      currentNode = currentNode.next;
    }
    return toReturn;
  }

  public removeByKey(key: number) {
    let currentNode = this.head;
    let i = 0;
    while (currentNode) {
      if (currentNode.key === key) {
        this.size--;
        if (this.size === 0) {
          this.head = null;
          // this.tail = null;
          return { key: currentNode.key, value: currentNode.value };
        }

        if (currentNode === this.head) {
          this.head = currentNode.next;
          this.head.prev = null;
        } else {
          if (currentNode.next) {
            currentNode.next.prev = currentNode.prev;
            currentNode.prev.next = currentNode.next;
          } else {
            currentNode.prev.next = null;
          }
        }
        // else if (currentNode === this.tail) {
        // this.tail = currentNode.prev;
        // this.tail.next = null;
        // }

        return { key: currentNode.key, value: currentNode.value, index: i };
      }
      currentNode = currentNode.next;
      i++;
    }
  }

  public insertAt(index: number, node: Node) {
    let i = 0;

    if (i > this.size - 1) {
      throw new Error('index out of bounds');
    }
    if ((index === 0 && this.size === 0) || index >= this.size) {
      this.pushBack(node.value, node.key, node.decryptedValue);
      return;
    }

    let currentNode = this.head;
    while (currentNode) {
      if (i === index) {
        if (this.size === 1) {
          node.next = this.head;
          this.head.prev = node;
        } else {
          if (currentNode.prev) {
            currentNode.prev.next = node;
            node.prev = currentNode.prev;
          }

          node.next = currentNode;
          currentNode.prev = node;

          if (this.head === currentNode) {
            this.head = node;
          }
        }

        this.size++;
      }
      i++;
      currentNode = currentNode.next;
    }
  }
}

const solve = (theList: List, rounds = 1) => {
  const numbers = theList.toArray();
  for (let i = 0; i < rounds; i++) {
    for (const number of numbers) {
      const removed = theList.removeByKey(number.key);
      let target = (removed.value + removed.index) % (numbers.length - 1);
      if (target <= 0) {
        target = target + numbers.length - 1;
      }
      theList.insertAt(target, removed);
    }
  }

  const mixed = theList.toArray();

  const indexOfZero = mixed.findIndex((i) => i.value === 0);
  const a = mixed[(indexOfZero + 1000) % mixed.length];
  const b = mixed[(indexOfZero + 2000) % mixed.length];
  const c = mixed[(indexOfZero + 3000) % mixed.length];

  return (a.value + b.value + c.value).toString();
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const theList = new List();
    this.input.split('\n').forEach((s, i) => theList.pushBack(+s, i));
    return solve(theList);
  }

  public getFirstExpectedResult(): string {
    return '7713';
  }

  public solveSecond(): string {
    const theList = new List();
    const key = 811589153;
    this.input.split('\n').forEach((s, i) => theList.pushBack(+s * key, i));
    return solve(theList, 10);
  }

  public getSecondExpectedResult(): string {
    return '1664569352803';
  }
}
