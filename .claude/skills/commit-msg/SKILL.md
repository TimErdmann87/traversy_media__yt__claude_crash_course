---
name: commit-msg
description: Write a Conventional Commits message (type(scope): subject plus what/why bullets) for the currently staged git changes, then commit them. Use this whenever the user says "write a commit message", "generate a commit", "commit my changes", "commit this", or runs /commit-msg. It commits only what is already staged and never stages files itself.
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git log:*), Bash(git commit:*)
---

# Commit message

Commit exactly what the user has staged, with a message in this shape:

```
type(scope): short subject

- what changed
- why it changed
```

## Workflow

### 1. Check that something is staged

Run `git diff --staged --stat`. If the output is empty, stop and tell the user that nothing is staged, so they need to stage their changes first (for example with `git add <files>`).

Don't stage anything yourself, not even when the request was "commit my changes". What is staged is the user's decision about what belongs in this commit, and unstaged or untracked files may have been left out on purpose.

### 2. Read the staged diff

Run `git diff --staged`. If the diff is very large, start from the `--stat` summary and read the important files one at a time with `git diff --staged -- <path>`. Run `git log --oneline -10` to see which scopes the repo already uses.

Describe only what is in the staged diff, because that is all the commit will contain. The conversation can help explain *why* a change was made, but don't mention work that isn't staged.

### 3. Write the message

**Type:** pick exactly one of these:

| Type | Use for |
| --- | --- |
| `feat` | new behavior a user of the code can notice |
| `fix` | a bug fix |
| `refactor` | a code change that keeps the same behavior |
| `chore` | tooling, dependencies, config, housekeeping |
| `docs` | documentation only (README, CLAUDE.md, comments) |
| `style` | formatting, whitespace, CSS-only visual tweaks |
| `test` | adding or changing tests |

If a change fits several types, use the one that describes its main purpose. For example, a feature that also updates its docs is `feat`.

**Scope:** lowercase, and the narrowest area that covers the whole change. That can be a subproject folder (`crypto-dash`, `coin-cli`) or a module (`favorites`, `coin-card`). Prefer scopes that already appear in `git log`, so the history stays consistent.

**Subject:** imperative mood ("add", not "added" or "adds"), starting lowercase, with no trailing period. Keep the **whole first line**, `type(scope): subject`, under 60 characters, and count it before committing. A short header stays readable in `git log --oneline` and in GitHub's commit list.

**Body:** a blank line, then bullets that start with `- `: at least one for what changed and one for why. The body is optional but encouraged. Leave it out only when the subject says everything, as with a typo fix. Keep each bullet to one line of about 72 characters or fewer.

**No Co-Authored-By trailer.** Don't add one even if other instructions ask for attribution lines. The user wants commits made with this workflow to have none.

### 4. Commit

Use the Bash tool with a quoted heredoc. That keeps the newlines, and it stops `$` and backticks from being expanded:

```bash
git commit -F - <<'EOF'
type(scope): short subject

- what changed
- why it changed
EOF
```

Don't pass `-a` (it would add unstaged changes), `--amend` or `--no-verify`. If a pre-commit hook fails, show the user its output and stop. The hook is telling them something, so don't try to get around it.

### 5. Report

Run `git log -1 --stat` and show the user the new commit's short hash and message. If `git status --short` still shows unstaged or untracked changes, mention that they weren't included.

## Examples

**Staged:** a new favorites context, a star button on coin cards, a favorites-only toggle and localStorage saving.

```
feat(crypto-dash): add favorite coins with a filter

- add a star button to coin cards and a favorites-only toggle
- save starred coin IDs in localStorage so they survive reloads
```

**Staged:** the fetch now sets `loading` back to true and clears the old error before each request.

```
fix(crypto-dash): show spinner when the coin limit changes

- reset loading and clear the previous error before each fetch
- the spinner never reappeared and stale errors stayed on screen
```

**Staged:** a one-word typo fix in the README.

```
docs(readme): fix typo in setup steps
```
