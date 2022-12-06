import run from 'aocrunner';

const parseInput = (rawInput: string) => {
  return rawInput.split('');
};

const findFirstNDistinctChars = (chars: string[], n: number) => {
  const sequence = [];

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    sequence.push(char);
    if (sequence.length > n) {
      sequence.shift();
    }

    const charCount: any = {};
    sequence.forEach((it) => {
      charCount[it] ??= 0;
      charCount[it]++;
    });
    let isAllDifferent = Object.keys(charCount).length === n;
    if (isAllDifferent) {
      return i + 1;
    }
  }
};

const part1 = (rawInput: string) => {
  const chars = parseInput(rawInput);
  return findFirstNDistinctChars(chars, 4);
};

const part2 = (rawInput: string) => {
  const chars = parseInput(rawInput);
  return findFirstNDistinctChars(chars, 14);
};

run({
  part1: {
    tests: [
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 26,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
