import { useEffect } from "react";
import { useGitLogStore } from "../state/repo-store";
import type { AgentEvent } from "../../events/eventBus";

export function useAgentEvents() {
  const addLog = useGitLogStore((s) => s.addLog);

  useEffect(() => {
    const unsubscribe = window.agentEvents.subscribe((event: AgentEvent) => {
          addLog(buildLog(event));
        });

    return unsubscribe;
  }, [addLog])
}

// temporary function to test the events
// need to redo how logging works, because currently it is not typed
// and pretty buns lowk.
function buildLog(event: AgentEvent) {
  return `${event.message}\n${event.tool !== "" ? event.tool : "No tool invocations"}`;
}
