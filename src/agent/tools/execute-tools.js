import { getRegistry } from "./registry";

export async function executeToolCall(call) {
  const registry = getRegistry();
  console.log("[TOOL EXECUTER] getting", call.function.name, "from registry");
  const tool = registry.get(call.function.name);

  const args = JSON.parse(call.function.arguments);

  return await tool.execute(args);
}
