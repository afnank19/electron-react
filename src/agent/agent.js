import { useChatStore } from "../react/state/chat-store";
import { SYSTEM_PROMPT } from "./prompts";
import { runLoop } from "./runner/runner";

// Still thinking about how this should look architecturally
// currently, im just going to try to get it to work! hence the hard coding :P

class Agent {
  model = "gemini-3.1-flash-lite";

  async run(request, ctx) {
    console.log("[AGENT REQ]", request);
    const reqAndCtx = buildContext(request, ctx);
    console.log("son: ", reqAndCtx);

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...reqAndCtx,
      // { role: "assistant", content: "Hi" },
      // { role: "user", content: request }
    ];

    console.log("Messages and Context", messages);

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

function buildContext(request, ctx) {
  const conversationContext = [];

  // I do not like this one bit
  // massively needs improvement

  if (ctx !== null) {
    ctx.forEach((item) => {
      let role = "user";
      if (item.type === "message") {
        role = "assistant";
        conversationContext.push({
          role: role,
          content: item.message,
        });
      } else if (item.type === "tool_call") {
        role = "assistant";
        conversationContext.push({
          role: role,
          content: "Used tool " + item.tool + " with parameter/s " + item.params,
        });
      } else if (item.type === "user") {
        role = "user";
        conversationContext.push({
          role: role,
          content: item.message,
        });
      }
    });
  }

  conversationContext.push({
    role: "user",
    content: request,
  });

  return conversationContext;
}
