# Session Log

A running record of work sessions on coin-cli. Add new sessions at the top.

---

## 2026-09-27: Add a README

No code changed in this session — documentation only.

- **Added `README.md`** with: what the tool does, an example of its output,
  requirements (Node 18+, no dependencies, no API key), installation, usage and
  the `count` parameter, the `src/config.js` settings, and an architecture
  section with a data-flow diagram and a per-file responsibility table.
- **Verified `npm start -- 10`** before documenting it, since it was the one
  command in the README that hadn't been run yet.
- **Screenshot instead of pasted text:** the example output in the README was
  changed from a copied table to an image,
  `docs/screenshot_coin-cli_output.jpg` (new `docs/` folder), so the green and
  red coloring is actually visible. Keep in mind that the screenshot has to be
  retaken if the table layout or columns change.

---

## 2026-09-21: Build the CLI, split it into modules, add a coin-count argument

### Goal

A Node script that fetches the top 5 cryptocurrencies from the CoinGecko API
and prints a clean terminal table with each coin's name, current price and
24-hour change.

### 1. First version (single `index.js`)

- Called CoinGecko's `GET /api/v3/coins/markets` endpoint with
  `vs_currency=usd`, `order=market_cap_desc`, `per_page=5`, `page=1`,
  `price_change_percentage=24h`.
- No dependencies: it uses Node's built-in `fetch` (Node 18+; this machine runs
  v21.7.3).
- Drew the table with box-drawing characters. Columns size themselves to their
  longest value. Positive changes are green, negative ones red, and missing
  values dim `N/A`.
- Errors (HTTP failures or network problems) print a red message and set exit
  code 1 instead of crashing.
- Added `package.json` with an `npm start` script and a `bin` entry.

**Two formatting fixes after the first run:**
- Prices of $1 or more show 2 decimals; prices under $1 show up to 6, so
  stablecoins like USDT still show meaningful digits.
- The change is rounded before the sign is chosen, so a tiny negative value
  like `-0.001` prints as `0.00%` rather than `-0.00%`.

### 2. Refactor into ES modules

Split the single file into focused modules. The output stayed identical and no
dependencies were added.

```
index.js          entry point: wires the modules together, handles errors
src/api.js        fetchTopCoins({ limit, currency }), the CoinGecko request
src/format.js     formatPrice, formatChange, formatCoin (raw coin → table row)
src/table.js      renderTable(columns, rows), draws the box table
src/colors.js     ANSI color codes + colorize(text, color) helper
src/config.js     CURRENCY and LIMIT settings
```

**Decisions:**
- **Two extra modules beyond the requested api/format/table:** `colors.js`
  and `config.js`. The colors are needed by format, table and the entry point,
  and `CURRENCY` by api, format and the column label. Shared modules avoid
  copying them and avoid imports between sibling modules just for a constant.
- **`table.js` knows nothing about coins.** The column list lives in
  `index.js` and is passed to `renderTable`, so the table can draw any data. A
  cell is either a plain string or a `{ text, color }` object.
- **The price column label comes from `CURRENCY`** (it still reads
  "Price (USD)"), so it stays correct if the currency changes.
- **`"type": "module"`** was added to `package.json` so Node loads the files as
  ES modules.

**How the "identical output" claim was checked:**
- The original script's output was recorded with a fake `fetch` and a frozen
  clock, in four cases: normal data, HTTP 429, network failure and an empty
  response.
- The normal data included negative, sub-dollar, missing and near-zero values.
- The refactored version produced byte-identical screen output, error output
  and exit codes in all four cases. It also runs correctly against the live
  API.

### 3. Coin count as a command-line argument

`node index.js 10` shows the top 10; with no argument it still shows 5.

- **New `src/args.js`:** `parseLimit(args)` reads the first argument. It
  returns the default when there isn't one, and otherwise accepts a whole
  number from 1 to 250.
- **`src/config.js`:** `LIMIT` was renamed to `DEFAULT_LIMIT` (5), and
  `MAX_LIMIT` (250) was added because CoinGecko returns at most 250 coins per
  request.
- **`index.js`:** calls `parseLimit(process.argv.slice(2))` and passes the
  result to the API call and the title.

**Decisions:**
- **Invalid input is an error, not a silent fallback to 5.** It prints a red
  message (e.g. `Invalid coin count "abc". Use a whole number from 1 to 250,
  e.g. node index.js 10`) and exits with code 1 before any API call.
- **Strict digits-only check** (`/^\d+$/`), so `2.5`, `1e1`, `-3` and `" 5"`
  are rejected even though JavaScript's `Number()` would accept some of them.
- **Parsing happens inside `main()`'s `try` block**, so bad input goes through
  the same error handling as API failures.

**Verification:**
- With no argument, the output still matches the original baseline byte for
  byte, in all four fake-API cases.
- `10`, `1` and `250` send the right `per_page` value and show it in the title.
- `abc`, `0`, `-3`, `2.5`, `251`, `""`, `1e1` and `" 5"` are rejected with exit
  code 1 and no API call.
- A live run with `10` shows the top 10 coins.

**Known quirk:** `node index.js 1` prints "Top 1 Cryptocurrencies". It's a
one-line fix if the singular is wanted.

### How to run

```bash
node index.js        # top 5 (default)
node index.js 10     # top 10 (any whole number from 1 to 250)
npm start -- 10      # same via npm; note the -- before the number
```

To change the default count or the currency, edit `DEFAULT_LIMIT` and
`CURRENCY` in `src/config.js`.

### Notes

- CoinGecko's free API is rate-limited. Many runs in a row can return HTTP 429,
  which the script reports as a clean error.
- In the VS Code extension's chat panel, prefixing a message with `!` does not
  run it as a shell command the way it does in the Claude Code terminal CLI.
  Use the integrated terminal to run the script and see the colors.

### Ideas for next steps

- A currency argument, e.g. `--currency eur` (the coin count is done; see
  section 3)
- More columns (market cap, volume)
- An auto-refresh/watch mode
- Unit tests for `args.js`, `format.js` and `table.js`, which are pure
  functions and easy to test with `node:test`
