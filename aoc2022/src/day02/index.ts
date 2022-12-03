import run from 'aocrunner';
import _ from 'lodash';

import { string } from '../utils/index.js';

enum Action {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

enum RoundOutput {
  Lose = 0,
  Draw = 3,
  Win = 6,
}

const parseInput = (rawInput: string): string[] => {
  return string.splitRows(rawInput);
};

const getRoundOutput = (output: Action[]): RoundOutput | undefined => {
  const [opponent, you] = output;

  if (opponent === you) return RoundOutput.Draw;

  switch (opponent) {
    case Action.Rock: {
      if (you === Action.Scissors) return RoundOutput.Lose;
      if (you === Action.Paper) return RoundOutput.Win;
      break;
    }
    case Action.Paper: {
      if (you === Action.Rock) return RoundOutput.Lose;
      if (you === Action.Scissors) return RoundOutput.Win;
      break;
    }
    case Action.Scissors: {
      if (you === Action.Paper) return RoundOutput.Lose;
      if (you === Action.Rock) return RoundOutput.Win;
      break;
    }
  }
};

const playRound = (output: Action[]): number => {
  const [, actionScore] = output;

  const roundOutput: RoundOutput = getRoundOutput(output)!;

  return actionScore + roundOutput;
};

const chooseAction = (input: (Action | RoundOutput)[]): Action | undefined => {
  const opponent = input[0] as Action;
  const expectedOutput = input[1] as RoundOutput;

  if (expectedOutput === RoundOutput.Draw) return opponent;

  switch (opponent) {
    case Action.Rock: {
      if (expectedOutput === RoundOutput.Lose) return Action.Scissors;
      if (expectedOutput === RoundOutput.Win) return Action.Paper;
      break;
    }
    case Action.Paper: {
      if (expectedOutput === RoundOutput.Lose) return Action.Rock;
      if (expectedOutput === RoundOutput.Win) return Action.Scissors;
      break;
    }
    case Action.Scissors: {
      if (expectedOutput === RoundOutput.Lose) return Action.Paper;
      if (expectedOutput === RoundOutput.Win) return Action.Rock;
      break;
    }
  }
};

const part1 = (rawInput: string) => {
  const input: Action[][] = parseInput(rawInput).map(
    (it) =>
      it.split(' ').map((it) => {
        switch (it) {
          case 'A':
            return Action.Rock;
          case 'B':
            return Action.Paper;
          case 'C':
            return Action.Scissors;
          case 'X':
            return Action.Rock;
          case 'Y':
            return Action.Paper;
          case 'Z':
            return Action.Scissors;
        }
      }) as Action[],
  );

  return _.sum(input.map(playRound));
};

const part2 = (rawInput: string) => {
  const input: Action[][] = parseInput(rawInput)
    .map(
      (it) =>
        it.split(' ').map((it) => {
          switch (it) {
            case 'A':
              return Action.Rock;
            case 'B':
              return Action.Paper;
            case 'C':
              return Action.Scissors;
            case 'X':
              return RoundOutput.Lose;
            case 'Y':
              return RoundOutput.Draw;
            case 'Z':
              return RoundOutput.Win;
          }
        }) as (Action | RoundOutput)[],
    )
    .map((it) => [it[0] as Action, chooseAction(it) as Action]);

  return _.sum(input.map(playRound));
};

run({
  part1: {
    tests: [
      {
        input: `
        A Y
        B X
        C Z
        `,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        A Y
        B X
        C Z
        `,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
