import React from "react";
const ErrorMsg = ({ prefix, message, type }) => {
  if (type === "error") {
    return (
      <div className="flex gap-1 items-center bg-red-950/30 w-full">
        <div className="w-[2px] h-[14px] bg-red-600"></div>
        <p className="text-red-400 font-mono text-sm">
          {prefix + ": " + message}
        </p>
      </div>
    );
  } else if (type === "warning") {
    return (
      <div className="flex gap-1 items-center bg-yellow-950/30 w-full">
        <div className="w-[2px] h-[14px] bg-yellow-600"></div>
        <p className="text-yellow-400 font-mono text-sm">
          {prefix + ": " + message}
        </p>
      </div>
    );
  } else {
    return (
      <div className="flex gap-1 items-center bg-green-950/30 w-full">
        <div className="w-[2px] h-[14px] bg-green-600"></div>
        <p className="text-green-400 font-mono text-sm">
          {prefix + ": " + message}
        </p>
      </div>
    );
  }
};

export default ErrorMsg;
