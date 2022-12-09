import run from 'aocrunner';
import _ from 'lodash';

import { string } from '../utils/index.js';

enum Direction {
  UP = 'U',
  RIGHT = 'R',
  DOWN = 'D',
  LEFT = 'L',
}

type Step = { direction: Direction; n: number };

type Position = { x: number; y: number };

const parseInput = (rawInput: string): Step[] => {
  return string.splitRows(rawInput).map((it) => ({
    direction: it.split(' ')[0] as Direction,
    n: parseFloat(it.split(' ')[1]),
  }));
};

const extractKey = (position: Position) => {
  return `${position.x},${position.y}`;
};

const moveHeadAndTailStep = (
  step: Step,
  headPosition: Position,
  tailPosition: Position,
  tailVisits: Record<string, boolean>,
) => {
  for (let i = 0; i < step.n; i++) {
    moveHead(step.direction, headPosition);
    moveTail(headPosition, tailPosition, tailVisits);
  }
};

const moveHead = (direction: Direction, headPosition: Position) => {
  if (direction === Direction.UP) headPosition.y++;
  if (direction === Direction.RIGHT) headPosition.x++;
  if (direction === Direction.DOWN) headPosition.y--;
  if (direction === Direction.LEFT) headPosition.x--;
};

const moveTail = (
  headPosition: Position,
  tailPosition: Position,
  tailVisits?: Record<string, boolean>,
) => {
  const yDelta = headPosition.y - tailPosition.y;
  const xDelta = headPosition.x - tailPosition.x;
  if (Math.abs(yDelta) === 2) {
    tailPosition.y += yDelta / 2;
    if (tailPosition.x != headPosition.x) {
      tailPosition.x += headPosition.x - tailPosition.x > 0 ? 1 : -1;
    }
  } else if (Math.abs(xDelta) === 2) {
    tailPosition.x += xDelta / 2;
    if (tailPosition.y != headPosition.y) {
      tailPosition.y += headPosition.y - tailPosition.y > 0 ? 1 : -1;
    }
  }

  if (!!tailVisits) {
    tailVisits[extractKey(tailPosition)] = true;
  }
};

const moveKnotsStep = (
  step: Step,
  knots: Position[],
  tailVisits: Record<string, boolean>,
) => {
  for (let i = 0; i < step.n; i++) {
    const headPosition = knots[0];
    moveHead(step.direction, headPosition);
    for (let j = 0; j < 9; j++) {
      const headPosition = knots[j];
      const tailPosition = knots[j + 1];
      moveTail(headPosition, tailPosition, j + 1 == 9 ? tailVisits : undefined);
    }
  }
};

const part1 = (rawInput: string) => {
  const steps = parseInput(rawInput);

  const headPosition: Position = { x: 0, y: 0 };
  const tailPosition: Position = { x: 0, y: 0 };
  const tailVisits: Record<string, boolean> = {
    [extractKey(tailPosition)]: true,
  };

  for (const step of steps) {
    moveHeadAndTailStep(step, headPosition, tailPosition, tailVisits);
  }

  return _.keys(tailVisits).length;
};

const part2 = (rawInput: string) => {
  const steps = parseInput(rawInput);

  const knots = new Array(10).fill(0).map((_) => ({ x: 0, y: 0 }));
  const tailVisits: Record<string, boolean> = {
    [extractKey(knots[9])]: true,
  };

  for (const step of steps) {
    moveKnotsStep(step, knots, tailVisits);
  }

  return _.keys(tailVisits).length;
};

run({
  part1: {
    tests: [
      {
        input: `
        R 4
        U 4
        L 3
        D 1
        R 4
        D 1
        L 5
        R 2
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
        R 5
        U 8
        L 8
        D 3
        R 17
        D 10
        L 25
        U 20
        `,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
