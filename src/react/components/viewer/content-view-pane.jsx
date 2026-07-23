export const ContentViewPane = ({ html }) => {
  return (
    <div className="relative">
      <p
        className="p-2 font-mono text-sm whitespace-pre"
        dangerouslySetInnerHTML={{ __html: html }}
      ></p>
      <button className="absolute top-2 right-2 rounded-md border border-teal-700 px-2 text-xs font-bold hover:bg-teal-700">
        Summarize
      </button>
    </div>
  );
};
