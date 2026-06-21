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
    <div className="text-white bg-neutral-900 border border-neutral-800 rounded-2xl w-[40vw] h-auto p-4 flex flex-col gap-4">
      <h1 className="font-bold text-lg">Settings</h1>

      <p className="text-sm text-neutral-400">Please use OpenAI library compatible API keys and Base Urls </p>
      <div className="flex flex-col gap-2">
        <label className="text-sm">API Key</label>
        <div className="flex gap-2">
          <input
            type={showKey ? "text" : "password"}
            placeholder="eq. Aasdasd"
            className="border border-neutral-700 rounded-lg px-2 py-1.5 text-sm flex-1"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />
          <button
            className="font-bold text-xs border rounded-lg px-2 border-neutral-700 hover:bg-neutral-700"
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
          className="border border-neutral-700 rounded-lg px-2 py-1.5 text-sm "
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
      </div>

      <div className="flex gap-2 justify-end mt-2">
        <button
          className="font-bold text-xs border rounded-lg px-3 py-1.5 border-neutral-700 hover:bg-neutral-700"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className="font-bold text-xs border rounded-lg px-3 py-1.5 border-blue-600 hover:bg-blue-600"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  )
}
