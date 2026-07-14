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

// export function parseCommitDiff(diffStr: string) {
//   const files = parse(diffStr);
//   return files.map((f) => {
//     let oldContent = "";
//     let newContent = "";
//     for (const chunk of f.chunks) {
//       for (const change of chunk.changes) {
//         const line = change.content.slice(1);
//         if (change.type === "normal") {
//           oldContent += line + "\n";
//           newContent += line + "\n";
//         } else if (change.type === "del") {
//           oldContent += line + "\n";
//         } else if (change.type === "add") {
//           newContent += line + "\n";
//         }
//       }
//     }
//     const ext = (f.to || f.from || "").split(".").pop() || "";
//     return {
//       fileName: f.to || f.from || "",
//       oldContent,
//       newContent,
//       ext,
//     };
//   });
// }

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

    console.log(f.chunks[0]?.changes[0]);

    const hunks = f.chunks.map((chunk) =>
      [
        chunk.content,
        ...chunk.changes.map((change) => change.content),
      ].join("\n")
    );

    return {
      fileName: f.to || f.from || "",
      oldContent,
      newContent,
      hunks,
    };
  });
}

// This splits the diff or show output into patches that can be used
// by the diffing engine
export function splitGitPatches(text: string): string[] {
  const matches = Array.from(text.matchAll(/^diff --git /gm));

  return matches.map((match, i) => {
    const start = match.index ?? 0;

    const nextMatch = matches[i + 1];
    const end = nextMatch?.index ?? text.length;

    return text.slice(start, end);
  });
}


// export function parseCommitDiff(diffStr: string) {
//   return parse(diffStr).map((f) => {
//     const oldLines: string[] = [];
//     const newLines: string[] = [];

//     for (const chunk of f.chunks) {
//       for (const change of chunk.changes) {
//         const line = change.content.slice(1);

//         switch (change.type) {
//           case "normal":
//             oldLines.push(line);
//             newLines.push(line);
//             break;

//           case "del":
//             oldLines.push(line);
//             break;

//           case "add":
//             newLines.push(line);
//             break;
//         }
//       }
//     }

//     const fileName = f.to || f.from || "";

//     return {
//       fileName,
//       oldContent: oldLines.join("\n"),
//       newContent: newLines.join("\n"),
//       ext: fileName.split(".").pop() || "",
//     };
//   });
// }
