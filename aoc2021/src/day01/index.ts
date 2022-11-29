import run from 'aocrunner';
import { splitRows } from '../utils';

const parseInput = (rawInput: string): number[] =>
  splitRows(rawInput).map(parseFloat);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let res: number = 0;
  let prevMeasurement: number | null = null;

  for (const measurement of input) {
    const isNotFirstMeasurement: boolean = prevMeasurement != null;

    if (isNotFirstMeasurement) {
      const isIncreased: boolean = prevMeasurement! < measurement;
      if (isIncreased) {
        res++;
      }
    }
    prevMeasurement = measurement;
  }

  return res;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const windows: number[][] = input
    .slice(0, input.length - 2)
    .map((_, index) => {
      return [input[index], input[index + 1], input[index + 2]];
    });

  let res: number = 0;
  let prevWindowSum: number | null = null;

  for (const window of windows) {
    const windowSum = window.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0,
    );
    const isNotFirstWindow: boolean = prevWindowSum != null;

    if (isNotFirstWindow) {
      const isIncreased: boolean = prevWindowSum! < windowSum;
      if (isIncreased) {
        res++;
      }
    }
    prevWindowSum = windowSum;
  }

  return res;
};

run({
  part1: {
    tests: [
      {
        input: `
        100
        105
        106
        105
        110
        110
        `,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        199
        200
        208
        210
        200
        207
        240
        269
        260
        263
        `,
        expected: 5,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
