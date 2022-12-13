import run from 'aocrunner';
import _ from 'lodash';

import { string } from '../utils/index.js';

type Signal = (number | number[])[];

const parseInput = (rawInput: string) => {
  return string
    .splitDelimiter(rawInput, '\n\n')
    .map((it) => string.splitRows(it).map((it) => JSON.parse(it)));
};

const compare = (signal: Signal[]): boolean | undefined => {
  const [left, right] = signal;

  for (let i = 0; i < right.length; i++) {
    const leftElement = left[i];
    const rightElement = right[i];

    const hasLeftEnded = leftElement === undefined;
    if (hasLeftEnded) {
      return true;
    }

    const isLeftNumber = typeof leftElement === 'number';
    const isRightNumber = typeof rightElement === 'number';
    if (isLeftNumber && isRightNumber) {
      if (leftElement !== rightElement) {
        return leftElement < rightElement;
      }
    }

    const isLeftArray = _.isArray(leftElement);
    const isRightArray = _.isArray(rightElement);
    if (isLeftArray && isRightArray) {
      const result = compare([leftElement, rightElement]);
      if (result !== undefined) {
        return result;
      }
    }

    if (isLeftArray && isRightNumber) {
      const result = compare([leftElement, [rightElement]]);
      if (result !== undefined) {
        return result;
      }
    }

    if (isLeftNumber && isRightArray) {
      const result = compare([[leftElement], rightElement]);
      if (result !== undefined) {
        return result;
      }
    }
  }

  if (left.length > right.length) {
    return false;
  }
};

const sort = (a: Signal, b: Signal): number => {
  const isRightOrder = compare([a, b]);

  if (isRightOrder === undefined) {
    return 0;
  }
  return isRightOrder ? -1 : 1;
};

const getArrayDepth = <T>(value: Array<T> | T): number => {
  return Array.isArray(value)
    ? 1 + Math.max(0, ...value.map(getArrayDepth))
    : 0;
};

const part1 = (rawInput: string) => {
  const signals = parseInput(rawInput);
  const indices: number[] = [];

  signals.forEach((signal, index) => {
    if (compare(signal)) {
      indices.push(index + 1);
    }
  });

  return _.sum(indices);
};

const part2 = (rawInput: string) => {
  const signals: Signal[][] = parseInput(rawInput);
  const packets: Signal[] = [];

  signals.forEach((signal) => {
    packets.push(signal[0], signal[1]);
  });
  packets.push([[2]], [[6]]);

  const sorted = packets.sort(sort);

  return (
    // @ts-ignore
    (sorted.findIndex((it) => it?.[0]?.[0] === 2) + 1) *
    // @ts-ignore
    (sorted.findIndex((it) => it?.[0]?.[0] === 6) + 1)
  );
};

run({
  part1: {
    tests: [
      {
        input: `
        [1,1,3,1,1]
        [1,1,5,1,1]
        
        [[1],[2,3,4]]
        [[1],4]
        
        [9]
        [[8,7,6]]
        
        [[4,4],4,4]
        [[4,4],4,4,4]
        
        [7,7,7,7]
        [7,7,7]
        
        []
        [3]
        
        [[[]]]
        [[]]
        
        [1,[2,[3,[4,[5,6,7]]]],8,9]
        [1,[2,[3,[4,[5,6,0]]]],8,9]
        `,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        [1,1,3,1,1]
        [1,1,5,1,1]
        
        [[1],[2,3,4]]
        [[1],4]
        
        [9]
        [[8,7,6]]
        
        [[4,4],4,4]
        [[4,4],4,4,4]
        
        [7,7,7,7]
        [7,7,7]
        
        []
        [3]
        
        [[[]]]
        [[]]
        
        [1,[2,[3,[4,[5,6,7]]]],8,9]
        [1,[2,[3,[4,[5,6,0]]]],8,9]
        `,
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
