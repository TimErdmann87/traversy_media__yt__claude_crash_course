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

- `VITE_COINS_API_URL`: the markets list endpoint, which **already includes a query string** (`.../coins/markets?vs_currency=usd`). `context/CoinsProvider.jsx` appends more params with `&...`, so this URL must keep its `?`.
- `VITE_COIN_API_URL`: the base `.../coins`. Code appends `/${id}` for coin details and `/${id}/market_chart?...` for chart data.

`.env` is not gitignored (only `*.local` is).

## Architecture

- **Routing:** React Router v7 in declarative mode. Import from `react-router`, not `react-router-dom`. `main.jsx` wraps the app in `BrowserRouter`, and `App.jsx` defines the routes: `/`, `/about`, `/coin/:id`, and a `*` 404 route.
- **State for the coin list lives in a React context, not in the home page.** `context/CoinsProvider.jsx` fetches the coin list and owns `coins`, `loading`, `error`, `limit`, `filter`, `sortBy` and `showFavoritesOnly`. `main.jsx` wraps `App` in it, above the routes, so the state and the fetched coins survive navigating to a coin's page and back. `HomePage` reads them with the `useCoins()` hook from `context/coins-context.js`. The context and hook are in a separate file from the provider because of the `react-refresh/only-export-components` lint rule. The list is fetched again only when `limit` or `showFavoritesOnly` changes.
- **Favorites:** `context/FavoritesProvider.jsx` owns the starred coin IDs and saves them to localStorage under `crypto-dash-favorites` as a JSON array of CoinGecko IDs. Components read them with `useFavorites()` from `context/favorites-context.js`. `main.jsx` must nest `FavoritesProvider` outside `CoinsProvider`, because `CoinsProvider` reads the favorites. When `showFavoritesOnly` is on, `CoinsProvider` fetches exactly the starred coins with `&ids=...` instead of the top N, and the limit selector is disabled. That fetch reads the favorites through a ref and deliberately doesn't refetch when they change: un-starring a coin in that mode hides it through the client-side filter in `pages/home.jsx`. The fetch effect ignores responses from a previous run, because both kinds of request write to the same `coins` state. Filtering (by name or symbol) and sorting happen on the client in `pages/home.jsx`. The sort keys (`market_cap_desc`, `price_asc`, and so on) must match the option values in `components/SortSelector.jsx`.
- **The detail page and the chart fetch their own data:** `pages/coin-details.jsx` fetches the coin by the `:id` route param. `components/CoinChart.jsx` separately fetches 7 days of market chart data. It registers the Chart.js pieces it needs, including `TimeScale` with `chartjs-adapter-date-fns` for the time x-axis. Any new Chart.js chart type or scale must be registered there the same way.
- **Data fetching** uses plain `fetch` inside `useEffect`, with local `loading` and `error` state. There is no data library or caching layer. `CoinChart` has no error handling.
- **Styling** is a single global stylesheet, `src/index.css`, with a dark theme. Components use its class names (`coin-card`, `grid`, `top-controls`, `coin-details-*`, `positive`/`negative`, `error`). There are no CSS modules or CSS-in-JS.
- **Conventions:** components are arrow functions with a default export. Pages use lowercase kebab-case filenames (`coin-details.jsx`), and components use PascalCase. JSX uses single quotes.
