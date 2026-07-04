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

  console.log("FE UTILS SPLIT NUMSTAT", splitNumstat);

  const processedNumstat = [];

  splitNumstat.forEach((item) => {
    console.log("FE UTILS PROCESSING ITEM", item);

    const splitItem = item.split("\t");

    console.log("split singular item", splitItem);
    const numstatItemObj = {
      additions: splitItem[0],
      deletions: splitItem[1],
      filePath: splitItem[2],
    };

    console.log("num obj", numstatItemObj);

    processedNumstat.push(numstatItemObj);
  });
  console.log("bruh");
  console.log("SONION", processedNumstat);

  return processedNumstat;
}
