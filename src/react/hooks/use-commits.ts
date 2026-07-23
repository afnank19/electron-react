import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeyStore } from "../queries/queryKeys";
import { commit, getCommits } from "../api/git-api/git-commit-api";
import { generateCommitMsg } from "../api/agent-api/agent-functions-api";

export function useCommits(repoPath: string) {
  const commitQuery = useQuery({
    queryKey: queryKeyStore.commit(repoPath),
    queryFn: () => {
      return getCommits(repoPath);
    },
    refetchOnWindowFocus: true,
  });

  const commitMutation = useMutation({
    mutationFn: async (commitMsg: string) => {
      return commit(repoPath, commitMsg);
    },
  });

  // This needs to be redone to use the new agent
  // This is using the new function , but the api structure is the old one.
  const genCommitMsgMutation = useMutation({
    mutationFn: async () => {
      // const headDiff = "No changes";
      // console.log("head diff", headDiff);
      // // return generateCommitMessage(headDiff);
      // return window.ai.commitMsg(headDiff);
      return generateCommitMsg();
    },
  });

  return {
    commitQuery,
    genCommitMsgMutation,
    commitMutation,
  };
}
