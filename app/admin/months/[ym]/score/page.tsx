import { BoardTable } from "@/components/board/board-table";
import { PageHeader } from "@/components/layout/page-header";
import { Shell } from "@/components/layout/shell";
import { sampleBoardRows } from "@/lib/demo-data";

export default function MonthScorePage({ params }: { params: { ym: string } }) {
  return (
    <Shell>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="月度评分"
          title={`${params.ym} 评分输入`}
          description="这里未来会拆成 A 履约、B1 内部分、B2 同侪票、C 内容深度与风云分的输入流程。"
        />
        <section className="rounded-md border border-ink/12 bg-white/70 p-5">
          <div className="grid gap-4 sm:grid-cols-4">
            <Input label="B1 内部分" />
            <Input label="本月同侪票" />
            <Input label="新增内容项" />
            <Input label="风云分" />
          </div>
        </section>
        <BoardTable rows={sampleBoardRows} />
      </main>
    </Shell>
  );
}

function Input({ label }: { label: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      {label}
      <input className="min-h-11 rounded-md border border-ink/18 bg-white px-3" placeholder="0" />
    </label>
  );
}
