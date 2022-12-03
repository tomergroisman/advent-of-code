import run from 'aocrunner';
import _ from 'lodash';

import { string } from '../utils/index.js';

type Bag = string[];

const parseInput = (rawInput: string): Bag[] => {
  return string.splitRows(rawInput).map((it) => {
    const numberOfItems: number = it.length;
    const firstCompartment = it.slice(0, numberOfItems / 2);
    const secondCompartment = it.slice(numberOfItems / 2);
    return [firstCompartment, secondCompartment];
  });
};

const updateBagSharedItemsMap = (
  bag: Bag,
  sharedItems: Record<string, number>,
): void => {
  const firstCompartment: string = bag[0];
  const secondCompartment: string = bag[1];

  const duplication: string = _.intersection(
    [...firstCompartment],
    [...secondCompartment],
  )[0];

  sharedItems[duplication] ??= 0;
  sharedItems[duplication]++;
};

const updateGroupBadgeMap = (
  group: string[],
  badges: Record<string, number>,
): void => {
  const firstElf: string = group[0];
  const secondElf: string = group[1];
  const thirdElf: string = group[2];

  const badge: string = _.intersection(
    [...firstElf],
    [...secondElf],
    [...thirdElf],
  )[0];

  badges[badge] ??= 0;
  badges[badge]++;
};

const itemsToPriority = (sharedItems: Record<string, number>): number => {
  const priorities: number[] = new Array(52).fill(0);
  _.entries(sharedItems).forEach(([key, value]) => {
    let priority: number = 0;
    const asciiCode: number = key.charCodeAt(0);

    if (97 <= asciiCode && asciiCode <= 122) {
      priority = asciiCode - 96;
    }
    if (65 <= asciiCode && asciiCode <= 90) {
      priority = asciiCode - 38;
    }

    priorities[priority - 1] += priority * value;
  });

  return _.sum(priorities);
};

const part1 = (rawInput: string) => {
  const bags: Bag[] = parseInput(rawInput);

  const sharedItems: Record<string, number> = {};
  for (const bag of bags) {
    updateBagSharedItemsMap(bag, sharedItems);
  }

  return itemsToPriority(sharedItems);
};

const part2 = (rawInput: string) => {
  const bags: Bag[] = parseInput(rawInput);
  const groups: string[][] = [];

  for (let i = 0; i < bags.length / 3; i++) {
    groups.push([
      bags[i * 3].join(''),
      bags[i * 3 + 1].join(''),
      bags[i * 3 + 2].join(''),
    ]);
  }

  const badges: Record<string, number> = {};
  for (const group of groups) {
    updateGroupBadgeMap(group, badges);
  }

  return itemsToPriority(badges);
};

run({
  part1: {
    tests: [
      {
        input: `
        vJrwpWtwJgWrhcsFMMfFFhFp
        jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
        PmmdzqPrVvPwwTWBwg
        wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
        ttgJtRGJQctTZtZT
        CrZsJsPPZsGzwwsLwLmpwMDw
        `,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        vJrwpWtwJgWrhcsFMMfFFhFp
        jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
        PmmdzqPrVvPwwTWBwg
        wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
        ttgJtRGJQctTZtZT
        CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
