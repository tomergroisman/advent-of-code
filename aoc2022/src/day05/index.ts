import run from 'aocrunner';

import { string } from '../utils/index.js';

const parseInput = (rawInput: string) => {
  const [rawCrates, rawSteps] = string.splitDelimiter(rawInput, '\n\n');
  const reversedCrates = string
    .splitRows(rawCrates)
    .slice(0, -1)
    .map((it) =>
      it
        .replace(/\s\s\s\s/g, '[]')
        .replace(/\s/g, '')
        .replace(/\[/g, '["')
        .replace(/]/g, '"] ')
        .slice(0, -1)
        .split(' ')
        .map((it) => JSON.parse(it)),
    );

  const crates: string[][] = [];
  for (let j = 0; j < reversedCrates[0].length; j++) {
    crates.push([]);
    for (let i = 0; i < reversedCrates.length; i++) {
      const crate = reversedCrates[i][j][0];
      if (!!crate) {
        crates[j].unshift(crate);
      }
    }
  }

  return {
    crates: crates,
    steps: string.splitRows(rawSteps).map((it) =>
      it
        .replace(/[a-zA-Z]/g, '')
        .slice(1)
        .split('  ')
        .map(parseFloat),
    ),
  };
};

const move = (
  startStack: number,
  endStack: number,
  n: number,
  crates: string[][],
) => {
  for (let i = 0; i < n; i++) {
    const crate = crates[startStack].pop()!;
    crates[endStack].push(crate);
  }
};

const moveSaveOrder = (
  startStack: number,
  endStack: number,
  n: number,
  crates: string[][],
) => {
  const numberOfCratesInStack = crates[startStack].length;
  const startIndex = numberOfCratesInStack - n;
  const cratesToMove = crates[startStack].slice(startIndex);
  crates[startStack].splice(startIndex, n);
  crates[endStack].push(...cratesToMove);
};

const getTopCrateLetters = (crates: string[][]) => {
  let letters = '';
  for (const crate of crates) {
    const crateLetter = crate.pop();
    if (crateLetter) {
      letters += crateLetter;
    }
  }

  return letters;
};

const part1 = (rawInput: string) => {
  const { crates, steps } = parseInput(rawInput);

  for (const step of steps) {
    const n: number = step[0];
    const startStack: number = step[1] - 1;
    const endStack: number = step[2] - 1;
    move(startStack, endStack, n, crates);
  }

  return getTopCrateLetters(crates);
};

const part2 = (rawInput: string) => {
  const { crates, steps } = parseInput(rawInput);

  for (const step of steps) {
    const n: number = step[0];
    const startStack: number = step[1] - 1;
    const endStack: number = step[2] - 1;
    moveSaveOrder(startStack, endStack, n, crates);
  }

  return getTopCrateLetters(crates);
};

run({
  part1: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: 'CMZ',
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: 'MCD',
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
