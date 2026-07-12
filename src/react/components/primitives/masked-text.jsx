import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

const MaskedText = ({ text }) => {
  const [revealed, setRevealed] = useState(false);

  const handleRevealClick = () => {
    setRevealed(!revealed);
  };

  return (
    <div className="flex gap-2 items-center">
      <p className="text-sm">{revealed ? text : "*".repeat(text.length)}</p>
      <button
        onClick={handleRevealClick}
        className="font-bold text-xs border rounded-md px-2 border-neutral-700 hover:bg-neutral-600"
      >
        {" "}
        {revealed ? <Eye size={16}/> : <EyeOff size={16} />}{" "}
      </button>
    </div>
  );
};

export default MaskedText;
