// Since this is the initial stages, im not gonna over engineer this

import { useState, useEffect } from "react"

export const SettingsModal = ({ onClose }) => {
  const [secretKey, setSecretKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    window.settings.getSettings().then((settings) => {
      console.log("settings loaded", settings)
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
    <div className="text-white bg-neutral-900 border border-neutral-800 w-[40vw] h-auto p-4 flex flex-col gap-4">
      <h1 className="font-bold text-lg">Settings</h1>

      <p className="text-sm text-neutral-400">Please use OpenAI library compatible API keys and Base Urls </p>
      <div className="flex flex-col gap-2">
        <label className="text-sm">API Key</label>
        <div className="flex gap-2">
          <input
            type={showKey ? "text" : "password"}
            placeholder="eq. Aasdasd"
            className="border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-sm flex-1"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />
          <button
            className="font-bold text-xs border shadow-[3px_3px_0px_rgba(0,0,0,0.9)] px-2 py-0.5 border-red-700 bg-red-800 hover:bg-red-700 hover:border-red-600"
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

      <div className="flex gap-2 justify-end mt-2">
        <button
          className="font-bold text-xs border shadow-[3px_3px_0px_rgba(0,0,0,0.9)] px-1 py-0.5  border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className="font-bold text-xs border shadow-[3px_3px_0px_rgba(0,0,0,0.9)] px-1 py-0.5  bg-orange-700 border-orange-600 hover:bg-orange-600 hover:border-orange-500"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  )
}
