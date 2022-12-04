import run from 'aocrunner';
import _ from 'lodash';

import { string } from '../utils/index.js';

const parseInput = (rawInput: string) => {
  return string
    .splitRows(rawInput)
    .map((it) =>
      string
        .splitComma(it)
        .map((it) => string.splitDelimiter(it, '-').map(parseFloat)),
    );
};

const part1 = (rawInput: string) => {
  const pairs = parseInput(rawInput);

  const overlaps = pairs.filter((pair) => {
    const maxFirst = _.max(pair[0])!;
    const minFirst = _.min(pair[0])!;
    const maxSecond = _.max(pair[1])!;
    const minSecond = _.min(pair[1])!;

    const isSecondFullyContain = minFirst <= minSecond && maxSecond <= maxFirst;
    const isFirstFullyContain = minSecond <= minFirst && maxFirst <= maxSecond;

    return isSecondFullyContain || isFirstFullyContain;
  });

  return overlaps.length;
};

const part2 = (rawInput: string) => {
  const pairs = parseInput(rawInput);

  const overlaps = pairs.filter((pair) => {
    const maxFirst = _.max(pair[0])!;
    const minFirst = _.min(pair[0])!;
    const maxSecond = _.max(pair[1])!;
    const minSecond = _.min(pair[1])!;

    const isSecondOverlap =
      (minFirst <= minSecond && minSecond <= maxFirst) ||
      (minFirst <= maxSecond && maxSecond <= maxFirst);
    const isFirstOverlap =
      (minSecond <= minFirst && minFirst <= maxSecond) ||
      (minSecond <= maxFirst && maxFirst <= maxSecond);

    return isSecondOverlap || isFirstOverlap;
  });

  return overlaps.length;
};

run({
  part1: {
    tests: [
      {
        input: `
        2-4,6-8
        2-3,4-5
        5-7,7-9
        2-8,3-7
        6-6,4-6
        2-6,4-8
        `,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        2-4,6-8
        2-3,4-5
        5-7,7-9
        2-8,3-7
        6-6,4-6
        2-6,4-8
        `,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
