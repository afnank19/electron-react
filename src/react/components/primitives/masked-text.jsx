import React, { useState } from "react";

const MaskedText = ({ text }) => {
  const [revealed, setRevealed] = useState(false);

  const handleRevealClick = () => {
    setRevealed(!revealed);
  };

  return (
    <div className="flex gap-2 items-center">
      <p>Local Email: </p>
      <p>{revealed ? text : "*".repeat(text.length)}</p>
      <button
        onClick={handleRevealClick}
        className="font-bold text-xs border rounded-lg px-2 py-1 border-neutral-700 hover:bg-neutral-800"
      >
        {" "}
        {revealed ? "Hide" : "Show"}{" "}
      </button>
    </div>
  );
};

export default MaskedText;
