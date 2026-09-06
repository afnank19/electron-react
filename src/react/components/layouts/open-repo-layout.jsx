import React, { useEffect, useState } from "react";
import { OpenRepo } from "../open-repo";
import { useRepoStore } from "../../state/repo-store";
import ErrorMsg from "../primitives/error-msg";
import MaskedText from "../primitives/masked-text";
import { ArrowDown, ArrowUp, FolderGit, MoveDownIcon, MoveUpIcon, SettingsIcon } from "lucide-react";
import { Modal } from "../primitives/modal";
import { SettingsModal } from "../modals/settings-modal";
import { getFolderName } from "../../utils/utils";
import { GitBranchDropdown } from "../git-branch/git-branch-dropdown";
import { GitBranchDropdownTrigger } from "../git-branch/git-dropdown-trigger";
import { useAheadBehindCount } from "../../hooks/use-changes";

const OpenRepoLayout = () => {
  const repoPath = useRepoStore((state) => state.repoPath);
  const [userEmail, setUserEmail] = useState("************");
  const [pathErr, setPathErr] = useState("");

  const aheadBehindQuery = useAheadBehindCount(repoPath);

  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    if (repoPath == null) {
      return;
    }

    window.gitAPI.userEmail(repoPath).then(setUserEmail);
  }, [repoPath]);

  return (
    <div className="flex justify-between border-t border-neutral-800 px-2">
      <div className="flex items-center">
        <div className="border-r border-neutral-800 px-2 py-1">
          <p className="text-left text-xs text-neutral-400">Current Repository</p>
          <p className="flex items-center gap-2 text-sm font-bold">
            <FolderGit size={20} strokeWidth={1.5} />
            {getFolderName(repoPath)}
          </p>
        </div>
        <div className="border-r border-neutral-800 px-2 py-1 font-bold">
          <p className="text-left text-xs font-medium text-neutral-400">User Email</p>
          <MaskedText text={userEmail} />
        </div>
        {/* <ErrorMsg prefix={"INFO"} message={pathErr} type={"error"}/>*/}
        <div className="cursor-pointer border-r border-neutral-800 px-2 py-1 select-none hover:bg-neutral-800">
          <GitBranchDropdown trigger={<GitBranchDropdownTrigger />} />
        </div>
        {aheadBehindQuery.isLoading ? null :
          aheadBehindQuery.isError ? null :
            aheadBehindQuery.data[0] === "-1" ? null :
              <div className="border-r border-neutral-800 px-2 py-1">
                <p className="text-left text-xs text-neutral-400">Ahead / Behind</p>
                <div>
                  <div className="flex gap-4">
                    <p className="flex items-center">
                      {aheadBehindQuery.data[0]}
                      <MoveUpIcon size={14} strokeWidth={1.5} className="text-neutral-400"/>
                    </p>
                    <p className="flex items-center">
                      {aheadBehindQuery.data[1]}
                      <MoveDownIcon size={14} strokeWidth={1.5} className="text-neutral-400"/>
                    </p>
                  </div>
                </div>
              </div>
        }
      </div>
      {/* <OpenRepo pathErr={pathErr} setPathErr={setPathErr} />*/}
      <div className="flex items-center overflow-hidden">
        <button className="transition-all hover:rotate-45 hover:text-neutral-100" onClick={() => setShowSettingsModal(true)}>
          <SettingsIcon />
        </button>
      </div>

      <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)}>
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      </Modal>
    </div>
  );
};

export default OpenRepoLayout;
