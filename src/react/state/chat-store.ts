import { create } from "zustand";

export type ChatItem = {
  type: ChatItemType;
  message: string;
  tool?: string;
  params?: any;
};

export type ChatItemType = "tool_call" | "message" | "log" | "user";

type ChatStore = {
  items: ChatItem[];
  addItem: (item: ChatItem) => void;
  clearItems: () => void;
  removeItem: (index: number) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  clearItems: () =>
    set({
      items: [],
    }),

  removeItem: (index) =>
    set((state) => ({
      items: state.items.filter((_, i) => i !== index),
    })),
}));
