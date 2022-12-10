import run from 'aocrunner';
import _ from 'lodash';

enum Action {
  addx = 'addx',
  noop = 'noop',
}

import { string } from '../utils/index.js';

const parseInput = (rawInput: string) => {
  return string
    .splitRows(rawInput)
    .map((it) => [it.split(' ')[0] as Action, parseFloat(it.split(' ')[1])]);
};

const execute = (
  command: (Action | number)[],
  x: number[],
  cyclesCount: number[],
) => {
  const action = command[0] as Action;
  const payload = command[1] as number;

  cyclesCount[0]++;
  cyclesCount[1]++;

  x[0] = x[1];

  if (action === Action.addx) {
    cyclesCount[0]++;
    cyclesCount[1]++;
    x[1] += payload;
  }
};

const executeVerbose = (command: (Action | number)[], x: number[]) => {
  const action = command[0] as Action;
  const payload = command[1] as number;

  x.push(_.last(x)!);

  if (action === Action.addx) {
    x.push(_.last(x)! + payload);
  }
};

const isSpriteOverlap = (x: number, cycleCount: number) => {
  return [x - 1, x, x + 1].includes(cycleCount);
};

const part1 = (rawInput: string) => {
  const program = parseInput(rawInput);
  const x = [NaN, 1];
  const cyclesCount = [0, 1]; // two last cycles;
  let lastSumAddedCycle = 0;
  let sum = 0;

  for (const command of program) {
    execute(command, x, cyclesCount);

    if (cyclesCount[0] !== lastSumAddedCycle) {
      if ((cyclesCount[0] - 20) % 40 === 0) {
        sum += cyclesCount[0] * x[0];
        lastSumAddedCycle = cyclesCount[0];
      }
    }
    if (cyclesCount[1] !== lastSumAddedCycle) {
      if ((cyclesCount[1] - 20) % 40 === 0) {
        sum += cyclesCount[1] * x[1];
        lastSumAddedCycle = cyclesCount[1];
      }
    }
  }

  return sum;
};

const part2 = (rawInput: string) => {
  const program = parseInput(rawInput);
  const x = [1];
  const crt = new Array(6).fill(0).map((_) => new Array(40).fill(''));

  for (const command of program) {
    executeVerbose(command, x);
  }

  for (let i = 0; i < x.length - 1; i++) {
    const currentX = x[i];
    const crtRow = Math.floor(i / 40);
    const crtColumn = i % 40;

    if (isSpriteOverlap(currentX, i % 40)) {
      crt[crtRow][crtColumn] = '#';
    } else {
      crt[crtRow][crtColumn] = '.';
    }
  }

  console.log(crt.map((it) => it.join(' ')));
};

run({
  part1: {
    tests: [
      {
        input: `
        addx 15
        addx -11
        addx 6
        addx -3
        addx 5
        addx -1
        addx -8
        addx 13
        addx 4
        noop
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx -35
        addx 1
        addx 24
        addx -19
        addx 1
        addx 16
        addx -11
        noop
        noop
        addx 21
        addx -15
        noop
        noop
        addx -3
        addx 9
        addx 1
        addx -3
        addx 8
        addx 1
        addx 5
        noop
        noop
        noop
        noop
        noop
        addx -36
        noop
        addx 1
        addx 7
        noop
        noop
        noop
        addx 2
        addx 6
        noop
        noop
        noop
        noop
        noop
        addx 1
        noop
        noop
        addx 7
        addx 1
        noop
        addx -13
        addx 13
        addx 7
        noop
        addx 1
        addx -33
        noop
        noop
        noop
        addx 2
        noop
        noop
        noop
        addx 8
        noop
        addx -1
        addx 2
        addx 1
        noop
        addx 17
        addx -9
        addx 1
        addx 1
        addx -3
        addx 11
        noop
        noop
        addx 1
        noop
        addx 1
        noop
        noop
        addx -13
        addx -19
        addx 1
        addx 3
        addx 26
        addx -30
        addx 12
        addx -1
        addx 3
        addx 1
        noop
        noop
        noop
        addx -9
        addx 18
        addx 1
        addx 2
        noop
        noop
        addx 9
        noop
        noop
        noop
        addx -1
        addx 2
        addx -37
        addx 1
        addx 3
        noop
        addx 15
        addx -21
        addx 22
        addx -6
        addx 1
        noop
        addx 2
        addx 1
        noop
        addx -10
        noop
        noop
        addx 20
        addx 1
        addx 2
        addx 2
        addx -6
        addx -11
        noop
        noop
        noop
      `,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        addx 15
        addx -11
        addx 6
        addx -3
        addx 5
        addx -1
        addx -8
        addx 13
        addx 4
        noop
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx -35
        addx 1
        addx 24
        addx -19
        addx 1
        addx 16
        addx -11
        noop
        noop
        addx 21
        addx -15
        noop
        noop
        addx -3
        addx 9
        addx 1
        addx -3
        addx 8
        addx 1
        addx 5
        noop
        noop
        noop
        noop
        noop
        addx -36
        noop
        addx 1
        addx 7
        noop
        noop
        noop
        addx 2
        addx 6
        noop
        noop
        noop
        noop
        noop
        addx 1
        noop
        noop
        addx 7
        addx 1
        noop
        addx -13
        addx 13
        addx 7
        noop
        addx 1
        addx -33
        noop
        noop
        noop
        addx 2
        noop
        noop
        noop
        addx 8
        noop
        addx -1
        addx 2
        addx 1
        noop
        addx 17
        addx -9
        addx 1
        addx 1
        addx -3
        addx 11
        noop
        noop
        addx 1
        noop
        addx 1
        noop
        noop
        addx -13
        addx -19
        addx 1
        addx 3
        addx 26
        addx -30
        addx 12
        addx -1
        addx 3
        addx 1
        noop
        noop
        noop
        addx -9
        addx 18
        addx 1
        addx 2
        noop
        noop
        addx 9
        noop
        noop
        noop
        addx -1
        addx 2
        addx -37
        addx 1
        addx 3
        noop
        addx 15
        addx -21
        addx 22
        addx -6
        addx 1
        noop
        addx 2
        addx 1
        noop
        addx -10
        noop
        noop
        addx 20
        addx 1
        addx 2
        addx 2
        addx -6
        addx -11
        noop
        noop
        noop
      `,
        expected: '',
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
