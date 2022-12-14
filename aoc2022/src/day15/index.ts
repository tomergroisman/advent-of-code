import run from 'aocrunner';
import _ from 'lodash';

import { string } from '../utils/index.js';

type Point = { x: number; y: number };
type SensorBeacon = Point[];
type SensorDistance = { sensor: Point; distance: number };

const parseInput = (rawInput: string) => {
  return string.splitRows(rawInput).map((it) =>
    it
      .replace('Sensor at ', '')
      .replace(' closest beacon is at ', '')
      .split(':')
      .map((it) => {
        const [xString, yString] = it.split(' ');
        const x = parseFloat(xString.replace('x=', ''));
        const y = parseFloat(yString.replace('y=', ''));
        return { x, y };
      }),
  );
};

const isCandidate = (n: number, sensorBeacon: SensorBeacon) => {
  const [sensor, beacon] = sensorBeacon;
  const yDistance = Math.abs(sensor.y - beacon.y);
  const isBelowN = sensor.y > n;
  const isAboveN = sensor.y < n;

  if (isAboveN && sensor.y - yDistance < n) {
    return true;
  }

  if (isBelowN && sensor.y + yDistance > n) {
    return true;
  }

  return false;
};

const extractKey = (point: Point) => {
  return `${point.x},${point.y}`;
};

const part1 = (rawInput: string) => {
  const sensorsBeacons: SensorBeacon[] = parseInput(rawInput);
  const noBeaconsPoints: Record<string, boolean> = {};
  const n = 2000000;

  for (const sensorBeacon of sensorsBeacons) {
    const [sensor, beacon] = sensorBeacon;
    if (isCandidate(n, sensorBeacon)) {
      const xDistance = Math.abs(sensor.x - beacon.x);
      const yDistance = Math.abs(sensor.y - beacon.y);
      const distance = xDistance + yDistance;

      for (let i = 0; i <= distance; i++) {
        const y1 = sensor.y + i;
        const y2 = sensor.y - i;
        if (y1 === n || y2 === n) {
          for (let j = 0; j <= distance - i; j++) {
            const point1 = { x: sensor.x - j, y: n };
            const point2 = { x: sensor.x + j, y: n };
            noBeaconsPoints[extractKey(point1)] ??= true;
            noBeaconsPoints[extractKey(point2)] ??= true;
          }
        }
      }
    }
    if (beacon.y === n) {
      noBeaconsPoints[extractKey(beacon)] = false;
    }
  }

  return _.entries(noBeaconsPoints).filter(([, value]) => !!value).length;
};

const part2 = (rawInput: string) => {
  const sensorsBeacons: SensorBeacon[] = parseInput(rawInput);
  const aCoeffs: number[] = [];
  const bCoeffs: number[] = [];
  const sensorDistance: SensorDistance[] = [];

  sensorsBeacons.forEach((sensorBeacon) => {
    const [sensor, beacon] = sensorBeacon;
    const xDistanceBeaconFromSensor = Math.abs(sensor.x - beacon.x);
    const yDistanceBeaconFromSensor = Math.abs(sensor.y - beacon.y);
    const maxDistanceBeaconFromSensor =
      xDistanceBeaconFromSensor + yDistanceBeaconFromSensor + 1;

    aCoeffs.push(sensor.y - sensor.x + maxDistanceBeaconFromSensor);
    aCoeffs.push(sensor.y - sensor.x - maxDistanceBeaconFromSensor);

    bCoeffs.push(sensor.x + sensor.y + maxDistanceBeaconFromSensor);
    bCoeffs.push(sensor.x + sensor.y - maxDistanceBeaconFromSensor);

    sensorDistance.push({ sensor, distance: maxDistanceBeaconFromSensor });
  });

  const n = 4000000;

  for (const a of aCoeffs) {
    for (const b of bCoeffs) {
      const intersectionX = (b - a) / 2;
      const intersectionY = (a + b) / 2;

      if (
        intersectionX >= 0 &&
        intersectionX <= n &&
        intersectionY >= 0 &&
        intersectionY <= n
      ) {
        let foundMissingBeacon = true;
        for (const { sensor, distance } of sensorDistance) {
          const distanceFromIntersectionPointX = Math.abs(
            sensor.x - intersectionX,
          );
          const distanceFromIntersectionPointY = Math.abs(
            sensor.y - intersectionY,
          );
          const maxDistanceBeaconFromIntersection =
            distanceFromIntersectionPointX + distanceFromIntersectionPointY;

          if (maxDistanceBeaconFromIntersection < distance)
            foundMissingBeacon = false;
        }
        if (foundMissingBeacon) {
          return intersectionX * 4000000 + intersectionY;
        }
      }
    }
  }
};

run({
  part1: {
    tests: [
      {
        input: `
          Sensor at x=2, y=18: closest beacon is at x=-2, y=15
          Sensor at x=9, y=16: closest beacon is at x=10, y=16
          Sensor at x=13, y=2: closest beacon is at x=15, y=3
          Sensor at x=12, y=14: closest beacon is at x=10, y=16
          Sensor at x=10, y=20: closest beacon is at x=10, y=16
          Sensor at x=14, y=17: closest beacon is at x=10, y=16
          Sensor at x=8, y=7: closest beacon is at x=2, y=10
          Sensor at x=2, y=0: closest beacon is at x=2, y=10
          Sensor at x=0, y=11: closest beacon is at x=2, y=10
          Sensor at x=20, y=14: closest beacon is at x=25, y=17
          Sensor at x=17, y=20: closest beacon is at x=21, y=22
          Sensor at x=16, y=7: closest beacon is at x=15, y=3
          Sensor at x=14, y=3: closest beacon is at x=15, y=3
          Sensor at x=20, y=1: closest beacon is at x=15, y=3
          `,
        expected: 26,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Sensor at x=2, y=18: closest beacon is at x=-2, y=15
          Sensor at x=9, y=16: closest beacon is at x=10, y=16
          Sensor at x=13, y=2: closest beacon is at x=15, y=3
          Sensor at x=12, y=14: closest beacon is at x=10, y=16
          Sensor at x=10, y=20: closest beacon is at x=10, y=16
          Sensor at x=14, y=17: closest beacon is at x=10, y=16
          Sensor at x=8, y=7: closest beacon is at x=2, y=10
          Sensor at x=2, y=0: closest beacon is at x=2, y=10
          Sensor at x=0, y=11: closest beacon is at x=2, y=10
          Sensor at x=20, y=14: closest beacon is at x=25, y=17
          Sensor at x=17, y=20: closest beacon is at x=21, y=22
          Sensor at x=16, y=7: closest beacon is at x=15, y=3
          Sensor at x=14, y=3: closest beacon is at x=15, y=3
          Sensor at x=20, y=1: closest beacon is at x=15, y=3
          `,
        expected: 56000011,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
