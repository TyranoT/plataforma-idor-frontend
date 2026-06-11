// Bloco de código com numeração e destaque das linhas vulneráveis.
// Sem estado — pode ser Server Component.
export function CodeBlock({
  code,
  startLine = 1,
  highlightStart,
  highlightEnd,
}: {
  code: string;
  startLine?: number;
  highlightStart?: number | null;
  highlightEnd?: number | null;
}) {
  const lines = code.replace(/\n$/, "").split("\n");
  const hStart = highlightStart ?? -1;
  const hEnd = highlightEnd ?? hStart;

  return (
    <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 py-3 font-mono text-[13px] leading-relaxed text-zinc-100">
      <code className="block">
        {lines.map((line, i) => {
          const lineNo = startLine + i;
          const highlighted = lineNo >= hStart && lineNo <= hEnd;
          return (
            <span
              key={lineNo}
              className={`flex ${
                highlighted
                  ? "bg-red-500/15 ring-1 ring-inset ring-red-500/40"
                  : ""
              }`}
            >
              <span
                className="w-12 shrink-0 select-none pr-4 text-right text-zinc-600"
                aria-hidden
              >
                {lineNo}
              </span>
              <span className="whitespace-pre px-3">{line || " "}</span>
            </span>
          );
        })}
      </code>
    </pre>
  );
}
