import { SYSTEM_PROMPT } from "./prompts";
import { runLoop } from "./runner/runner";

// Still thinking about how this should look architecturally
// currently, im just going to try to get it to work! hence the hard coding :P

class Agent {
  model = "gemini-3.1-flash-lite";

  async run(request) {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: request }
    ];

    try {
      const result = runLoop(messages, this.model);

      return result;
    } catch (e) {
      throw new Error(e.message);
    }
  }
}

let agent = null;

// This could take arguments for the type of agent to be initialized
// but we only have one for now
export function initializeAgent() {
  agent = new Agent();
}

export function getAgent() {
  if (!agent) throw new Error("Agent not initialized — call initializeAgent() first");
  return agent;
}
