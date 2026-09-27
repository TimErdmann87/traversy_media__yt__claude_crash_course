#!/usr/bin/env node

// Fetches the top cryptocurrencies by market cap from CoinGecko
// and prints them as a table in the terminal.
//
// Usage: node index.js [count]   (count defaults to 5)

import { fetchTopCoins } from './src/api.js';
import { parseLimit } from './src/args.js';
import { COLORS, colorize } from './src/colors.js';
import { CURRENCY } from './src/config.js';
import { formatCoin } from './src/format.js';
import { renderTable } from './src/table.js';

const COLUMNS = [
  { key: 'name', label: 'Name', align: 'left' },
  { key: 'price', label: `Price (${CURRENCY.toUpperCase()})`, align: 'right' },
  { key: 'change', label: '24h Change', align: 'right' },
];

async function main() {
  try {
    const limit = parseLimit(process.argv.slice(2));
    const coins = await fetchTopCoins({ limit, currency: CURRENCY });

    const title = colorize(`Top ${limit} Cryptocurrencies by Market Cap`, COLORS.bold);
    const footer = colorize(`Data from CoinGecko · ${new Date().toLocaleString()}`, COLORS.dim);

    console.log(`\n${title}\n`);
    console.log(renderTable(COLUMNS, coins.map(formatCoin)));
    console.log(`${footer}\n`);
  } catch (error) {
    console.error(colorize(`Error: ${error.message}`, COLORS.red));
    process.exitCode = 1;
  }
}

main();
