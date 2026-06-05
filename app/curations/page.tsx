import Link from "next/link";
import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";
import { sampleBoardRows } from "@/lib/demo-data";

export default function CurationsPage() {
  return (
    <Shell>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="17 个瑰宝策展"
          title="策展索引"
          description="每个策展都有自己的公开页，显示主题、策展人、分数趋势与内容进度。"
        />
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sampleBoardRows.map((row) => (
            <Link
              href={`/curations/${row.curationSlug}`}
              key={row.curationSlug}
              className="rounded-md border border-ink/12 bg-white/70 p-5 transition hover:border-jade/45 hover:bg-white"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-ink">{row.curationName}</h2>
                  <p className="mt-1 text-sm text-ink/62">策展人 · {row.curatorName}</p>
                </div>
                <span className="rounded-md bg-ink px-3 py-1 text-sm font-semibold text-paper">
                  #{row.rank}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-ink/70">
                本月 {row.monthTotal} 分 · YTD {row.ytd} 分
              </p>
            </Link>
          ))}
        </section>
      </main>
    </Shell>
  );
}
