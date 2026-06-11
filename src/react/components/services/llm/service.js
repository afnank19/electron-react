import { client } from "./openai";
import { PROMPTS } from "./prompt";

export async function generateCommitMessage(diff) {
  const res = await client.responses.create({
    model: "openai/gpt-oss-120b",
    instructions: PROMPTS.commitMessage,
    input: diff
  })

  console.log("Result from LLM", res);
  return res.output_text;
}
