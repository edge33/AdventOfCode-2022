import Puzzle from '../../types/AbstractPuzzle';

const MAX_COST = 100000;

type Node = {
  i: number;
  j: number;
  cost: number;
  value: number;
};

const getMin = (nodes: Map<string, Node>) => {
  let min = MAX_COST;
  const entries = Array.from(nodes.entries());
  let minNodeKey = entries[0][0];
  for (const [key, node] of entries) {
    if (node.cost < min) {
      min = node.cost;
      minNodeKey = key;
    }
  }
  const toReturn = nodes.get(minNodeKey);
  nodes.delete(minNodeKey);
  return toReturn;
};

const findAdjs = (node: Node, nodes: Node[][], mode = 'asc') => {
  const adjs: Node[] = [];
  [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ].forEach(([deltaI, deltaJ]) => {
    if (nodes[node.i + deltaI] && nodes[node.i + deltaI][node.j + deltaJ]) {
      const adjNode = nodes[node.i + deltaI][node.j + deltaJ];
      if (mode === 'desc') {
        if (node.value - adjNode.value <= 1) {
          adjs.push(adjNode);
        }
      } else {
        if (node.value - adjNode.value >= -1) {
          adjs.push(adjNode);
        }
      }
    }
  });
  return adjs;
};

const findBestPath = (
  input: string,
  start: string,
  target: number,
  strategy = 'asc'
) => {
  const toVisit = new Map();
  const nodes: Node[][] = input.split('\n').map((l, i) =>
    l.split('').map((item, j) => {
      let elevation: number = item.charCodeAt(0) - 97;
      if (item === 'S') {
        elevation = 0;
      }
      if (item === 'E') {
        elevation = 26;
      }
      const node = {
        i,
        j,
        cost: item === start ? 0 : MAX_COST,
        value: elevation,
      };
      toVisit.set(`${i}-${j}`, node);
      return node;
    })
  );
  let currentNode: Node;
  let bestPathCost = 100000;

  while (toVisit.size > 0) {
    currentNode = getMin(toVisit);
    const adjs = findAdjs(currentNode, nodes, strategy);

    for (const currentAdj of adjs) {
      if (currentNode.cost + 1 < currentAdj.cost) {
        currentAdj.cost = currentNode.cost + 1;
        if (currentAdj.value === target) {
          if (currentAdj.cost < bestPathCost) {
            bestPathCost = currentAdj.cost;
          }
        }
      }
    }
  }

  return bestPathCost.toString();
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    return findBestPath(this.input, 'S', 26, 'asc');
  }

  public getFirstExpectedResult(): string {
    return '484';
  }

  public solveSecond(): string {
    return findBestPath(this.input, 'E', 0, 'desc');
  }

  public getSecondExpectedResult(): string {
    return '478';
  }
}
