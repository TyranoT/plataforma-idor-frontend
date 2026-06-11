export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-7 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-20 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-48 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}
