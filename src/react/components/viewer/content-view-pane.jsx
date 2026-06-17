export const ContentViewPane = ({ html }) => {
  return (
    <div className="relative">
      <p
        className="whitespace-pre font-mono text-sm p-2"
        dangerouslySetInnerHTML={{ __html: html }}
      ></p>
      <button className="font-bold text-xs border rounded-md px-2  border-teal-700 hover:bg-teal-700 absolute top-2 right-2">
        Summarize
      </button>
    </div>
  );
};
