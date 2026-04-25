import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    window.gitAPI.getStatus().then((status) => {
      console.log(status);
    });
  }, []);

  return (
    <div className="font-mono">
      This is the beginning of your React + Electron Journey
    </div>
  );
};

export default App;
