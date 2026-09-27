# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Crypto Dash is a React 19 + Vite 6 single-page app for browsing and searching cryptocurrencies. Its data comes from the public CoinGecko API. It is plain JavaScript (JSX), not TypeScript. This folder is a subdirectory of a larger course repo (its sibling is `../coin-cli`). Run all commands from `crypto-dash/`.

## Commands

```bash
npm install
npm run dev       # Vite dev server
npm run build     # production build to dist/
npm run preview   # serve the production build
npm run lint      # ESLint (flat config in eslint.config.js)
```

There is no test framework or test script.

## Configuration

API base URLs come from Vite env vars in `.env`, read with `import.meta.env`:

- `VITE_COINS_API_URL`: the markets list endpoint, which **already includes a query string** (`.../coins/markets?vs_currency=usd`). `App.jsx` appends more params with `&...`, so this URL must keep its `?`.
- `VITE_COIN_API_URL`: the base `.../coins`. Code appends `/${id}` for coin details and `/${id}/market_chart?...` for chart data.

`.env` is not gitignored (only `*.local` is).

## Architecture

- **Routing:** React Router v7 in declarative mode. Import from `react-router`, not `react-router-dom`. `main.jsx` wraps the app in `BrowserRouter`, and `App.jsx` defines the routes: `/`, `/about`, `/coin/:id`, and a `*` 404 route.
- **State for the coin list lives in `App.jsx`, not in the home page.** `App` fetches the coin list and owns `coins`, `limit`, `filter` and `sortBy`, then passes them all to `HomePage` as props. The list is fetched again only when `limit` changes. Filtering (by name or symbol) and sorting happen on the client in `pages/home.jsx`. The sort keys (`market_cap_desc`, `price_asc`, and so on) must match the option values in `components/SortSelector.jsx`.
- **The detail page and the chart fetch their own data:** `pages/coin-details.jsx` fetches the coin by the `:id` route param. `components/CoinChart.jsx` separately fetches 7 days of market chart data. It registers the Chart.js pieces it needs, including `TimeScale` with `chartjs-adapter-date-fns` for the time x-axis. Any new Chart.js chart type or scale must be registered there the same way.
- **Data fetching** uses plain `fetch` inside `useEffect`, with local `loading` and `error` state. There is no data library or caching layer. `CoinChart` has no error handling.
- **Styling** is a single global stylesheet, `src/index.css`, with a dark theme. Components use its class names (`coin-card`, `grid`, `top-controls`, `coin-details-*`, `positive`/`negative`, `error`). There are no CSS modules or CSS-in-JS.
- **Conventions:** components are arrow functions with a default export. Pages use lowercase kebab-case filenames (`coin-details.jsx`), and components use PascalCase. JSX uses single quotes.
