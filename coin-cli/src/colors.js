// ANSI escape codes for styling terminal output.

export const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
};

export const colorize = (text, color) => `${color}${text}${COLORS.reset}`;
