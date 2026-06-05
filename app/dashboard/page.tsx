import { AlertCircle, CheckCircle2, Trophy } from "lucide-react";
import { Shell } from "@/components/layout/shell";
import { ScoreBreakdown } from "@/components/scoring/score-breakdown";
import { sampleBoardRows } from "@/lib/demo-data";

const current = sampleBoardRows[2];

export default function CuratorDashboardPage() {
  return (
    <Shell>
      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <section className="flex flex-col gap-6">
          <header>
            <p className="text-sm font-medium text-cinnabar">策展人 dashboard</p>
            <h1 className="text-3xl font-semibold text-ink">{current.curationName}</h1>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              本页会在登入后显示自己的策展状态、待办、追分机会与证据提交入口。
            </p>
          </header>
          <ScoreBreakdown row={current} />
          <section className="rounded-md border border-ink/12 bg-white/70 p-5">
            <h2 className="text-lg font-semibold text-ink">本月待办</h2>
            <div className="mt-4 grid gap-3">
              <Todo done label="签署策展人公约" />
              <Todo done label="提交 100 字主题短文" />
              <Todo label="完成本月同侪投票" />
              <Todo label="上传风云题证据" />
            </div>
          </section>
        </section>
        <aside className="flex flex-col gap-4">
          <div className="rounded-md border border-gold/30 bg-white/75 p-5">
            <div className="flex items-center gap-3 text-gold">
              <Trophy size={22} />
              <span className="font-semibold">追分机会</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink/72">
              距离上一名相差 4 分。本月可优先补齐内容深度项目，并争取风云题「迎新会主题展现」。
            </p>
          </div>
          <div className="rounded-md border border-ink/12 bg-white/70 p-5">
            <div className="flex items-center gap-3 text-cinnabar">
              <AlertCircle size={22} />
              <span className="font-semibold">内部备注</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink/72">
              扣分原因只在策划组后台显示。公开页保留分数、进度和亮点。
            </p>
          </div>
        </aside>
      </main>
    </Shell>
  );
}

function Todo({ done = false, label }: { done?: boolean; label: string }) {
  return (
    <div className="flex min-h-12 items-center gap-3 rounded-md border border-ink/10 bg-paper/55 px-4">
      <CheckCircle2 size={18} className={done ? "text-jade" : "text-ink/25"} />
      <span className="text-sm font-medium text-ink">{label}</span>
    </div>
  );
}
