// Since this is the initial stages, im not gonna over engineer this

import { useState, useEffect } from "react";

export const SettingsModal = ({ onClose }) => {
  const [secretKey, setSecretKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    window.settings.getSettings().then((settings) => {
      console.log("settings loaded", settings);
      if (true) {
        setSecretKey(settings.apiKey ?? "");
        setBaseUrl(settings.baseURL ?? "");
      }
    });
  }, []);

  function handleSave() {
    window.settings.setSettings({ apiKey: secretKey, baseURL: baseUrl });
    onClose();
  }

  function handleCancel() {
    onClose();
  }

  return (
    <div className="flex h-auto w-[40vw] flex-col gap-4 border border-neutral-800 bg-neutral-900 p-4 text-white">
      <h1 className="text-lg font-bold">Settings</h1>

      <p className="text-sm text-neutral-400">
        Please use OpenAI library compatible API keys and Base Urls{" "}
      </p>
      <div className="flex flex-col gap-2">
        <label className="text-sm">API Key</label>
        <div className="flex gap-2">
          <input
            type={showKey ? "text" : "password"}
            placeholder="eq. Aasdasd"
            className="flex-1 border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-sm"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />
          <button
            className="border border-red-700 bg-red-800 px-2 py-0.5 text-xs font-bold shadow-[3px_3px_0px_rgba(0,0,0,0.9)] hover:border-red-600 hover:bg-red-700"
            onClick={() => setShowKey((prev) => !prev)}
          >
            {showKey ? "Hide" : "Reveal"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm">Base URL</label>
        <input
          placeholder="openai"
          className="border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-sm"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <button
          className="border border-neutral-700 bg-neutral-800 px-1 py-0.5 text-xs font-bold shadow-[3px_3px_0px_rgba(0,0,0,0.9)] hover:border-neutral-600 hover:bg-neutral-700"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className="border border-orange-600 bg-orange-700 px-1 py-0.5 text-xs font-bold shadow-[3px_3px_0px_rgba(0,0,0,0.9)] hover:border-orange-500 hover:bg-orange-600"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};
