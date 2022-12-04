import run from 'aocrunner';
import _ from 'lodash';

import { matrix, string } from '../utils/index.js';

const parseInput = (rawInput: string): number[][] => {
  const points: number[][] = string
    .splitRows(rawInput)
    .map((it) => it.split('').map(parseFloat));
  return matrix.padWith(points, Infinity);
};

const isLowPoint = (
  paddedPoints: number[][],
  i: number,
  j: number,
): boolean => {
  const point: number = paddedPoints[i][j];
  const top: number = paddedPoints[i - 1][j];
  const right: number = paddedPoints[i][j + 1];
  const bottom: number = paddedPoints[i + 1][j];
  const left: number = paddedPoints[i][j - 1];

  const isLowerThanTop: boolean = point < top;
  const isLowerThanRight: boolean = point < right;
  const isLowerThanBottom: boolean = point < bottom;
  const isLowerThanLeft: boolean = point < left;
  return (
    isLowerThanTop && isLowerThanRight && isLowerThanBottom && isLowerThanLeft
  );
};

const getLowPointsFromPaddedPoints = (paddedPoints: number[][]): number[] => {
  const lowPoints: number[] = [];
  const numberOfRows: number = paddedPoints.length - 2; // Remove padding entries
  const numberOfPointsInRow: number = paddedPoints[0].length - 2; // Remove padding entries

  for (let i = 1; i <= numberOfRows; i++) {
    for (let j = 1; j <= numberOfPointsInRow; j++) {
      const point: number = paddedPoints[i][j];

      if (isLowPoint(paddedPoints, i, j)) {
        lowPoints.push(point);
      }
    }
  }

  return lowPoints.map((it) => it + 1);
};

const basinize = (
  paddedPoints: number[][],
  i: number,
  j: number,
  basinSize: number,
): number => {
  const point: number = paddedPoints[i][j];

  if (point === 9 || point === Infinity) {
    return basinSize;
  }

  paddedPoints[i][j] = Infinity;

  return (
    1 +
    (basinize(paddedPoints, i - 1, j, basinSize) +
      basinize(paddedPoints, i, j + 1, basinSize) +
      basinize(paddedPoints, i + 1, j, basinSize) +
      basinize(paddedPoints, i, j - 1, basinSize))
  );
};

const getBasinSizesFromPaddedPoints = (paddedPoints: number[][]): number[] => {
  const basinSizes: number[] = [];
  const numberOfRows: number = paddedPoints.length - 2; // Remove padding entries
  const numberOfPointsInRow: number = paddedPoints[0].length - 2; // Remove padding entries

  for (let i = 1; i <= numberOfRows; i++) {
    for (let j = 1; j <= numberOfPointsInRow; j++) {
      if (isLowPoint(paddedPoints, i, j)) {
        const basinSize: number = basinize(_.cloneDeep(paddedPoints), i, j, 0)!;
        basinSizes.push(basinSize);
      }
    }
  }

  return basinSizes;
};

const part1 = (rawInput: string) => {
  const paddedPoints = parseInput(rawInput);

  const lowPoints = getLowPointsFromPaddedPoints(paddedPoints);

  return _.sum(lowPoints);
};

const part2 = (rawInput: string) => {
  const paddedPoints = parseInput(rawInput);

  const topBasinSizes = getBasinSizesFromPaddedPoints(paddedPoints)
    .sort((a, b) => b - a)
    .slice(0, 3);

  return topBasinSizes[0] * topBasinSizes[1] * topBasinSizes[2];
};

run({
  part1: {
    tests: [
      {
        input: `
        2199943210
        3987894921
        9856789892
        8767896789
        9899965678
        `,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        2199943210
        3987894921
        9856789892
        8767896789
        9899965678
        `,
        expected: 1134,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
