import run from 'aocrunner';

import { matrix, string } from '../utils/index.js';

const parseInput = (rawInput: string) => {
  const energies = string
    .splitRows(rawInput)
    .map((row) => row.split('').map(parseFloat));
  return matrix.padWith(energies, -Infinity);
};

const increaseEnergies = (energies: number[][]) => {
  for (let i = 0; i < energies.length; i++) {
    for (let j = 0; j < energies[0].length; j++) {
      energies[i][j]++;
    }
  }
};

const flash = (energies: number[][], i: number, j: number) => {
  energies[i][j] = -Infinity;

  if (++energies[i - 1][j - 1] > 9) flash(energies, i - 1, j - 1);
  if (++energies[i - 1][j] > 9) flash(energies, i - 1, j);
  if (++energies[i - 1][j + 1] > 9) flash(energies, i - 1, j + 1);
  if (++energies[i][j - 1] > 9) flash(energies, i, j - 1);
  if (++energies[i][j + 1] > 9) flash(energies, i, j + 1);
  if (++energies[i + 1][j - 1] > 9) flash(energies, i + 1, j - 1);
  if (++energies[i + 1][j] > 9) flash(energies, i + 1, j);
  if (++energies[i + 1][j + 1] > 9) flash(energies, i + 1, j + 1);
};

const triggerFlashes = (energies: number[][]) => {
  for (let i = 0; i < energies.length; i++) {
    for (let j = 0; j < energies[0].length; j++) {
      const energy = energies[i][j];
      if (energy > 9) {
        flash(energies, i, j);
      }
    }
  }
};

const runStepAndGetNumberOfFlashes = (energies: number[][]): number => {
  increaseEnergies(energies);

  triggerFlashes(energies);

  let numberOfFlashes = 0;
  for (let i = 1; i < energies.length - 1; i++) {
    for (let j = 1; j < energies[0].length - 1; j++) {
      const energy = energies[i][j];
      if (energy === -Infinity) {
        numberOfFlashes++;
        energies[i][j] = 0;
      }
    }
  }

  return numberOfFlashes;
};

const part1 = (rawInput: string) => {
  const energies = parseInput(rawInput);

  let totalFlashes = 0;
  for (let i = 0; i < 100; i++) {
    totalFlashes += runStepAndGetNumberOfFlashes(energies);
  }

  return totalFlashes;
};

const part2 = (rawInput: string) => {
  const energies = parseInput(rawInput);

  let hasAllFlashed = false;
  let steps = 0;
  while (!hasAllFlashed) {
    runStepAndGetNumberOfFlashes(energies);
    steps++;

    let isAllEnergiesZero = true;
    for (let i = 1; i < energies.length - 1; i++) {
      for (let j = 1; j < energies[0].length - 1; j++) {
        const energy = energies[i][j];

        if (energy !== 0) {
          isAllEnergiesZero = false;
        }
      }
    }

    hasAllFlashed = isAllEnergiesZero;
  }

  return steps;
};

run({
  part1: {
    tests: [
      {
        input: `
        5483143223
        2745854711
        5264556173
        6141336146
        6357385478
        4167524645
        2176841721
        6882881134
        4846848554
        5283751526
        `,
        expected: 1656,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        5483143223
        2745854711
        5264556173
        6141336146
        6357385478
        4167524645
        2176841721
        6882881134
        4846848554
        5283751526
        `,
        expected: 195,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
