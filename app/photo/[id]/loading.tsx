/** Skeleton de la página de una foto: marco con imagen y franja de info. */
export default function Loading() {
  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-3 w-16 animate-pulse rounded bg-black/10 dark:bg-white/10" />
          <div className="h-3 w-10 animate-pulse rounded bg-black/10 dark:bg-white/10" />
        </div>

        <div className="rounded-md border border-black/20 bg-black/[0.02] p-1.5 dark:border-white/10 dark:bg-white/[0.03] sm:p-2">
          <div className="h-[58vh] w-full animate-pulse rounded-sm bg-black/[0.06] dark:bg-white/[0.08] sm:h-[68vh]" />
          <div className="flex flex-col gap-3 px-2 pb-2 pt-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="h-3 w-32 animate-pulse rounded bg-black/10 dark:bg-white/10" />
              <div className="h-3 w-48 animate-pulse rounded bg-black/10 dark:bg-white/10" />
            </div>
            <div className="flex gap-2">
              <div className="h-7 w-20 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
              <div className="h-7 w-14 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
              <div className="h-8 w-8 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}