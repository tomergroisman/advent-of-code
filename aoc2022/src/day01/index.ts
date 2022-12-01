import run from 'aocrunner';

import { number } from '../utils/index.js';

const parseInput = (rawInput: string): number[][] => {
  return rawInput.split('\n\n').map((it) => it.split('\n').map(parseFloat));
};

const part1 = (rawInput: string) => {
  const elvesCalories: number[][] = parseInput(rawInput);
  let maxCalories: number = 0;

  for (const elfCalories of elvesCalories) {
    const elfCaloriesSum: number = number.sumArray(elfCalories);
    maxCalories = Math.max(elfCaloriesSum, maxCalories);
  }

  return maxCalories;
};

const part2 = (rawInput: string) => {
  const elvesCalories: number[][] = parseInput(rawInput);
  const caloriesSums: number[] = elvesCalories
    .map(number.sumArray)
    .sort((a, b) => b - a);

  return number.sumArray(caloriesSums.slice(0, 3));
};

run({
  part1: {
    tests: [
      {
        input: `
        1000
        2000
        3000
        
        4000
        
        5000
        6000
        
        7000
        8000
        9000
        
        10000`,
        expected: 24000,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        1000
        2000
        3000
        
        4000
        
        5000
        6000
        
        7000
        8000
        9000
        
        10000`,
        expected: 45000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
