import { store } from "./store.service";

export function getSettings() {
  return {
    apiKey: store.get("apiKey"),
    baseURL: store.get("baseURL"),
  };
}

export function setSettings(settings) {
  store.set("apiKey", settings.apiKey || "");
  store.set("baseURL", settings.baseURL || "");
}
