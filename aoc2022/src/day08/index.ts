import run from 'aocrunner';
import _ from 'lodash';

import { string } from '../utils/index.js';

const parseInput = (rawInput: string) => {
  return string.splitRows(rawInput).map((it) => it.split('').map(parseFloat));
};

const isVisible = (trees: number[][], i: number, j: number) => {
  const n = trees.length;
  const m = trees[0].length;
  const tree = trees[i][j];

  let isVisibleFromUp = true;
  for (let row = i - 1; row >= 0; row--) {
    const currentTree = trees[row][j];
    if (currentTree >= tree) {
      isVisibleFromUp = false;
      break;
    }
  }
  if (isVisibleFromUp) return true;

  let isVisibleFromBottom = true;
  for (let row = i + 1; row < n; row++) {
    const currentTree = trees[row][j];
    if (currentTree >= tree) {
      isVisibleFromBottom = false;
      break;
    }
  }
  if (isVisibleFromBottom) return true;

  let isVisibleFromLeft = true;
  for (let col = j - 1; col >= 0; col--) {
    const currentTree = trees[i][col];
    if (currentTree >= tree) {
      isVisibleFromLeft = false;
      break;
    }
  }
  if (isVisibleFromLeft) return true;

  let isVisibleFromRight = true;
  for (let col = j + 1; col < m; col++) {
    const currentTree = trees[i][col];
    if (currentTree >= tree) {
      isVisibleFromRight = false;
      break;
    }
  }
  return isVisibleFromRight;
};

const getViewScore = (trees: number[][], i: number, j: number) => {
  const n = trees.length;
  const m = trees[0].length;
  const tree = trees[i][j];

  let treesVisibleFromUp = 0;
  for (let row = i - 1; row >= 0; row--) {
    const currentTree = trees[row][j];
    if (currentTree < tree) treesVisibleFromUp++;
    else {
      treesVisibleFromUp++;
      break;
    }
  }

  let treesVisibleFromBottom = 0;
  for (let row = i + 1; row < n; row++) {
    const currentTree = trees[row][j];
    if (currentTree < tree) treesVisibleFromBottom++;
    else {
      treesVisibleFromBottom++;
      break;
    }
  }

  let treesVisibleFromLeft = 0;
  for (let col = j - 1; col >= 0; col--) {
    const currentTree = trees[i][col];
    if (currentTree < tree) treesVisibleFromLeft++;
    else {
      treesVisibleFromLeft++;
      break;
    }
  }

  let treesVisibleFromRight = 0;
  for (let col = j + 1; col < m; col++) {
    const currentTree = trees[i][col];
    if (currentTree < tree) treesVisibleFromRight++;
    else {
      treesVisibleFromRight++;
      break;
    }
  }

  return (
    treesVisibleFromUp *
    treesVisibleFromBottom *
    treesVisibleFromLeft *
    treesVisibleFromRight
  );
};

const part1 = (rawInput: string) => {
  const trees = parseInput(rawInput);
  const n = trees.length;
  const m = trees[0].length;

  let count = n * 2 + (m - 2) * 2;
  for (let i = 1; i < n - 1; i++) {
    for (let j = 1; j < m - 1; j++) {
      if (isVisible(trees, i, j)) count++;
    }
  }

  return count;
};

const part2 = (rawInput: string) => {
  const trees = parseInput(rawInput);
  const n = trees.length;
  const m = trees[0].length;
  const scores = trees.map((it) => it.map((_) => 0));

  for (let i = 1; i < n - 1; i++) {
    for (let j = 1; j < m - 1; j++) {
      scores[i][j] = getViewScore(trees, i, j);
    }
  }

  return _.max(scores.map(_.max));
};

run({
  part1: {
    tests: [
      {
        input: `
        30373
        25512
        65332
        33549
        35390
      `,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        30373
        25512
        65332
        33549
        35390
      `,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
