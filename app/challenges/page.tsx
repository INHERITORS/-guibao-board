import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";
import { sampleFengyunChallenges, typeLabel } from "@/lib/fengyun-data";

export default function ChallengesPage() {
  return (
    <Shell>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="风云题"
          title="本月挑战"
          description="策展人只会看到已经公布的题目；未公布题保留在策划组后台。"
        />
        <section className="grid gap-4">
          {sampleFengyunChallenges.map((challenge) => (
            <article key={challenge.id} className="rounded-md border border-ink/12 bg-white/70 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-jade px-2.5 py-1 text-xs font-semibold text-white">
                      {typeLabel(challenge.type)}
                    </span>
                    <span className="rounded-md bg-paper px-2.5 py-1 text-xs font-semibold text-ink/70">
                      {challenge.yearMonth}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-ink">{challenge.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-ink/70">{challenge.criterion}</p>
                </div>
                <div className="rounded-md border border-ink/10 bg-paper/55 px-4 py-3 text-sm font-semibold text-ink">
                  {challenge.maxPoints} 分
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </Shell>
  );
}
