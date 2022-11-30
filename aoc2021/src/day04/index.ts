import run from 'aocrunner';
import _ from 'lodash';

type Board = number[][];
type MarkBoard = boolean[][];

const BOARD_SIZE: number = 5;

const draw = (
  draws: number[],
  boards: Board[],
  markBoards: MarkBoard[],
): number | undefined => {
  const drawnNumber: number | undefined = draws.shift();

  if (drawnNumber === undefined) return;

  for (let boardIndex = 0; boardIndex < boards.length; boardIndex++) {
    const board: Board = boards[boardIndex];
    for (let i = 0; i < BOARD_SIZE; i++) {
      const row: number[] = board[i];
      for (let j = 0; j < BOARD_SIZE; j++) {
        const cell: number = row[j];
        if (cell === drawnNumber) {
          markBoards[boardIndex][i][j] = true;
        }
      }
    }
  }

  return drawnNumber;
};

const getColumn = <T>(matrix: T[][], column: number): T[] => {
  const matrixSize: number = matrix.length;
  return new Array(matrixSize).fill(0).map((_, index) => matrix[index][column]);
};

const checkBoards = (
  markBoards: MarkBoard[],
  boards: Board[],
  drawnNumber: number,
): number | undefined => {
  for (let boardIndex = 0; boardIndex < markBoards.length; boardIndex++) {
    const markBoard = markBoards[boardIndex];
    for (let i = 0; i < BOARD_SIZE; i++) {
      const row: boolean[] = markBoard[i];
      const column: boolean[] = getColumn(markBoard, i);
      const hasRowBingo = _.every(row, (it) => it);
      const hasColumnBingo = _.every(column, (it) => it);
      const hasBingo: boolean = hasRowBingo || hasColumnBingo;

      if (hasBingo) {
        const board: Board = boards[boardIndex];
        let unmarkedSum: number = 0;

        for (let row = 0; row < BOARD_SIZE; row++) {
          for (let col = 0; col < BOARD_SIZE; col++) {
            const isMarked: boolean = markBoard[row][col];
            if (!isMarked) {
              unmarkedSum += board[row][col];
            }
          }
        }

        boards.splice(boardIndex, 1);
        markBoards.splice(boardIndex, 1);
        return unmarkedSum * drawnNumber;
      }
    }
  }
};

const parseInput = (rawInput: string) => {
  const sections: string[] = rawInput
    .replace(/  +/g, ' ')
    .replace(/\n /g, '\n')
    .split('\n\n');
  const draws: number[] = sections.shift()!.split(',').map(parseFloat);
  const boards: Board[] = sections.map((it) =>
    it.split('\n').map((board) => board.split(' ').map(parseFloat)),
  );
  const markBoards: MarkBoard[] = boards.map((board) =>
    board.map((row) => row.map(() => false)),
  );

  return {
    draws,
    boards,
    markBoards,
  };
};

const part1 = (rawInput: string) => {
  const { draws, boards, markBoards } = parseInput(rawInput);
  let hasMoreToDraw: boolean = true;

  while (hasMoreToDraw) {
    const drawnNumber = draw(draws, boards, markBoards);
    if (drawnNumber === undefined) hasMoreToDraw = false;

    const score: number | undefined = checkBoards(
      markBoards,
      boards,
      drawnNumber!,
    );
    if (score) {
      return score;
    }
  }
};

const part2 = (rawInput: string) => {
  const { draws, boards, markBoards } = parseInput(rawInput);
  let hasMoreToDraw: boolean = true;
  let hasMoreBoardsToWin: boolean = true;
  let lastWinningBoardScore: number | undefined;

  while (hasMoreToDraw && hasMoreBoardsToWin) {
    const drawnNumber = draw(draws, boards, markBoards);
    if (drawnNumber === undefined) hasMoreToDraw = false;

    let score: number | undefined;
    do {
      score = checkBoards(markBoards, boards, drawnNumber!);
      if (score) {
        lastWinningBoardScore = score;
        hasMoreBoardsToWin = boards.length > 0;
      }
    } while (score !== undefined);
  }

  if (!lastWinningBoardScore) return;
  return lastWinningBoardScore;
};

run({
  part1: {
    tests: [
      {
        input: `
        7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

        22 13 17 11  0
         8  2 23  4 24
        21  9 14 16  7
         6 10  3 18  5
         1 12 20 15 19

         3 15  0  2 22
         9 18 13 17  5
        19  8  7 25 23
        20 11 10 24  4
        14 21 16 12  6

        14 21 17 24  4
        10 16 15  9 19
        18  8 23 26 20
        22 11 13  6  5
         2  0 12  3  7
        `,
        expected: 4512,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

        22 13 17 11  0
         8  2 23  4 24
        21  9 14 16  7
         6 10  3 18  5
         1 12 20 15 19

         3 15  0  2 22
         9 18 13 17  5
        19  8  7 25 23
        20 11 10 24  4
        14 21 16 12  6

        14 21 17 24  4
        10 16 15  9 19
        18  8 23 26 20
        22 11 13  6  5
         2  0 12  3  7
        `,
        expected: 1924,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
