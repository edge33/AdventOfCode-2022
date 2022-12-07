import Puzzle from '../../types/AbstractPuzzle';

class Node {
  path: string;
  size: number;
  children: Node[];
  parent: Node;

  constructor(path: string) {
    this.path = path;
    this.children = [];
    this.size = 0;
  }
}

const display = (node: Node, level = 1) => {
  const prefix = new Array(level)
    .fill(1)
    .map((_) => '-')
    .join(' ');
  console.log(`${prefix} ${node.path}`);
  if (node.children.length > 0) {
    for (const child of node.children) {
      display(child, level + 1);
    }
  }
};

const computeSize = (node: Node, dirSizes: number[] = []) => {
  if (node.children.length === 0) {
    return node.size;
  }
  let sum = 0;
  for (const child of node.children) {
    sum = sum + computeSize(child, dirSizes);
  }
  dirSizes.push(sum);
  return sum;
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    let node = new Node('/');
    const rootNode = node;
    const lines = this.input.split('\n');
    for (const line of lines.slice(1)) {
      if (line.includes('$ cd')) {
        const path = line.split(' ').reverse()[0];
        if (path === '..') {
          node = node.parent;
        } else {
          const childNode = node.children.find((dir) => dir.path === path);
          node = childNode;
        }
      } else if (line.includes('dir')) {
        const dirPath = line.split(' ')[1];
        const newNode = new Node(dirPath);
        newNode.parent = node;
        node.children.push(newNode);
      } else if (line.match(/\d+/g)) {
        const [size, file] = line.split(' ');
        const newNode = new Node(file);
        newNode.size = +size;
        newNode.parent = node;
        node.children.push(newNode);
      }
    }
    const dirSizes: number[] = [];
    computeSize(rootNode, dirSizes);
    return dirSizes
      .reduce((acc, next) => acc + (next <= 100000 ? next : 0), 0)
      .toString();
  }

  public getFirstExpectedResult(): string {
    return '1297683';
  }

  public solveSecond(): string {
    let node = new Node('/');
    const rootNode = node;
    const lines = this.input.split('\n');
    for (const line of lines.slice(1)) {
      if (line.includes('$ cd')) {
        const path = line.split(' ').reverse()[0];
        if (path === '..') {
          node = node.parent;
        } else {
          const childNode = node.children.find((dir) => dir.path === path);
          node = childNode;
        }
      } else if (line.includes('dir')) {
        const dirPath = line.split(' ')[1];
        const newNode = new Node(dirPath);
        newNode.parent = node;
        node.children.push(newNode);
      } else if (line.match(/\d+/g)) {
        const [size, file] = line.split(' ');
        const newNode = new Node(file);
        newNode.size = +size;
        newNode.parent = node;
        node.children.push(newNode);
      }
    }
    const dirSizes: number[] = [];
    const rootSize = computeSize(rootNode, dirSizes);

    const freeSpace = 70000000 - rootSize;
    const required = 30000000 - freeSpace;

    const sorted = dirSizes.sort((a, b) => (a > b ? 1 : -1));
    return sorted.filter((item) => item >= required)[0].toString();
  }

  public getSecondExpectedResult(): string {
    return '5756764';
  }
}
