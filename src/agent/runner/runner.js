import { emitAgentEvent } from "../../events/eventBus";
import { getLLMClient } from "../../services/llm.service";
import { executeToolCall } from "../tools/execute-tools";
import { getRegistry } from "../tools/registry";

const MAX_STEPS = 25;

export async function runLoop(messages, model) {
  console.log("messages", messages, "model", model);

  const registry = getRegistry();
  const tools = registry.definitions();
  const client = getLLMClient(); // this function may be moved to another place, its 1am rn, i cant be bothered

  console.log("active tools", tools);

  emitAgentEvent({
    type: "message",
    message: "AGENT: Got it, working on it.",
    tool: "",
    params: ""
  })

  let count = 0;
  while (count < MAX_STEPS) {
    count++;
    console.log(
      `[Runner] Step ${count + 1}/${MAX_STEPS} — ${messages.length} messages in context`,
    );
    let res;
    try {
      res = await client.chat.completions.create({
        model: "gemini-3.1-flash-lite",
        messages: messages,
        tools: tools,
        tool_choice: "auto",
      });
      // console.log(`[Runner] API response received — finish_reason: ${res.choices[0]?.finish_reason}`);
    } catch (e) {
      console.error(`[Runner] API call failed at step ${count + 1}:`, e);
      throw new Error(e.message);
    }

    const message = res.choices[0].message;
    messages.push(message);

    if (!message.tool_calls?.length) {
      console.log(
        `[Runner] No tool calls — returning final content (${message.content?.length ?? 0} chars)`,
      );
      return message.content;
    }

    console.log(`[Runner] ${message.tool_calls.length} tool call(s) returned`);

    let rounds = 0; // temp debugging
    for (const toolCall of message.tool_calls) {
      console.log(
        `[Runner] Executing tool: ${toolCall.function?.name} (id: ${toolCall.id})`,
      );
      emitAgentEvent({
        type: "tool_call",
        message: "",
        tool: toolCall.function?.name,
        params: toolCall.function.arguments
      })
      let toolResult;
      try {
        toolResult = await executeToolCall(toolCall);
        console.log(
          `[Runner] Tool ${toolCall.function?.name} result AA: ${toolResult}`,
        );
      } catch (e) {
        console.error(
          `[Runner] Tool ${toolCall.function?.name} failed:`,
          e.message,
        );
        throw new Error(e.message); // return the error back to the model
      }

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(toolResult),
      });
    }
    // while (message.tool_calls?.length || rounds > 10) {
    // }
  }
  console.warn(`[Runner] Exited after reaching MAX_STEPS (${MAX_STEPS})`);
}
