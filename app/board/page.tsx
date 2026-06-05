import { BoardTable } from "@/components/board/board-table";
import { Shell } from "@/components/layout/shell";
import { sampleBoardRows } from "@/lib/demo-data";

export default function BoardPage() {
  return (
    <Shell>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-cinnabar">公开总榜</p>
            <h1 className="text-3xl font-semibold text-ink">2026-06 瑰宝榜</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
              一张榜显示每策展的基础分、风云分、本月总分与年终累计。
            </p>
          </div>
          <div className="rounded-md border border-ink/12 bg-white/70 px-4 py-3 text-sm text-ink/75">
            当前为示例数据 · Phase 1
          </div>
        </header>
        <BoardTable rows={sampleBoardRows} />
      </main>
    </Shell>
  );
}
