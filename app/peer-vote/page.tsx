import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";
import { sampleBoardRows } from "@/lib/demo-data";

export default function PeerVotePage() {
  return (
    <Shell>
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="同侪投票"
          title="2026-06 月度投票"
          description="每策展每月投两票：最佳瑰宝策展与最进步瑰宝策展，不能投自己。"
        />
        <form className="grid gap-5 rounded-md border border-ink/12 bg-white/70 p-5">
          <label className="grid gap-2 text-sm font-medium text-ink">
            最佳瑰宝策展
            <select className="min-h-11 rounded-md border border-ink/18 bg-white px-3">
              {sampleBoardRows.map((row) => (
                <option key={row.curationSlug}>{row.curationName}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            最进步瑰宝策展
            <select className="min-h-11 rounded-md border border-ink/18 bg-white px-3">
              {sampleBoardRows.map((row) => (
                <option key={row.curationSlug}>{row.curationName}</option>
              ))}
            </select>
          </label>
          <button className="min-h-11 rounded-md bg-ink px-4 font-semibold text-paper" type="button">
            提交投票
          </button>
        </form>
      </main>
    </Shell>
  );
}
