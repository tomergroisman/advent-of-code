import run from 'aocrunner';
import _ from 'lodash';

const parseInput = (rawInput: string) => rawInput.split(',').map(parseFloat);

const simulate = (cycles: number[], days: number = 80) => {
  const simulateDay = (cycles: number[]) => {
    const existingFish: number = cycles.length;
    for (let i = 0; i < existingFish; i++) {
      const currentFishCycle: number = cycles[i]--;
      if (currentFishCycle == 0) {
        cycles[i] = 6;
        cycles.push(8);
      }
    }
  };

  for (let i = 0; i < days; i++) {
    simulateDay(cycles);
  }
};

const calculateFishCount = (cycles: number[], days: number = 80): number => {
  const fishCycleCount = new Array(9).fill(0);
  for (const fishCycle of cycles) {
    fishCycleCount[fishCycle]++;
  }

  for (let i = 0; i < days; i++) {
    const fishToDouble = fishCycleCount.shift();
    fishCycleCount.push(fishToDouble);
    fishCycleCount[6] += fishToDouble;
  }

  return _.sum(fishCycleCount);
};

const part1 = (rawInput: string) => {
  let cycles = parseInput(rawInput);
  simulate(cycles);

  return cycles.length;
};

const part2 = (rawInput: string) => {
  let cycles = parseInput(rawInput);

  return calculateFishCount(cycles, 256);
};

run({
  part1: {
    tests: [
      {
        input: `3,4,3,1,2`,
        expected: 5934,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `3,4,3,1,2`,
        expected: 26984457539,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
