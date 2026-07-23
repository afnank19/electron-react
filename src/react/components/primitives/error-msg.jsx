import React from "react";
const ErrorMsg = ({ prefix, message, type }) => {
  if (type === "error") {
    return (
      <div className="flex w-full items-center gap-1 bg-red-950/30">
        <div className="h-[14px] w-[2px] bg-red-600"></div>
        <p className="font-mono text-sm text-red-400">{prefix + ": " + message}</p>
      </div>
    );
  } else if (type === "warning") {
    return (
      <div className="flex w-full items-center gap-1 bg-yellow-950/30">
        <div className="h-[14px] w-[2px] bg-yellow-600"></div>
        <p className="font-mono text-sm text-yellow-400">{prefix + ": " + message}</p>
      </div>
    );
  } else {
    return (
      <div className="flex w-full items-center gap-1 bg-green-950/30">
        <div className="h-[14px] w-[2px] bg-green-600"></div>
        <p className="font-mono text-sm text-green-400">{prefix + ": " + message}</p>
      </div>
    );
  }
};

export default ErrorMsg;
