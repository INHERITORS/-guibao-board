import { BoardPreview } from "@/components/board/board-preview";
import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";
import { sampleBoardRows } from "@/lib/demo-data";

export default function EventPage() {
  return (
    <Shell>
      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <section className="flex flex-col gap-6">
          <PageHeader
            eyebrow="庙会现场榜"
            title="十四天最后冲刺"
            description="活动期间切换成现场模式，支持每日风云题、公众投票、Top 12 与大屏展示。"
          />
          <div className="rounded-md border border-ink/12 bg-white/70 p-5">
            <h2 className="text-lg font-semibold text-ink">现场状态</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Stat label="开放竞逐" value="17" />
              <Stat label="公众票" value="0" />
              <Stat label="今日风云题" value="7" />
            </div>
          </div>
        </section>
        <BoardPreview rows={sampleBoardRows.slice(0, 6)} />
      </main>
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-ink/10 bg-paper/55 p-4">
      <p className="text-sm text-ink/62">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}
