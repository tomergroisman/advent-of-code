import run from 'aocrunner';

import { splitRows } from '../utils/index.js';

enum CommandType {
  Forward,
  Down,
  Up,
}

interface Command {
  type: CommandType;
  payload: number;
}

const commandTypeStringToCommandTypeEnum = {
  forward: CommandType.Forward,
  down: CommandType.Down,
  up: CommandType.Up,
};

const parseInput = (rawInput: string) => {
  const rawInputSplit: string[] = splitRows(rawInput);
  const commands: Command[] = [];

  for (const row of rawInputSplit) {
    const [commandTypeString, payloadString] = row.split(' ');
    const type: CommandType =
      commandTypeStringToCommandTypeEnum[
        commandTypeString as keyof typeof commandTypeStringToCommandTypeEnum
      ];
    const payload: number = parseFloat(payloadString);
    commands.push({ type, payload });
  }
  return commands;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const progress: { horizontal: number; vertical: number } = {
    horizontal: 0,
    vertical: 0,
  };

  for (const command of input) {
    switch (command.type) {
      case CommandType.Forward: {
        progress.horizontal += command.payload;
        break;
      }
      case CommandType.Down: {
        progress.vertical += command.payload;
        break;
      }
      case CommandType.Up: {
        progress.vertical -= command.payload;
        break;
      }
    }
  }

  return progress.horizontal * progress.vertical;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const progress: { horizontal: number; vertical: number; aim: number } = {
    horizontal: 0,
    vertical: 0,
    aim: 0,
  };

  for (const command of input) {
    switch (command.type) {
      case CommandType.Forward: {
        progress.horizontal += command.payload;
        progress.vertical += progress.aim * command.payload;
        break;
      }
      case CommandType.Down: {
        progress.aim += command.payload;
        break;
      }
      case CommandType.Up: {
        progress.aim -= command.payload;
        break;
      }
    }
    console.log(progress);
  }

  return progress.horizontal * progress.vertical;
};

run({
  part1: {
    tests: [
      {
        input: `
        forward 5
        down 5
        forward 8
        up 3
        down 8
        forward 2
        `,
        expected: 150,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        forward 5
        down 5
        forward 8
        up 3
        down 8
        forward 2
        `,
        expected: 900,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
