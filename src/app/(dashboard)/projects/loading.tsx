export default function ProjectsLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <div className="h-8 w-44 rounded-lg bg-[var(--muted)]" />
          <div className="h-4 w-72 rounded bg-[var(--muted)]" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-[var(--muted)]" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-20 rounded-full bg-[var(--muted)]" />
              <div className="h-4 w-12 rounded bg-[var(--muted)]" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-3/4 rounded bg-[var(--muted)]" />
              <div className="h-3.5 w-full rounded bg-[var(--muted)]" />
              <div className="h-3.5 w-2/3 rounded bg-[var(--muted)]" />
            </div>
            <div className="flex gap-2">
              <div className="h-5 w-14 rounded-md bg-[var(--muted)]" />
              <div className="h-5 w-16 rounded-md bg-[var(--muted)]" />
              <div className="h-5 w-12 rounded-md bg-[var(--muted)]" />
            </div>
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between">
                <div className="h-3 w-14 rounded bg-[var(--muted)]" />
                <div className="h-3 w-8 rounded bg-[var(--muted)]" />
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--muted)]" />
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]">
              <div className="h-4 w-20 rounded bg-[var(--muted)]" />
              <div className="h-4 w-16 rounded bg-[var(--muted)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
