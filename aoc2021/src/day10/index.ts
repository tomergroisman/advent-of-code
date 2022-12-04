import run from 'aocrunner';
import _ from 'lodash';

import { string } from '../utils/index.js';

type OpeningChars = typeof OPENING_CHARS[number];
type ClosingChars = typeof CLOSING_CHARS[number];

const OPENING_CHARS = ['(', '{', '[', '<'];
const CLOSING_CHARS = [')', '}', ']', '>'];

const openCharsToClosedChars: { [char in OpeningChars]: ClosingChars } = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
};

const illegalCharsToScore: { [char in ClosingChars]: number } = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

const missingCharsToScore: { [char in ClosingChars]: number } = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

const parseInput = (rawInput: string) => {
  return string.splitRows(rawInput);
};

const isClosingChar = (char: string) => {
  return CLOSING_CHARS.includes(char);
};

const getMissingCharsScoreForChunk = (missingChars: ClosingChars[]): number => {
  return missingChars.reduce((previousValue, currentValue) => {
    return previousValue * 5 + missingCharsToScore[currentValue];
  }, 0);
};

const part1 = (rawInput: string) => {
  const chunks = parseInput(rawInput);
  const illegalChars: (keyof typeof illegalCharsToScore)[] = [];

  for (const chunk of chunks) {
    const openCharsStack: OpeningChars[] = [];

    for (const char of chunk) {
      const isOpeningChar = !isClosingChar(char);
      if (isOpeningChar) {
        openCharsStack.push(char as OpeningChars);
      } else {
        const lastOpenChar = openCharsStack.pop()!;
        if (openCharsToClosedChars[lastOpenChar] !== char) {
          illegalChars.push(char as ClosingChars);
        }
      }
    }
  }

  return _.sum(illegalChars.map((it) => illegalCharsToScore[it]));
};

const part2 = (rawInput: string) => {
  const chunks = parseInput(rawInput);
  const missingCharsChunksScores: number[] = [];

  for (const chunk of chunks) {
    let isChunkCorrupted = false;
    const openCharsStack: OpeningChars[] = [];

    for (const char of chunk) {
      const isOpeningChar = !isClosingChar(char);
      if (isOpeningChar) {
        openCharsStack.push(char as OpeningChars);
      } else {
        const lastOpenChar = openCharsStack.pop()!;
        if (openCharsToClosedChars[lastOpenChar] !== char) {
          isChunkCorrupted = true;
        }
      }
    }

    if (!isChunkCorrupted) {
      const missingChars: ClosingChars[] = openCharsStack
        .map((it) => openCharsToClosedChars[it])
        .reverse();

      missingCharsChunksScores.push(getMissingCharsScoreForChunk(missingChars));
    }
  }

  return missingCharsChunksScores.sort((a, b) => a - b)[
    (missingCharsChunksScores.length - 1) / 2
  ];
};

run({
  part1: {
    tests: [
      {
        input: `
        [({(<(())[]>[[{[]{<()<>>
        [(()[<>])]({[<{<<[]>>(
        {([(<{}[<>[]}>{[]{[(<()>
        (((({<>}<{<{<>}{[]{[]{}
        [[<[([]))<([[{}[[()]]]
        [{[{({}]{}}([{[{{{}}([]
        {<[[]]>}<{[{[{[]{()[[[]
        [<(<(<(<{}))><([]([]()
        <{([([[(<>()){}]>(<<{{
        <{([{{}}[<[[[<>{}]]]>[]]
        `,
        expected: 26397,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        [({(<(())[]>[[{[]{<()<>>
        [(()[<>])]({[<{<<[]>>(
        {([(<{}[<>[]}>{[]{[(<()>
        (((({<>}<{<{<>}{[]{[]{}
        [[<[([]))<([[{}[[()]]]
        [{[{({}]{}}([{[{{{}}([]
        {<[[]]>}<{[{[{[]{()[[[]
        [<(<(<(<{}))><([]([]()
        <{([([[(<>()){}]>(<<{{
        <{([{{}}[<[[[<>{}]]]>[]]
        `,
        expected: 288957,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
