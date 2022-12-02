import run from 'aocrunner';
import _ from 'lodash';

import { string } from '../utils/index.js';

const parseInput = (rawInput: string) =>
  string.splitComma(rawInput).map(parseFloat);

const part1 = (rawInput: string) => {
  const positions: number[] = parseInput(rawInput).sort((a, b) => a - b);

  const numberOfCrabs: number = positions.length;
  const midpoint: number = Math.floor(numberOfCrabs / 2);
  const median: number = positions[midpoint];

  let fuelSum = 0;
  for (const position of positions) {
    fuelSum += Math.abs(position - median);
  }

  return fuelSum;
};

const part2 = (rawInput: string) => {
  const positions: number[] = parseInput(rawInput);
  const meanCeil: number = Math.ceil(_.mean(positions));
  const meanFloor: number = Math.floor(_.mean(positions));

  let fuelSumCeilMean: number = 0;
  let fuelSumFloorMean: number = 0;
  for (const position of positions) {
    const stepsCeilMean: number = Math.abs(position - meanCeil);
    const stepsFloorMean: number = Math.abs(position - meanFloor);
    let fuelCeilMean: number = 0;
    let fuelFloorMean: number = 0;
    for (let i = 1; i <= stepsCeilMean; i++) {
      fuelCeilMean += i;
    }
    for (let i = 1; i <= stepsFloorMean; i++) {
      fuelFloorMean += i;
    }
    fuelSumCeilMean += fuelCeilMean;
    fuelSumFloorMean += fuelFloorMean;
  }

  return Math.min(fuelSumCeilMean, fuelSumFloorMean);
};

run({
  part1: {
    tests: [
      {
        input: `16,1,2,0,4,2,7,1,2,14`,
        expected: 37,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `16,1,2,0,4,2,7,1,2,14`,
        expected: 168,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
