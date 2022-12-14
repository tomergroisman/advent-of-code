import run from 'aocrunner';
import _ from 'lodash';

import { string } from '../utils/index.js';

interface Point {
  x: number;
  y: number;
}

type Blocked = Record<string, boolean>;

const extractKey = (point: Point) => {
  return `${point.x},${point.y}`;
};

const blockPoint = (blocked: Blocked, point: Point) => {
  blocked[extractKey(point)] = true;
};

const parseInput = (rawInput: string) => {
  const blocked: Record<string, boolean> = {};
  const points: Point[][] = string.splitRows(rawInput).map((it) =>
    it
      .replace('\n', '')
      .split(' -> ')
      .map((it) => {
        const [x, y] = it.split(',').map(parseFloat);
        return { x, y };
      }),
  );

  let lowestBlock = 0;
  for (let pointView of points) {
    for (let i = 0; i < pointView.length - 1; i++) {
      const start = pointView[i];
      const end = pointView[i + 1];

      lowestBlock = Math.max(lowestBlock, start.y, end.y);

      const isHorizontal = start.x !== end.x;

      if (isHorizontal) {
        const isRight = start.x - end.x < 0;
        if (isRight) {
          for (let x = start.x; x <= end.x; x++) {
            blockPoint(blocked, { x, y: start.y });
          }
        } else {
          for (let x = end.x; x <= start.x; x++) {
            blockPoint(blocked, { x, y: start.y });
          }
        }
      } else {
        const isDown = start.y - end.y < 0;
        if (isDown) {
          for (let y = start.y; y <= end.y; y++) {
            blockPoint(blocked, { x: start.x, y });
          }
        } else {
          for (let y = end.y; y <= start.y; y++) {
            blockPoint(blocked, { x: start.x, y });
          }
        }
      }
    }
  }

  return { blocked, lowestBlock };
};

const isPointBlocked = (
  blocked: Blocked,
  point: Point,
  floorLevel?: number,
) => {
  if (point.y === floorLevel) return true;
  return blocked[extractKey(point)];
};

const START_POINT: Point = { x: 500, y: 0 };
const restSand = (
  blocked: Blocked,
  lowestBlock: number,
  hasFloor?: boolean,
): Point | null => {
  let isBlocked = false;
  let currentPoint = _.cloneDeep(START_POINT);
  const floorLevel = hasFloor ? lowestBlock + 2 : undefined;

  while (!isBlocked) {
    if (!hasFloor && currentPoint.y > lowestBlock) return null;
    const nextPoint = _.cloneDeep(currentPoint);

    // Try down
    nextPoint.y++;
    if (!isPointBlocked(blocked, nextPoint, floorLevel)) {
      currentPoint = nextPoint;
    } else {
      // Try left
      nextPoint.x--;
      if (!isPointBlocked(blocked, nextPoint, floorLevel)) {
        currentPoint = nextPoint;
      } else {
        // Try right
        nextPoint.x += 2;
        if (!isPointBlocked(blocked, nextPoint, floorLevel)) {
          currentPoint = nextPoint;
        } else {
          isBlocked = true;
          currentPoint = { x: nextPoint.x - 1, y: nextPoint.y - 1 };
        }
      }
    }
  }

  blockPoint(blocked, currentPoint);
  return currentPoint;
};

const isStartPoint = (point: Point) => {
  return point.x === START_POINT.x && point.y === START_POINT.y;
};

const part1 = (rawInput: string) => {
  const { blocked, lowestBlock } = parseInput(rawInput);
  let rests = 0;

  while (restSand(blocked, lowestBlock) != null) {
    rests++;
  }

  return rests;
};

const part2 = (rawInput: string) => {
  const { blocked, lowestBlock } = parseInput(rawInput);
  let hasReachedStartPoint = false;
  let rests = 0;

  while (!hasReachedStartPoint) {
    const point = restSand(blocked, lowestBlock, true)!;
    rests++;
    hasReachedStartPoint = isStartPoint(point);
  }

  return rests;
};

run({
  part1: {
    tests: [
      {
        input: `
        498,4 -> 498,6 -> 496,6
        503,4 -> 502,4 -> 502,9 -> 494,9
      `,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        498,4 -> 498,6 -> 496,6
        503,4 -> 502,4 -> 502,9 -> 494,9
      `,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
