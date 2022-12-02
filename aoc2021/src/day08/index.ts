import run from 'aocrunner';
import _ from 'lodash';

import { string } from '../utils/index.js';

const parseInput = (rawInput: string) => {
  return string
    .splitRows(rawInput)
    .map((it) => string.splitDelimiter(it, ' | ').map(string.splitSpaces));
};

const discoverSegments = (digits: string[]): string[] => {
  const one: string = digits.find((it) => it.length === 2)!;
  const four: string = digits.find((it) => it.length === 4)!;
  const seven: string = digits.find((it) => it.length === 3)!;
  const eight: string = digits.find((it) => it.length === 7)!;

  const six: string = digits.find((it) => {
    if (it.length !== 6) return false;
    return _.difference([...seven], [...it]).length === 1;
  })!;

  const nine: string = digits.find((it) => {
    if (it.length !== 6) return false;
    const fourAndSevenUnion: string[] = _.union([...four], [...seven]);
    return _.difference(fourAndSevenUnion, [...it]).length === 0;
  })!;

  const three: string = digits.find((it) => {
    if (it.length !== 5) return false;
    return _.difference([...seven], [...it]).length === 0;
  })!;

  const zero: string = digits.find((it) => {
    if (it.length !== 6) return false;
    return it !== nine && it !== six;
  })!;

  const two: string = digits.find((it) => {
    if (it.length !== 5) return false;
    return _.difference([...nine], [...it]).length === 2;
  })!;

  const five: string = digits.find((it) => {
    if (it.length !== 5) return false;
    return _.difference([...six], [...it]).length === 1;
  })!;

  return [zero, one, two, three, four, five, six, seven, eight, nine];
};

const part1 = (rawInput: string) => {
  const notes: string[][][] = parseInput(rawInput);
  const UNIQUE_DIGITS_LENGTH: number[] = [2, 3, 4, 7];

  let numberOfUniqueDigits: number = 0;
  for (const note of notes) {
    const output: string[] = note[1];

    output.filter((it) => {
      const isUnique: boolean = UNIQUE_DIGITS_LENGTH.includes(it.length);
      if (isUnique) {
        numberOfUniqueDigits++;
      }
    });
  }

  return numberOfUniqueDigits;
};

const part2 = (rawInput: string) => {
  const notes = parseInput(rawInput);

  let sum = 0;
  for (const note of notes) {
    const decryptedDigits: string[] = discoverSegments(note[0]);
    let numberString: string = '';
    for (const encryptedDigit of note[1]) {
      numberString += decryptedDigits.findIndex(
        (it) => [...it].sort().join('') === [...encryptedDigit].sort().join(''),
      );
    }
    sum += parseFloat(numberString);
  }

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `
        be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
        edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
        fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
        fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
        aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
        fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
        dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
        bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
        egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
        gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
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
        be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
        edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
        fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
        fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
        aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
        fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
        dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
        bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
        egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
        gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
        `,
        expected: 61229,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
