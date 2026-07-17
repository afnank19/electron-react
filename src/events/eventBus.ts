import EventEmitter from "events";

export const eventBus = new EventEmitter;

export function emitAgentEvent(event: AgentEvent) {
  eventBus.emit("agent:event", event);
}

export type AgentEvent = {
  type: AgentEventType,
  message: string,
  tool: string
}

export type AgentEventType = "tool" | "message"
