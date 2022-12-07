import run from 'aocrunner';

const parseInput = (rawInput: string) => {
  return rawInput.split('');
};

const findFirstNDistinctChars = (chars: string[], n: number) => {
  for (let i = n; i < chars.length; i++) {
    const candidate = chars.slice(i - n, i);

    const charCount: any = {};
    candidate.forEach((it) => {
      charCount[it] ??= 0;
      charCount[it]++;
    });

    let isAllDifferent = Object.keys(charCount).length === n;
    if (isAllDifferent) {
      return i;
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
