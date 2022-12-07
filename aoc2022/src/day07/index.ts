import run from 'aocrunner';
import _ from 'lodash';

import { string } from '../utils/index.js';

const parseInput = (rawInput: string) => {
  return string
    .splitDelimiter(rawInput, '$ ')
    .slice(1)
    .map((it) => string.splitDelimiter(it.replace(/\n$/, ''), '\n'))
    .map((it) => ({
      command: it[0],
      output: it.slice(1),
    }));
};

const getDirPathsInPath = (path: string) => {
  if (path.length == 1) {
    return ['/'];
  }
  const dirsInPath = ['/', ...path.slice(1).split('/')];
  return dirsInPath.map((it, index) =>
    dirsInPath
      .slice(0, index + 1)
      .join('/')
      .slice(index === 0 ? 0 : 1),
  );
};

const gerDirSizes = (lines: { command: string; output: string[] }[]) => {
  let path: string = '';
  const dirSizes: Record<string, number> = {};
  const prevPaths: Record<string, boolean> = {};

  for (const line of lines) {
    if (line.command.includes('cd')) {
      const commandArg = line.command.replace('cd ', '');
      switch (commandArg) {
        case '/': {
          path = '/';
          break;
        }
        case '..': {
          path = path.replace(/\/[a-zA-Z0-9]+$/, '');
          if (path.length == 0) {
            path = '/';
          }
          break;
        }
        default: {
          if (path.length > 1) {
            path += `/${commandArg}`;
          } else {
            path += commandArg;
          }
          break;
        }
      }
    }

    if (line.command === 'ls') {
      if (prevPaths[path]) {
        break;
      }

      const dirPathsInPath = getDirPathsInPath(path);
      for (const file of line.output) {
        const size = parseFloat(file.split(' ')[0]);
        const isFile = !isNaN(size);
        if (isFile) {
          for (const dir of dirPathsInPath) {
            dirSizes[dir] ??= 0;
            dirSizes[dir] += size;
          }
        }
      }
      prevPaths[path] = true;
    }
  }

  return dirSizes;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const dirSizes: Record<string, number> = gerDirSizes(lines);

  return _.sum(_.values(dirSizes).filter((it) => it <= 100000));
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const dirSizes: Record<string, number> = gerDirSizes(lines);

  const freeSpace = 70000000 - dirSizes['/'];
  const spaceNeedToFreeForUpdate = 30000000 - freeSpace;

  if (spaceNeedToFreeForUpdate < 0) return;

  let minSufficientDirSize = Infinity;
  _.values(dirSizes).map((it) => {
    const isCandidate = it > spaceNeedToFreeForUpdate;
    if (isCandidate) {
      minSufficientDirSize = Math.min(minSufficientDirSize, it);
    }
  });
  return minSufficientDirSize;
};

run({
  part1: {
    tests: [
      {
        input: `
        $ cd /
        $ ls
        dir a
        14848514 b.txt
        8504156 c.dat
        dir d
        $ cd a
        $ ls
        dir e
        29116 f
        2557 g
        62596 h.lst
        $ cd e
        $ ls
        584 i
        $ cd ..
        $ cd ..
        $ cd d
        $ ls
        4060174 j
        8033020 d.log
        5626152 d.ext
        7214296 k
        `,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        $ cd /
        $ ls
        dir a
        14848514 b.txt
        8504156 c.dat
        dir d
        $ cd a
        $ ls
        dir e
        29116 f
        2557 g
        62596 h.lst
        $ cd e
        $ ls
        584 i
        $ cd ..
        $ cd ..
        $ cd d
        $ ls
        4060174 j
        8033020 d.log
        5626152 d.ext
        7214296 k
        `,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
