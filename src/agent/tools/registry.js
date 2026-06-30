import { gitDiffTool } from "./git/git-diff";
import { gitDiffNumStatTool } from "./git/git-diff-numstat";
import { gitStatusTool } from "./git/git-status";
import { stageAllTool, stageFilesTool, unstageFilesTool } from "./git/staging";

class ToolRegistry {
  tools = new Map();

  register(tool) {
    this.tools.set(tool.name, tool);
  }

  get(toolName) {
    return this.tools.get(toolName);
  }

  // For openai npm lib to use
  definitions() {
    return [...this.tools.values()].map(t => t.definition);
  }
}

export function initializeToolRegistry() {
  console.log("Creating registry!")
  registry = new ToolRegistry();

  // register all tool calls here
  registry.register(gitDiffTool);
  registry.register(gitDiffNumStatTool);
  registry.register(gitStatusTool);
  registry.register(stageFilesTool);
  registry.register(stageAllTool);
  registry.register(unstageFilesTool);
}

export function getRegistry() {
  if (!registry) throw new Error("Registry not initialized — call initializeToolRegistry() first");
  return registry;
}

let registry = null;
