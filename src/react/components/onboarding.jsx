import { FolderGit, Info } from "lucide-react";
import { OpenRepo } from "./open-repo";
import { RecentRepos } from "./onboarding/recent-repos";

export const Onboarding = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="mx-2 my-8 flex w-full max-w-2xl flex-col gap-4">
        <div>
          <p className="text-xl font-bold">Welcome to Circe.</p>
          <p className="text-neutral-300">
            A git client complete with agentic features that help you focus on the important bits in
            this fast paced world.
          </p>
        </div>
        <div className="my-4 flex items-center justify-between gap-1 rounded-2xl border border-neutral-800 bg-neutral-900 p-2">
          <div className="flex items-center gap-2">
            <Info color="#51a2ff" />
            <p>You currently have NO REPOSITORY opened.</p>
          </div>
          <OpenRepo>
            <p className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-100 px-2 py-1 text-sm font-bold text-neutral-800 shadow-xl hover:border-neutral-300 hover:bg-neutral-200">
              <FolderGit size={18} />
              Open Repository
            </p>
          </OpenRepo>
        </div>

        <div className="my-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-2">
          <p className="text-lg font-bold">What's new</p>
          {[
            "Have multiple repositories opened through a tab system.",
            "Coming back after a few days? Have the clanker summarize current changes.",
            "View diffs for any changed file or commit.",
          ].map((item) => (
            <div
              key={item}
              className="my-2 flex items-center gap-3 rounded-xl border border-neutral-700 bg-neutral-800 px-2 py-1"
            >
              <div className="h-2 w-2 rounded-full bg-zinc-400" />
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">{item}</p>
            </div>
          ))}
        </div>
        <RecentRepos />
      </div>
    </div>
  );
};
