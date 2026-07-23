export function splitByNewLine(str) {
  return str.split("\n");
}

// gpt'd
export function getFolderName(folderPath) {
  return folderPath
    .replace(/[\\/]+$/, "") // remove trailing slash/backslash
    .split(/[\\/]/) // split on both separators
    .pop();
}

export function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function parseNumstat(numstat) {
  const splitNumstat = splitByNewLine(numstat);
  const processedNumstat = [];

  splitNumstat.forEach((item) => {
    const splitItem = item.split("\t");

    const numstatItemObj = {
      additions: splitItem[0],
      deletions: splitItem[1],
      filePath: splitItem[2],
    };

    processedNumstat.push(numstatItemObj);
  });

  return processedNumstat;
}

// Here path for renamed version will not be correct
export function parseGitStatusPorcelain(output) {
  return output
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const indexSymbol = line[0];
      const workingTreeSymbol = line[1];

      let path = line.slice(3);

      // Handle renames
      let filename = path;

      if (path.includes(" -> ")) {
        filename = path.split(" -> ")[1];
      } else {
        filename = path.split("/").pop();
      }

      return {
        filename,
        path,
        staged: indexSymbol !== " " && indexSymbol !== "?",
        workingTreeSymbol,
        indexSymbol,
      };
    });
}

// If i need this function, i'll implement it later on
function parseGitStatusPorcelainV2(output) {
  return output
    .split("\n")
    .filter(Boolean)
    .map((raw) => {
      const indexSymbol = raw[0];
      const workingTreeSymbol = raw[1];
      const status = raw.slice(0, 2);

      let path = raw.slice(3);

      let currentPath = path;
      let oldPath = null;

      if (path.includes(" -> ")) {
        [oldPath, currentPath] = path.split(" -> ");
      }

      const filename = currentPath.split("/").pop();

      const lastDot = filename.lastIndexOf(".");
      const basename = lastDot > 0 ? filename.slice(0, lastDot) : filename;
      const extension = lastDot > 0 ? filename.slice(lastDot + 1) : "";

      const directory = currentPath.includes("/")
        ? currentPath.substring(0, currentPath.lastIndexOf("/"))
        : "";

      const staged = indexSymbol !== " " && indexSymbol !== "?";

      const unstaged = workingTreeSymbol !== " " && workingTreeSymbol !== "?";

      const partiallyStaged = staged && unstaged;

      const modified = indexSymbol === "M" || workingTreeSymbol === "M";

      const added = indexSymbol === "A" || workingTreeSymbol === "A";

      const deleted = indexSymbol === "D" || workingTreeSymbol === "D";

      const renamed = indexSymbol === "R" || workingTreeSymbol === "R";

      const copied = indexSymbol === "C" || workingTreeSymbol === "C";

      const conflicted =
        indexSymbol === "U" ||
        workingTreeSymbol === "U" ||
        status === "DD" ||
        status === "AU" ||
        status === "UD" ||
        status === "UA" ||
        status === "DU" ||
        status === "AA" ||
        status === "UU";

      const untracked = status === "??";
      const ignored = status === "!!";

      let stageState = "clean";

      if (conflicted) {
        stageState = "conflicted";
      } else if (untracked) {
        stageState = "untracked";
      } else if (partiallyStaged) {
        stageState = "both";
      } else if (staged) {
        stageState = "staged";
      } else if (unstaged) {
        stageState = "unstaged";
      }

      let label = "Unknown";
      let icon = "file";

      if (conflicted) {
        label = "Conflict";
        icon = "conflict";
      } else if (untracked) {
        label = "Untracked";
        icon = "plus";
      } else if (renamed) {
        label = "Renamed";
        icon = "rename";
      } else if (copied) {
        label = "Copied";
        icon = "copy";
      } else if (deleted) {
        label = "Deleted";
        icon = "trash";
      } else if (added) {
        label = "Added";
        icon = "plus";
      } else if (modified) {
        label = "Modified";
        icon = "edit";
      }

      if (partiallyStaged) {
        label += " (staged + unstaged)";
      }

      return {
        filename,
        basename,
        extension,

        path,
        directory,

        currentPath,
        oldPath,

        status,
        indexSymbol,
        workingTreeSymbol,
        raw,

        staged,
        unstaged,
        partiallyStaged,

        modified,
        added,
        deleted,
        renamed,
        copied,
        conflicted,
        untracked,
        ignored,

        label,
        icon,
        stageState,
      };
    });
}
