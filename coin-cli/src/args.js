// Command-line argument parsing.

import { DEFAULT_LIMIT, MAX_LIMIT } from './config.js';

/**
 * Reads how many coins to show from the first command-line argument.
 * @param {string[]} args Arguments after the script name, i.e. process.argv.slice(2).
 * @returns {number}
 */
export function parseLimit([countArg]) {
  if (countArg === undefined) return DEFAULT_LIMIT;

  const limit = Number(countArg);
  const isValid = /^\d+$/.test(countArg) && limit >= 1 && limit <= MAX_LIMIT;

  if (!isValid) {
    throw new Error(
      `Invalid coin count "${countArg}". Use a whole number from 1 to ${MAX_LIMIT}, e.g. node index.js 10`,
    );
  }

  return limit;
}
