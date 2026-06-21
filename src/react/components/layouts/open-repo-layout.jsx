import React, { useEffect, useState } from "react";
import { OpenRepo } from "../open-repo";
import { useRepoStore } from "../../state/repo-store";
import ErrorMsg from "../primitives/error-msg";
import MaskedText from "../primitives/masked-text";
import { FolderGit, SettingsIcon } from "lucide-react";
import { Modal } from "../primitives/modal";
import { SettingsModal } from "../modals/settings-modal";

const OpenRepoLayout = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  const [userEmail, setUserEmail] = useState("************");
  const [pathErr, setPathErr] = useState("");

  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    if (repoPath == null) {
      return;
    }

    window.gitAPI.userEmail(repoPath).then(setUserEmail);
  }, [repoPath]);

  return (
    <div className="flex px-2 py-1 border-t border-neutral-800 justify-between overflow-hidden">
      <div className="my-1 flex  gap-2">
        <p className="flex gap-2 items-center font-mono text-sm">
          <FolderGit size={ 20 } strokeWidth={1.5} />
          {repoPath} |
        </p>
        <MaskedText text={userEmail} />
        {/* <ErrorMsg prefix={"INFO"} message={pathErr} type={"error"}/>*/}
      </div>
      {/* <OpenRepo pathErr={pathErr} setPathErr={setPathErr} />*/}
      <button className="hover:rotate-45 transition-all" onClick={() => setShowSettingsModal(true)}><SettingsIcon /></button>

      <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)}>
        <SettingsModal onClose={() => setShowSettingsModal(false)}/>
      </Modal>
    </div>
  );
};

export default OpenRepoLayout;
