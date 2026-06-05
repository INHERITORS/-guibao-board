import { notFound } from "next/navigation";
import { ScoreBreakdown } from "@/components/scoring/score-breakdown";
import { PageHeader } from "@/components/layout/page-header";
import { Shell } from "@/components/layout/shell";
import { sampleBoardRows } from "@/lib/demo-data";

export default function CurationDetailPage({ params }: { params: { slug: string } }) {
  const row = sampleBoardRows.find((item) => item.curationSlug === params.slug);

  if (!row) {
    notFound();
  }

  return (
    <Shell>
      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <section className="flex flex-col gap-6">
          <PageHeader
            eyebrow="策展详情"
            title={row.curationName}
            description={`策展人：${row.curatorName}。公开页保留分数、进度与亮点，后台才显示内部评语。`}
          />
          <ScoreBreakdown row={row} />
          <section className="rounded-md border border-ink/12 bg-white/70 p-5">
            <h2 className="text-lg font-semibold text-ink">内容深度进度</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["基础资料", "口述历史", "方言 / 在地资料", "跨代共创", "视觉概念", "互动体验", "实体道具", "五感体验"].map(
                (item, index) => (
                  <div
                    key={item}
                    className="rounded-md border border-ink/10 bg-paper/55 px-4 py-3 text-sm font-medium text-ink"
                  >
                    {index < 4 ? "深度" : "制作"} · {item}
                  </div>
                )
              )}
            </div>
          </section>
        </section>
        <aside className="rounded-md border border-ink/12 bg-white/70 p-5">
          <h2 className="text-lg font-semibold text-ink">公开亮点</h2>
          <p className="mt-3 text-sm leading-6 text-ink/72">
            这里未来会显示策展团队提交并经策划组确认的亮点证据，例如访谈照片、故事稿、道具进度或现场互动成果。
          </p>
        </aside>
      </main>
    </Shell>
  );
}
