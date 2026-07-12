import parse from "parse-diff";

export interface GitCommit {
  hash: string;
  relativeDate: string;
  author: string;
  subject: string;
}

const RECORD_SEPARATOR = "\x1e\n";
const FIELD_SEPARATOR = "\x1f";

// Parse git log with a specified format, look for that in the
// electron service layer where that function is defined to understand why this
// func is like this
export function parseGitCommitOutput(output: string) {
  return output
    .split(RECORD_SEPARATOR)
    .filter((record) => record.trim() !== "")
    .map((record): GitCommit => {
      const [hash, relativeDate, author, subject] =
        record.split(FIELD_SEPARATOR);

      if (
        hash === undefined ||
        relativeDate === undefined ||
        author === undefined ||
        subject === undefined
      ) {
        throw new Error(`Invalid git log record: ${record}`);
      }

      return {
        hash,
        relativeDate,
        author,
        subject,
      };
    });
}

export function parseCommitDiff(diffStr: string) {
  const files = parse(diffStr);
  return files.map((f) => {
    let oldContent = "";
    let newContent = "";
    for (const chunk of f.chunks) {
      for (const change of chunk.changes) {
        const line = change.content.slice(1);
        if (change.type === "normal") {
          oldContent += line + "\n";
          newContent += line + "\n";
        } else if (change.type === "del") {
          oldContent += line + "\n";
        } else if (change.type === "add") {
          newContent += line + "\n";
        }
      }
    }
    const ext = (f.to || f.from || "").split(".").pop() || "";
    return {
      fileName: f.to || f.from || "",
      oldContent,
      newContent,
      ext,
    };
  });
}
