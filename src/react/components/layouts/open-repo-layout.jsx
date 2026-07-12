import React, { useEffect, useState } from "react";
import { OpenRepo } from "../open-repo";
import { useRepoStore } from "../../state/repo-store";
import ErrorMsg from "../primitives/error-msg";
import MaskedText from "../primitives/masked-text";
import { FolderGit, SettingsIcon } from "lucide-react";
import { Modal } from "../primitives/modal";
import { SettingsModal } from "../modals/settings-modal";
import { getFolderName } from "../../utils/utils";
import { GitBranchDropdown } from "../git-branch/git-branch-dropdown";
import { GitBranchDropdownTrigger } from "../git-branch/git-dropdown-trigger";

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
    <div className="flex px-2 border-t border-neutral-800 justify-between">
      <div className="flex items-center">
        <div className="px-2 py-1 border-r border-neutral-800">
          <p className="text-xs text-left text-neutral-400">Current Repository</p>
          <p className="flex gap-2 items-center text-sm font-bold">
            <FolderGit size={20} strokeWidth={1.5} />
            {getFolderName(repoPath)}
          </p>
        </div>
        <div className="border-r border-neutral-800 py-1 px-2 font-bold">
          <p className="text-xs text-left text-neutral-400 font-medium">User Email</p>
          <MaskedText text={userEmail} />
        </div>
        {/* <ErrorMsg prefix={"INFO"} message={pathErr} type={"error"}/>*/}
        <div className="border-r border-neutral-800 py-1 px-2 hover:bg-neutral-800 cursor-pointer select-none">
          <GitBranchDropdown
            trigger={<GitBranchDropdownTrigger />}
          />
        </div>
        {/* <div>
          <GitBranchDropdown
            trigger={<div>Branching buddy</div>}
          />
        </div>*/}
      </div>
      {/* <OpenRepo pathErr={pathErr} setPathErr={setPathErr} />*/}
      <button
        className="hover:rotate-45 transition-all"
        onClick={() => setShowSettingsModal(true)}
      >
        <SettingsIcon />
      </button>

      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      >
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      </Modal>
    </div>
  );
};

export default OpenRepoLayout;
