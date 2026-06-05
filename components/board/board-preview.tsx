import type { BoardRow } from "@/lib/types";

export function BoardPreview({ rows }: { rows: BoardRow[] }) {
  return (
    <div className="rounded-md border border-ink/12 bg-white/78 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-cinnabar">实时总榜</p>
          <h2 className="text-xl font-semibold text-ink">本月 Top 6</h2>
        </div>
        <span className="rounded-md bg-jade px-3 py-2 text-sm font-semibold text-white">
          2026-06
        </span>
      </div>
      <div className="grid gap-2">
        {rows.map((row) => (
          <div
            key={row.curationSlug}
            className="grid grid-cols-[40px_1fr_auto] items-center gap-3 rounded-md border border-ink/10 bg-paper/60 px-3 py-3"
          >
            <span className="text-lg font-semibold text-ink">{row.rank}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{row.curationName}</p>
              <p className="truncate text-xs text-ink/60">{row.curatorName}</p>
            </div>
            <span className="text-sm font-semibold text-cinnabar">{row.monthTotal}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
