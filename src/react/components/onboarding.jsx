import { FolderGit, Info } from "lucide-react";
import { OpenRepo } from "./open-repo";

export const Onboarding = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-2xl flex flex-col gap-4 mx-2 my-8">
        <div>
          <p className="font-bold text-xl">Welcome to GitSage!</p>
          <p className="text-neutral-300">
            A git client complete with agentic features that help you focus on
            the important bits in this fast paced world.
          </p>
        </div>
        <div className="flex items-center justify-between gap-1 my-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-2">
          <div className="flex items-center gap-2">
            <Info color="#51a2ff" />
            <p>You currently have NO REPOSITORY opened.</p>
          </div>
          <OpenRepo>
            <p className="flex items-center gap-2 px-2 py-1 rounded-xl bg-orange-700 border border-orange-600 hover:bg-orange-600 hover:border-orange-500 shadow-xl text-sm">
              <FolderGit size={18} />
              Open Repository
            </p>
          </OpenRepo>
        </div>

        <div className="my-4  rounded-2xl border border-neutral-800 bg-neutral-900 p-2">
          <p className="text-lg font-bold">What's new</p>
          {[
            "Have multiple repositories opened through a tab system.",
            "Coming back after a few days? Have the clanker summarize current changes.",
            "View diffs for any changed file or commit.",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl  px-2 py-1 my-2 border border-neutral-700 bg-neutral-800"
            >
              <div className="h-2 w-2 rounded-full bg-zinc-400" />
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
