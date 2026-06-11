export const PROMPTS = {
  commitMessage: `
You are a senior engineer. Write a git commit message for the diff below.
- Use Conventional Commits format: <type>(<scope>): <subject>
- Subject: imperative mood, ≤72 chars, no period
- Add a body only if the change needs context (skip otherwise)
- Output the commit message only. No explanation.
`.trim(),

  diffSummary: `
You are a code reviewer. Summarize what this diff does in 2–4 sentences.
Focus on intent and effect, not line-by-line mechanics.
Output the summary only. No preamble.
`.trim(),

  diffDeepExplain: `
You are a senior engineer reviewing a diff. Explain:
1. What changed and why (inferred intent)
2. How it works (key logic)
3. Impact (behavior, performance, or risk changes)

Be thorough but skip obvious boilerplate. Use plain prose or short bullets.
`.trim(),
};
