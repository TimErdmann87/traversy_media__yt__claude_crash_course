---
name: review-code
description: Review the uncommitted changes in this repo with the read-only code-reviewer subagent, and show its markdown report grouped by severity. Use this whenever the user runs /review-code or says "review my code", "run the reviewer" or "review my changes". It only reports and never edits files.
---

# Review code

1. Launch the `code-reviewer` subagent with the Agent tool (`subagent_type: code-reviewer`), in the foreground, because the next step needs its result. Ask it to review all uncommitted changes. If the user named a folder or file to focus on, add that to the prompt.
2. Show the user the report exactly as the subagent returned it. Don't shorten it, reorder it or change its severities.
3. Don't fix anything, not even an obvious one-line fix. After the report, offer in one line to fix whichever findings the user picks.

If the `code-reviewer` subagent isn't available (for example, because it was added after this session started), tell the user to restart the session or open `/agents` to load it. Don't do the review yourself instead.
