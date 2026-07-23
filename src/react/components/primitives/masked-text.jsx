import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

const MaskedText = ({ text }) => {
  const [revealed, setRevealed] = useState(false);

  const handleRevealClick = () => {
    setRevealed(!revealed);
  };

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm">{revealed ? text : "*".repeat(text.length)}</p>
      <button
        onClick={handleRevealClick}
        className="border border-neutral-700 bg-neutral-800 px-1 py-0.5 text-xs font-bold shadow-[3px_3px_0px_rgba(0,0,0,0.9)] hover:border-neutral-600 hover:bg-neutral-700"
      >
        {" "}
        {revealed ? <Eye size={16} /> : <EyeOff size={16} />}{" "}
      </button>
    </div>
  );
};

export default MaskedText;
