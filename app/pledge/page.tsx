import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";

export default function PledgePage() {
  return (
    <Shell>
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="策展人公约"
          title="签署承诺"
          description="签下名字，是对自己说的承诺，也是给同侪看的承担。"
        />
        <form className="grid gap-5 rounded-md border border-ink/12 bg-white/70 p-5">
          <label className="grid gap-2 text-sm font-medium text-ink">
            策展人姓名
            <input className="min-h-11 rounded-md border border-ink/18 bg-white px-3" placeholder="请输入姓名" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            策展名称
            <input className="min-h-11 rounded-md border border-ink/18 bg-white px-3" placeholder="例如：牛郎织女" />
          </label>
          <div className="rounded-md border border-ink/10 bg-paper/55 p-4 text-sm leading-7 text-ink/78">
            本人自愿担任 2027 丁未年槟城庙会瑰宝策展人，承诺接受每月公开评分，
            不弃组、不弃团、不弃志工，并在必要时完成交接。
          </div>
          <button className="min-h-11 rounded-md bg-ink px-4 font-semibold text-paper" type="button">
            确认签署
          </button>
        </form>
      </main>
    </Shell>
  );
}
