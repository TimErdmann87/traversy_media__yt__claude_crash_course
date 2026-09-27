// CoinGecko API client.

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';

/**
 * Fetches the top coins ranked by market cap.
 * @param {{ limit: number, currency: string }} options
 * @returns {Promise<object[]>} Raw market data as returned by CoinGecko.
 */
export async function fetchTopCoins({ limit, currency }) {
  const params = new URLSearchParams({
    vs_currency: currency,
    order: 'market_cap_desc',
    per_page: String(limit),
    page: '1',
    price_change_percentage: '24h',
  });

  const response = await fetch(`${API_URL}?${params}`, {
    headers: { accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko API responded with ${response.status} ${response.statusText}`);
  }

  return response.json();
}
