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
      <div className="h-64">
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
