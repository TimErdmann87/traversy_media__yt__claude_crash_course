// Turns raw coin data into display-ready text.

import { COLORS } from './colors.js';
import { CURRENCY } from './config.js';

const createPriceFormatter = (maxDecimals) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: CURRENCY.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDecimals,
  });

// Sub-dollar coins need extra precision to be meaningful.
const standardPrice = createPriceFormatter(2);
const precisePrice = createPriceFormatter(6);

export function formatPrice(price) {
  if (price == null) return 'N/A';
  return (price >= 1 ? standardPrice : precisePrice).format(price);
}

/** Returns the percentage as text, plus the color it should be shown in. */
export function formatChange(change) {
  if (change == null) return { text: 'N/A', color: COLORS.dim };

  // Round first so tiny negatives don't render as "-0.00%".
  const rounded = Number(change.toFixed(2)) || 0;
  const sign = rounded > 0 ? '+' : '';
  const color = rounded >= 0 ? COLORS.green : COLORS.red;
  return { text: `${sign}${rounded.toFixed(2)}%`, color };
}

/** Maps a raw CoinGecko coin to the cells of one table row. */
export function formatCoin(coin) {
  return {
    name: `${coin.name} (${coin.symbol.toUpperCase()})`,
    price: formatPrice(coin.current_price),
    change: formatChange(coin.price_change_percentage_24h),
  };
}
