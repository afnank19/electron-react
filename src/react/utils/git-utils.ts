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
