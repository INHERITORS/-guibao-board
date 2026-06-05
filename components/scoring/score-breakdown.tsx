import type { BoardRow } from "@/lib/types";

const segments = [
  { key: "delivery", label: "A 履约", max: 30, color: "bg-jade" },
  { key: "quality", label: "B 品质", max: 30, color: "bg-indigo" },
  { key: "content", label: "C 内容", max: 40, color: "bg-gold" },
  { key: "fengyun", label: "风云", max: 40, color: "bg-cinnabar" }
] as const;

export function ScoreBreakdown({ row }: { row: BoardRow }) {
  return (
    <section className="rounded-md border border-ink/12 bg-white/70 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">分数拆解</h2>
          <p className="text-sm text-ink/65">本月总分 {row.monthTotal} · YTD {row.ytd}</p>
        </div>
        <span className="text-sm font-semibold text-cinnabar">排名 #{row.rank}</span>
      </div>
      <div className="mt-5 grid gap-4">
        {segments.map((segment) => {
          const value = row[segment.key];
          const width = Math.min(100, (value / segment.max) * 100);
          return (
            <div key={segment.key} className="grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-ink">{segment.label}</span>
                <span className="text-ink/70">
                  {value} / {segment.max}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-ink/10">
                <div className={`h-full ${segment.color}`} style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
