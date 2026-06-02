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
