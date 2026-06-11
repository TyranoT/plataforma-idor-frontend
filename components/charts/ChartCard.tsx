// Altura útil dos gráficos. Os charts passam esse valor como `height` numérico
// ao ResponsiveContainer (Recharts 3 só mede via ResizeObserver após o 1º
// render e avisa no console se ambas as dimensões forem percentuais).
export const CHART_HEIGHT = 256;

// Wrapper visual de um gráfico (título + moldura). Pura layout — sem estado.
// Quando `empty`, mostra placeholder no lugar do gráfico (instância nova, sem
// dados ainda), mantendo a moldura e o padrão de empty-state das demais telas.
export function ChartCard({
  title,
  empty = false,
  children,
}: {
  title: string;
  empty?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        {title}
      </h2>
      <div style={{ height: CHART_HEIGHT }}>
        {empty ? (
          <div className="grid h-full place-items-center text-sm text-zinc-500">
            Sem dados ainda
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
