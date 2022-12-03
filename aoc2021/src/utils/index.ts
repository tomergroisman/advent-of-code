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

export const string = (() => {
  function _splitDelimiter(input: string, delimiter: string): string[] {
    return input.split(delimiter);
  }

  return {
    splitComma(input: string): string[] {
      return _splitDelimiter(input, ',');
    },

    splitDelimiter: _splitDelimiter,

    splitSpaces(input: string): string[] {
      return _splitDelimiter(input, ' ');
    },

    splitRows(input: string): string[] {
      return _splitDelimiter(input, '\n');
    },
  };
})();

export const number = {
  binaryToDecimal(binary: string): number {
    return parseInt(binary, 2);
  },

  getMinMax(array: number[]): { min: number; max: number } {
    return {
      min: _.min(array)!,
      max: _.max(array)!,
    };
  },
};
