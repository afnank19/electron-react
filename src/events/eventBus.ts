import EventEmitter from "events";
import type { ChatItemType } from "../react/state/chat-store";

export const eventBus = new EventEmitter;

export function emitAgentEvent(event: AgentEvent) {
  eventBus.emit("agent:event", event);
}

export type AgentEvent = {
  type: ChatItemType,
  message: string,
  tool: string
}
