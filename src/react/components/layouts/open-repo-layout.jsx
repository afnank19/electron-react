import React, { useEffect, useState } from "react";
import { OpenRepo } from "../open-repo";
import { useRepoStore } from "../../state/repo-store";
import ErrorMsg from "../primitives/error-msg";
import MaskedText from "../primitives/masked-text";

const OpenRepoLayout = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  const [userEmail, setUserEmail] = useState("************");
  const [pathErr, setPathErr] = useState("");

  useEffect(() => {
    if (repoPath == null) {
      return;
    }

    window.gitAPI.userEmail(repoPath).then(setUserEmail);
  }, [repoPath]);

  return (
    <div className="flex m-2">
      <div>
        <p className="font-bold">{"Active Repository: " + repoPath}</p>
        <MaskedText text={userEmail} />
        {/* <ErrorMsg prefix={"INFO"} message={pathErr} type={"error"}/>*/}
      </div>
      {/* <OpenRepo pathErr={pathErr} setPathErr={setPathErr} />*/}
    </div>
  );
};

export default OpenRepoLayout;
