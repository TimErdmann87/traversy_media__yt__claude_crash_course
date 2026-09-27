# Claude Code Crash Course: Projects

Two small cryptocurrency apps I built while following Brad Traversy's
[Claude Code Crash Course For Developers](https://www.youtube.com/watch?v=C2GpeepcmYs)
on YouTube. Both apps get their data from the free
[CoinGecko API](https://www.coingecko.com/), so neither needs an API key.

## The apps

| App                            | Type                  | Summary                                                                                               |
| ------------------------------ | --------------------- | ----------------------------------------------------------------------------------------------------- |
| [`coin-cli/`](coin-cli/)       | Node.js CLI           | Prints the top cryptocurrencies by market cap as a colored table in the terminal. Has no dependencies. |
| [`crypto-dash/`](crypto-dash/) | React + Vite web app  | Dashboard for browsing, filtering and sorting coins, with a detail page and price chart for each one.  |

### coin-cli

Built from scratch during the course.

```bash
cd coin-cli
node index.js 10   # show the top 10 coins
```

Requires Node.js 18+. See the [coin-cli README](coin-cli/README.md) for all
options and the architecture.

### crypto-dash

Started from the course's starter code and extended as the course goes on.

```bash
cd crypto-dash
npm install
npm run dev
```

See the [crypto-dash README](crypto-dash/README.md) for the build and preview
commands.

## Sources and credits

- **Video:** [Claude Code Crash Course For Developers](https://www.youtube.com/watch?v=C2GpeepcmYs)
  by Brad Traversy
- **Prompt snippets used in the course:**
  [gist by bradtraversy](https://gist.github.com/bradtraversy/9937e0ecfc8a5b269ce6a885636670dc)
- **crypto-dash starter code:** cloned from
  [bradtraversy/crypto-dash](https://github.com/bradtraversy/crypto-dash).
  The original commit history was imported with the code, so Brad's commits
  come first in the history of `crypto-dash/` and my own changes follow them.
  To see only the original commits:

  ```bash
  git log --oneline 9db3385
  ```

## Course notes

[`notes.pptx`](notes.pptx) has my general notes on Claude Code from the
course. Open it in PowerPoint or any other `.pptx` viewer.
