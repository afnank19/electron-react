import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function runGit(cwd, args, { raw = false, color = false } = {}) {
  // Enable forced ANSII color for viewer
  if (color) {
    args = ["-c", "color.ui=always", ...args];
  }

  try {
    const { stdout, stderr } = await execFileAsync("git", args, { cwd });
    const output = `${stdout}${stderr}`;
    return raw ? stdout : output.trim();
  } catch (err) {
    const output = `${err.stdout || ""}${err.stderr || ""}`.trim();
    throw new Error(output || err.message);
  }
}
