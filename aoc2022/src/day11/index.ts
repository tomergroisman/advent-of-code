import run from 'aocrunner';
import _ from 'lodash';

import { string } from '../utils/index.js';

interface Monkey {
  startingItems: number[];
  operation: (old: number) => number;
  test: (worryLevel: number) => { nextMonkeyIndex: number; divider?: number };
}

const parseInput = (rawInput: string, minify = false) => {
  const monkeys: Monkey[] = [];
  string
    .splitDelimiter(rawInput, '\n\n')
    .map((it) => string.splitDelimiter(it.replace(/\n/g, ''), '  '))
    .forEach((it) => {
      const startingItems: number[] = string
        .splitDelimiter(it[1].replace('Starting items: ', ''), ', ')
        .map(parseFloat)
        .map((it) => (minify ? Math.log(it) : it));

      const operationEval: string = it[2]
        .replace('Operation: ', '')
        .replace('new = ', '');
      const operation: (old: number) => number = (old: number) =>
        eval(operationEval);

      const testDivider: number = parseFloat(
        it[3].replace('Test: divisible by', ''),
      );
      const monkeyIndexIfTrue: number = parseFloat(
        it[5].replace('If true: throw to monkey', ''),
      );
      const monkeyIndexIfFalse: number = parseFloat(
        it[7].replace('If false: throw to monkey', ''),
      );

      const test = (
        worryLevel: number,
      ): { nextMonkeyIndex: number; divider?: number } => {
        if (worryLevel % testDivider === 0) {
          return { nextMonkeyIndex: monkeyIndexIfTrue, divider: testDivider };
        }
        return { nextMonkeyIndex: monkeyIndexIfFalse };
      };

      const monkey: Monkey = {
        startingItems,
        operation,
        test,
      };

      monkeys.push(monkey);
    });

  return monkeys;
};

const playRound = (monkeys: Monkey[], inspections: number[], relief = 1) => {
  for (let i = 0; i < monkeys.length; i++) {
    const monkey = monkeys[i];
    const startingItems = _.cloneDeep(monkey.startingItems);
    for (const item of startingItems) {
      inspections[i]++;
      let newWorryLevel = Math.floor(monkey.operation(item) / relief);
      const { nextMonkeyIndex, divider } = monkey.test(newWorryLevel);

      if (divider) {
        newWorryLevel = divider;
      }

      monkeys[i].startingItems.shift();
      monkeys[nextMonkeyIndex].startingItems.push(newWorryLevel);
    }
  }
};

const part1 = (rawInput: string) => {
  const monkeys = parseInput(rawInput);
  const inspections = new Array(monkeys.length).fill(0);
  const nRounds = 20;

  for (let i = 0; i < nRounds; i++) {
    playRound(monkeys, inspections, 3);
  }
  console.log(monkeys, inspections);

  const mostActiveMonkey = _.max(inspections);
  const secondMostActiveMonkey = _.max(
    inspections.filter((it) => it !== mostActiveMonkey),
  );

  return mostActiveMonkey * secondMostActiveMonkey;
};

const part2 = (rawInput: string) => {
  // const monkeys = parseInput(rawInput, true);
  // const inspections = new Array(monkeys.length).fill(0);
  // const nRounds = 20;
  //
  // for (let i = 0; i < nRounds; i++) {
  //   playRound(monkeys, inspections);
  // }
  // console.log(monkeys, inspections);
  //
  // const mostActiveMonkey = _.max(inspections);
  // const secondMostActiveMonkey = _.max(
  //   inspections.filter((it) => it !== mostActiveMonkey),
  // );
  //
  // return mostActiveMonkey * secondMostActiveMonkey;
};

run({
  part1: {
    tests: [
      {
        input: `
        Monkey 0:
          Starting items: 79, 98
          Operation: new = old * 19
          Test: divisible by 23
            If true: throw to monkey 2
            If false: throw to monkey 3
        
        Monkey 1:
          Starting items: 54, 65, 75, 74
          Operation: new = old + 6
          Test: divisible by 19
            If true: throw to monkey 2
            If false: throw to monkey 0
        
        Monkey 2:
          Starting items: 79, 60, 97
          Operation: new = old * old
          Test: divisible by 13
            If true: throw to monkey 1
            If false: throw to monkey 3
        
        Monkey 3:
          Starting items: 74
          Operation: new = old + 3
          Test: divisible by 17
            If true: throw to monkey 0
            If false: throw to monkey 1
      `,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Monkey 0:
          Starting items: 79, 98
          Operation: new = old * 19
          Test: divisible by 23
            If true: throw to monkey 2
            If false: throw to monkey 3
        
        Monkey 1:
          Starting items: 54, 65, 75, 74
          Operation: new = old + 6
          Test: divisible by 19
            If true: throw to monkey 2
            If false: throw to monkey 0
        
        Monkey 2:
          Starting items: 79, 60, 97
          Operation: new = old * old
          Test: divisible by 13
            If true: throw to monkey 1
            If false: throw to monkey 3
        
        Monkey 3:
          Starting items: 74
          Operation: new = old + 3
          Test: divisible by 17
            If true: throw to monkey 0
            If false: throw to monkey 1
      `,
        expected: 2713310158,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
