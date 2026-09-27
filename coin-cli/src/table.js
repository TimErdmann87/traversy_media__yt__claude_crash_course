// Renders rows as a box-drawn terminal table.
//
// Each cell is either a plain string or a { text, color } object for
// values that should be colored.

import { COLORS, colorize } from './colors.js';

const BORDERS = {
  top: ['┌', '┬', '┐'],
  middle: ['├', '┼', '┤'],
  bottom: ['└', '┴', '┘'],
};

const cellText = (cell) => (typeof cell === 'object' ? cell.text : cell);

function pad(text, width, align) {
  return align === 'right' ? text.padStart(width) : text.padEnd(width);
}

function columnWidths(columns, rows) {
  return columns.map(({ key, label }) =>
    Math.max(label.length, ...rows.map((row) => cellText(row[key]).length)),
  );
}

function borderLine(widths, [left, mid, right]) {
  return left + widths.map((width) => '─'.repeat(width + 2)).join(mid) + right;
}

const joinCells = (cells) => `│ ${cells.join(' │ ')} │`;

/**
 * @param {{ key: string, label: string, align: 'left' | 'right' }[]} columns
 * @param {object[]} rows Objects whose values are keyed by column `key`.
 * @returns {string}
 */
export function renderTable(columns, rows) {
  const widths = columnWidths(columns, rows);

  const header = columns.map(({ label, align }, i) =>
    colorize(pad(label, widths[i], align), COLORS.bold),
  );

  // Padding is applied before coloring so ANSI codes don't skew the widths.
  const body = rows.map((row) =>
    columns.map(({ key, align }, i) => {
      const cell = row[key];
      const padded = pad(cellText(cell), widths[i], align);
      return typeof cell === 'object' ? colorize(padded, cell.color) : padded;
    }),
  );

  return [
    borderLine(widths, BORDERS.top),
    joinCells(header),
    borderLine(widths, BORDERS.middle),
    ...body.map(joinCells),
    borderLine(widths, BORDERS.bottom),
  ].join('\n');
}
