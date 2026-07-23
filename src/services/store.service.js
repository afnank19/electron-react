import Store from "electron-store";

export const store = new Store({
  defaults: {
    apiKey: "",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  },
});
