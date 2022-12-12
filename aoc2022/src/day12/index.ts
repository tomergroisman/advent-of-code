import run from 'aocrunner';
import _ from 'lodash';

import { string } from '../utils/index.js';

interface Cell {
  row: number;
  column: number;
}

const parseInput = (rawInput: string) => {
  let start: Cell = { row: -1, column: -1 };
  let end: Cell = { row: -1, column: -1 };
  const heatmap: number[][] = string.splitRows(rawInput).map((it, i) =>
    [Infinity, ...it.split(''), Infinity].map((it, j) => {
      if (it === Infinity) {
        return it;
      }
      if (it === 'S') {
        start = { row: i + 1, column: j };
        return 0;
      }
      if (it === 'E') {
        end = { row: i + 1, column: j };
        return 25;
      }
      return (it as string).charCodeAt(0) - 97;
    }),
  );
  heatmap.unshift(new Array(heatmap[0].length).fill(0).map((_) => Infinity));
  heatmap.push(new Array(heatmap[0].length).fill(0).map((_) => Infinity));

  return {
    start,
    end,
    heatmap,
  };
};

const getAltFromCell = (cell: Cell, heatmap: number[][]) =>
  heatmap[cell.row][cell.column];

const getCellKey = (cell: Cell) => `${cell.row},${cell.column}`;

const markAsVisited = (cell: Cell, visited: Record<string, boolean>) => {
  visited[getCellKey(cell)] = true;
};

const hasVisited = (cell: Cell, visited: Record<string, boolean>) =>
  visited[getCellKey(cell)];

const getSteps = (heatmap: number[][], start: Cell, end: Cell) => {
  const visited: Record<string, boolean> = {};
  let steps = 0;

  const q0: Cell[] = [end];
  const q1: Cell[] = [];
  let currentQ = q0;
  let nextQ = q1;
  markAsVisited(end, visited);

  while (_.concat(currentQ, nextQ).length > 0) {
    const cell = currentQ.shift()!;

    const hasReachedStart =
      cell.row === start.row && cell.column === start.column;
    if (hasReachedStart) {
      return steps;
    }

    const currentAlt = getAltFromCell(cell, heatmap);
    const topCell = { row: cell.row - 1, column: cell.column };
    const rightCell = { row: cell.row, column: cell.column + 1 };
    const bottomCell = { row: cell.row + 1, column: cell.column };
    const leftCell = { row: cell.row, column: cell.column - 1 };

    if (
      getAltFromCell(topCell, heatmap) !== Infinity &&
      currentAlt - getAltFromCell(topCell, heatmap) <= 1 &&
      !hasVisited(topCell, visited)
    ) {
      markAsVisited(topCell, visited);
      nextQ.push(topCell);
    }
    if (
      getAltFromCell(rightCell, heatmap) !== Infinity &&
      currentAlt - getAltFromCell(rightCell, heatmap) <= 1 &&
      !hasVisited(rightCell, visited)
    ) {
      markAsVisited(rightCell, visited);
      nextQ.push(rightCell);
    }
    if (
      getAltFromCell(bottomCell, heatmap) !== Infinity &&
      currentAlt - getAltFromCell(bottomCell, heatmap) <= 1 &&
      !hasVisited(bottomCell, visited)
    ) {
      markAsVisited(bottomCell, visited);
      nextQ.push(bottomCell);
    }
    if (
      getAltFromCell(leftCell, heatmap) !== Infinity &&
      currentAlt - getAltFromCell(leftCell, heatmap) <= 1 &&
      !hasVisited(leftCell, visited)
    ) {
      markAsVisited(leftCell, visited);
      nextQ.push(leftCell);
    }

    if (currentQ.length === 0) {
      const tempQ = _.cloneDeep(currentQ);
      currentQ = nextQ;
      nextQ = tempQ;
      steps++;
    }
  }
};

const part1 = (rawInput: string) => {
  const { start, end, heatmap } = parseInput(rawInput);
  return getSteps(heatmap, start, end);
};

const part2 = (rawInput: string) => {
  const { end, heatmap } = parseInput(rawInput);
  let minSteps = Infinity;

  for (let i = 0; i < heatmap.length; i++) {
    for (let j = 0; j < heatmap[0].length; j++) {
      const currentCellAlt = heatmap[i][j];
      if (currentCellAlt === 0) {
        const currentSteps = getSteps(heatmap, { row: i, column: j }, end);
        if (currentSteps) {
          minSteps = Math.min(minSteps, currentSteps);
        }
      }
    }
  }

  return minSteps;
};

run({
  part1: {
    tests: [
      {
        input: `
        Sabqponm
        abcryxxl
        accszExk
        acctuvwj
        abdefghi
      `,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Sabqponm
        abcryxxl
        accszExk
        acctuvwj
        abdefghi
      `,
        expected: 29,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
