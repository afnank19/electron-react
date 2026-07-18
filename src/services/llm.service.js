// TODO: Re think architecture, the first time is probably going to be horrible

import OpenAI from "openai";
import { getFileDiffNoANSIIColor, gitDiffNumStat } from "./git.service";
import { getSettings } from "./settings.service";
import { getAgent } from "../agent/agent";

export const PROMPTS = {
  commitMessage: `
You are a senior engineer. Write a git commit message for the diff below.
- Use Conventional Commits format: <type>(<scope>): <subject>
- Subject: imperative mood, no period
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

export function getLLMClient() {
  const apiConfig = getSettings();

  if (!apiConfig.apiKey) {
    throw new Error("Please configure your API KEY from the settings");
  }

  if (!apiConfig.baseURL) {
    throw new Error("Please configure your BASE URL from the settings");
  }

  // Testing
  // "https://generativelanguage.googleapis.com/v1beta/openai/"
  return new OpenAI({
    apiKey: apiConfig.apiKey,
    baseURL: apiConfig.baseURL,
    // dangerouslyAllowBrowser: true,
  });
}

// const client = new OpenAI({
//   apiKey: process.env.GITSAGE_KEY,
//   baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
//   // dangerouslyAllowBrowser: true,
// });

const MODEL = "gemini-3.1-flash-lite";

// Could move this to the agent with a separate prompt for commit message generation
// Advantage would be that we won't burn as much tokens as before
export async function generateCommitMessage(diff) {
  console.log("diff for commit msg", diff);

  if (diff === "") {
    throw new Error("No changes yet!");
  }

  const client = getLLMClient();

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

const SYSTEM_PROMPT = `You are a concise code-change summarizer.
You will receive "git diff --numstat" output: lines of "<added> <removed> <filename>".
Decide if the numstat alone is enough to write a useful summary in Markdown.
If some files need closer inspection (significant logic changes, ambiguous purpose), call get_diffs for ONLY those files - be selective, this is expensive.
Once you have enough information, respond with a short summary of what changed and why it likely matters, grouped by area/feature. Do not include raw diffs in your output.
If file diff count from --numstat is extremely huge, 1000+ changes, ignore and do not explore that file.`;

const tools = [
  {
    type: "function",
    function: {
      name: "get_diffs",
      description: "Get git diff for specific files...",
      parameters: {
        type: "object",
        properties: {
          files: { type: "array", items: { type: "string" } },
        },
        required: ["files"],
      },
    },
  },
];

export async function diffSummaryAgent(repoPath) {
  const client = getLLMClient();

  let numStatDiff = "";
  try {
    numStatDiff = await gitDiffNumStat(repoPath);
  } catch (e) {
    throw new Error(e.message);
  }

  if (numStatDiff === "") {
    return "No changes to summarize";
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: "git diff --numstat: \n\n" + numStatDiff },
  ];

  const res = await client.chat.completions.create({
    model: MODEL,
    messages: messages,
    tools: tools,
    tool_choice: "auto",
  });

  let message = res.choices[0].message;
  messages.push(message);

  let rounds = 0;
  // rounds are 1 for now, testing hardcoded behavior, TODO: update loop handling
  while (message.tool_calls?.length && rounds < 1) {
    for (const toolCall of message.tool_calls) {
      if (toolCall.function.name == "get_diffs") {
        const { files } = JSON.parse(toolCall.function.arguments);

        const parsedFilePaths = files.join(" ");

        let diffs = "(No diff content returned)";
        try {
          diffs = await getFileDiffNoANSIIColor(repoPath, parsedFilePaths);
        } catch (e) {
          throw new Error(e.message);
        }

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: diffs,
        });
      }
    }

    const res = await client.chat.completions.create({
      model: MODEL,
      messages: messages,
      tools: tools,
      tool_choice: "auto",
    });

    message = res.choices[0].message;
    messages.push(message);
    rounds++;
  }

  return message.content;
}

export async function summarizeCurrentChanges() {
  const requestPrompt = `Can you help me summarize my current changes? In order to achieve this do the following:
    Use the numstat diff tool to get an overview of the repository changes.
    Decide if the numstat alone is enough to write a useful summary in Markdown.
    If some files need closer inspection (significant logic changes, ambiguous purpose), call get_diffs for ONLY those files - be selective, this is expensive.
    Once you have enough information, respond with a short summary of what changed and why it likely matters, grouped by area/feature. Do not include raw diffs in your output.
    If file diff count from --numstat is extremely huge, 1000+ changes, ignore and do not explore that file.
    `;

  const agent = getAgent();

  return agent.run(requestPrompt);
}

export async function handleAgentRequest(request, ctx) {
  const agent = getAgent();

  return agent.run(request, ctx);
}

export async function generateCommitMessageV2() {
  console.log("[AGENT REQUEST] Generate a commit msg my employee")

  const request = `You have to generate a commit message for the current changes. In order to achieve this do the following:
    Use the numstat diff tool to get an overview of the repository changes.
    Decide if the numstat alone is enough to write a useful summary in Markdown.
    If some files need closer inspection (significant logic changes, ambiguous purpose), call get_diffs for ONLY those files - be selective, this is expensive.
    Once you have enough information, respond with ONLY the commit message.
    Keep the commit message shorter than 80 characters.
    `;

  const agent = getAgent();

  return agent.run(request);
}
