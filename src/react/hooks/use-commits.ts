import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeyStore } from "../queries/queryKeys";
import { commit, getCommits } from "../api/git-api/git-commit-api";

export function useCommits(repoPath: string) {
  const commitQuery = useQuery({
    queryKey: queryKeyStore.commit(repoPath),
    queryFn: () => {
      return getCommits(repoPath);
    },
    refetchOnWindowFocus: true
  })

  const commitMutation = useMutation({
      mutationFn: async (commitMsg: string) => {
        return commit(repoPath, commitMsg);
      },
  });

  // This needs to be redone to use the new agent
  const genCommitMsgMutation = useMutation({
    mutationFn: async () => {
      const headDiff = await window.gitAPI.getHeadDiff(repoPath);
      console.log("head diff", headDiff);
      // return generateCommitMessage(headDiff);
      return window.ai.commitMsg(headDiff);
    },
  });

  return {
    commitQuery,
    genCommitMsgMutation,
    commitMutation
  }
}
