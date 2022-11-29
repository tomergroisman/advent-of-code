import run from 'aocrunner';

import { number, string } from '../utils/index.js';

function getMostCommonBit(binaryNumbers: string[]) {
  const binaryLength: number = binaryNumbers[0].length;
  const bitsSum: number[][] = [
    new Array(binaryLength).fill(0),
    new Array(binaryLength).fill(0),
  ];

  for (const binaryNumber of binaryNumbers) {
    [...binaryNumber].forEach((bitString, index) => {
      const bit: number = parseFloat(bitString);
      bitsSum[bit][index]++;
    });
  }

  let res = '';
  for (let i = 0; i < binaryLength; i++) {
    const bit: string = bitsSum[0][i] > bitsSum[1][i] ? '0' : '1';
    res += bit;
  }

  return res;
}

function flipBits(binaryNumber: string) {
  return [...binaryNumber].map((it) => (it === '0' ? '1' : '0')).join('');
}

function getOxygenGeneratorRatingBinary(binaryNumbers: string[]) {
  const binaryLength: number = binaryNumbers[0].length;
  let oxygenGeneratorRatingCandidates: string[] = binaryNumbers;

  for (let i = 0; i < binaryLength; i++) {
    const bitsSum: number[] = [0, 0];
    for (const binaryNumber of oxygenGeneratorRatingCandidates) {
      const bit: number = parseFloat(binaryNumber[i]);
      bitsSum[bit]++;
    }
    const mostCommonBit: string = bitsSum[0] > bitsSum[1] ? '0' : '1';
    oxygenGeneratorRatingCandidates = oxygenGeneratorRatingCandidates.filter(
      (it) => it[i] === mostCommonBit,
    );
    if (oxygenGeneratorRatingCandidates.length === 1)
      return oxygenGeneratorRatingCandidates[0];
  }
  return oxygenGeneratorRatingCandidates[0];
}

function getC02ScrubberRatingBinary(binaryNumbers: string[]) {
  const binaryLength: number = binaryNumbers[0].length;
  let c02ScrubberRatingCandidates: string[] = binaryNumbers;

  for (let i = 0; i < binaryLength; i++) {
    const bitsSum: number[] = [0, 0];
    for (const binaryNumber of c02ScrubberRatingCandidates) {
      const bit: number = parseFloat(binaryNumber[i]);
      bitsSum[bit]++;
    }
    const leastCommonBit: string = bitsSum[0] <= bitsSum[1] ? '0' : '1';
    c02ScrubberRatingCandidates = c02ScrubberRatingCandidates.filter(
      (it) => it[i] === leastCommonBit,
    );
    if (c02ScrubberRatingCandidates.length === 1)
      return c02ScrubberRatingCandidates[0];
  }
  return c02ScrubberRatingCandidates[0];
}

const parseInput = (rawInput: string) => {
  return string.splitRows(rawInput);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const mostCommonBit: string = getMostCommonBit(input);
  const leastCommonBit: string = flipBits(mostCommonBit);

  const gammaRate: number = number.binaryToDecimal(mostCommonBit);
  const epsilonRate: number = number.binaryToDecimal(leastCommonBit);

  return gammaRate * epsilonRate;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const oxygenGeneratorRatingBinary: string =
    getOxygenGeneratorRatingBinary(input);
  const c02ScrubberRatingBinary: string = getC02ScrubberRatingBinary(input);

  const oxygenGeneratorRating: number = number.binaryToDecimal(
    oxygenGeneratorRatingBinary,
  );
  const c02ScrubberRating: number = number.binaryToDecimal(
    c02ScrubberRatingBinary,
  );

  return oxygenGeneratorRating * c02ScrubberRating;
};

run({
  part1: {
    tests: [
      {
        input: `
        00100
        11110
        10110
        10111
        10101
        01111
        00111
        11100
        10000
        11001
        00010
        01010
        `,
        expected: 198,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        00100
        11110
        10110
        10111
        10101
        01111
        00111
        11100
        10000
        11001
        00010
        01010
        `,
        expected: 230,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
