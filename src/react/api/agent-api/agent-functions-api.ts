export async function generateCommitMsg(): Promise<string> {
  const res = await window.ai.commitMsg();
  return res;
}
