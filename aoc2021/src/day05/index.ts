import run from 'aocrunner';

import { string } from '../utils/index.js';

class Point {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  fromArray(array: number[]) {
    this.x = array[0];
    this.y = array[1];

    return this;
  }
}

class Line {
  start: Point;
  end: Point;

  constructor(start: Point, end: Point) {
    this.start = start;
    this.end = end;
  }

  get distance(): number {
    return Math.sqrt(
      Math.pow(this.start.x - this.end.x, 2) +
        Math.pow(this.start.y - this.end.y, 2),
    );
  }

  get slope(): number {
    return -(this.start.y - this.end.y) / (this.start.x - this.end.x);
  }
}

const parseInput = (rawInput: string) => {
  let n: number = 0;
  const lines: Line[] = string.splitRows(rawInput).map((it) => {
    const [startPointString, endPointString] = it.split(' -> ');
    const startPointArray: number[] = startPointString
      .split(',')
      .map(parseFloat);
    const endPointArray: number[] = endPointString.split(',').map(parseFloat);
    const startPoint: Point = new Point().fromArray(startPointArray);
    const endPoint: Point = new Point().fromArray(endPointArray);
    const line: Line = new Line(startPoint, endPoint);
    n = Math.max(n, line.start.x, line.end.x, line.start.y, line.end.y);
    return line;
  });
  n++;

  return { lines, n };
};

const drawLinesOnBoard = (lines: Line[], board: number[][]) => {
  for (const line of lines) {
    const isHorizontal: boolean = line.start.y === line.end.y;
    const isVertical: boolean = line.start.x === line.end.x;
    const isDecreasingDiagonal = !isVertical && line.slope < 0;
    const isIncreasingDiagonal = !isVertical && line.slope > 0;

    if (isHorizontal) {
      const minX: number = Math.min(line.start.x, line.end.x);
      for (let i = minX; i <= minX + line.distance; i++) {
        board[line.start.y][i]++;
      }
    }

    if (isVertical) {
      const minY: number = Math.min(line.start.y, line.end.y);
      for (let i = minY; i <= minY + line.distance; i++) {
        board[i][line.start.x]++;
      }
    }

    if (isDecreasingDiagonal) {
      const minX: number = Math.min(line.start.x, line.end.x);
      const maxX: number = Math.max(line.start.x, line.end.x);
      const minY: number = Math.min(line.start.y, line.end.y);
      const diagonalDistance: number = maxX - minX;

      for (let i = 0; i <= diagonalDistance; i++) {
        board[minY + i][minX + i]++;
      }
    }

    if (isIncreasingDiagonal) {
      const minX: number = Math.min(line.start.x, line.end.x);
      const maxX: number = Math.max(line.start.x, line.end.x);
      const maxY: number = Math.max(line.start.y, line.end.y);
      const diagonalDistance: number = maxX - minX;

      for (let i = 0; i <= diagonalDistance; i++) {
        board[maxY - i][minX + i]++;
      }
    }
  }
};

const part1 = (rawInput: string) => {
  const { lines } = parseInput(rawInput);
  let n: number = 0;
  const symmetricLines: Line[] = lines.filter((it) => {
    const isSymmetric = it.start.x === it.end.x || it.start.y === it.end.y;
    if (isSymmetric) {
      n = Math.max(n, it.start.x, it.end.x, it.start.y, it.end.y);
      return true;
    }
    return false;
  });

  n++;
  const board: number[][] = new Array(n)
    .fill(0)
    .map(() => new Array(n).fill(0));
  drawLinesOnBoard(symmetricLines, board);

  return board.flat().reduce((previousValue, currentValue) => {
    if (currentValue > 1) {
      return previousValue + 1;
    }
    return previousValue;
  }, 0);
};

const part2 = (rawInput: string) => {
  const { lines, n } = parseInput(rawInput);

  const board: number[][] = new Array(n)
    .fill(0)
    .map(() => new Array(n).fill(0));
  drawLinesOnBoard(lines, board);

  return board.flat().reduce((previousValue, currentValue) => {
    if (currentValue > 1) {
      return previousValue + 1;
    }
    return previousValue;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
        0,9 -> 5,9
        8,0 -> 0,8
        9,4 -> 3,4
        2,2 -> 2,1
        7,0 -> 7,4
        6,4 -> 2,0
        0,9 -> 2,9
        3,4 -> 1,4
        0,0 -> 8,8
        5,5 -> 8,2
        `,
        expected: 5,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        0,9 -> 5,9
        8,0 -> 0,8
        9,4 -> 3,4
        2,2 -> 2,1
        7,0 -> 7,4
        6,4 -> 2,0
        0,9 -> 2,9
        3,4 -> 1,4
        0,0 -> 8,8
        5,5 -> 8,2
        `,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
