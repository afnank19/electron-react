import OpenAI from "openai";

export const PROMPTS = {
  commitMessage: `
You are a senior engineer. Write a git commit message for the diff below.
- Use Conventional Commits format: <type>(<scope>): <subject>
- Subject: imperative mood, no period
- Add a body only if the change needs context (skip otherwise)
- Output the commit message only. No explanation.
- Keep the commit message shorter than 80 characters
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

const client = new OpenAI({
  apiKey: process.env.GITSAGE_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  // dangerouslyAllowBrowser: true,
});

const MODEL = "gemini-3.1-flash-lite";

export async function generateCommitMessage(diff) {
  console.log("diff for commit msg", diff);
  console.log("env", process.env.GITSAGE_KEY);

  const res = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: PROMPTS.commitMessage,
      },
      {
        role: "user",
        content: diff,
      },
    ],
  });

  console.log("Result from LLM", res);
  return res.choices[0].message.content;
}
