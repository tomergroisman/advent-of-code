/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.ts,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 * For example:
 *
 *   correct:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.js'
 *     import { myUtil } from '../utils/index.js'
 *
 *   incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.ts'
 *     import { myUtil } from '../utils/index.ts'
 *
 *   also incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib'
 *     import { myUtil } from '../utils'
 *
 */

import _ from 'lodash';

export const string = {
  splitComma(input: string): string[] {
    return this.splitDelimiter(input, ',');
  },

  splitDelimiter(input: string, delimiter: string): string[] {
    return input.split(delimiter);
  },

  splitRows(input: string): string[] {
    return this.splitDelimiter(input, '\n');
  },
};

export const number = {
  binaryToDecimal(binary: string): number {
    return parseInt(binary, 2);
  },

  sumArray(array: number[]): number {
    return array.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0,
    );
  },

  getMinMax(array: number[]): { min: number; max: number } {
    return {
      min: _.min(array)!,
      max: _.max(array)!,
    };
  },
};
