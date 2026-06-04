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
