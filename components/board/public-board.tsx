"use client";

import { useEffect, useMemo, useState } from "react";
import type { BoardState } from "@/lib/board";
import { seedRows, seedSettings, seedTodos, sortRows } from "@/lib/board";

export function PublicBoard() {
  const [state, setState] = useState<BoardState>({
    rows: seedRows,
    todos: seedTodos,
    settings: seedSettings
  });
  const [setupRequired, setSetupRequired] = useState(false);

  useEffect(() => {
    fetch("/api/board")
      .then((response) => response.json())
      .then((data) => {
        setState({
          rows: data.rows || seedRows,
          todos: data.todos || seedTodos,
          settings: data.settings || seedSettings
        });
        setSetupRequired(Boolean(data.setupRequired));
      })
      .catch(() => undefined);
  }, []);

  const rows = useMemo(() => sortRows(state.rows), [state.rows]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-7 sm:px-6 lg:px-8">
      {setupRequired ? (
        <div className="rounded-md border border-cinnabar/30 bg-white/75 p-4 text-sm text-cinnabar">
          Supabase tables 尚未建立。现在显示种子资料；请在 Supabase SQL Editor 执行
          `supabase/vercel_schema.sql`。
        </div>
      ) : null}

      <section className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold text-cinnabar">
            2027 丁未年槟城庙会 · 对外 Dashboard
          </p>
          <h1 className="mt-3 text-5xl font-semibold text-ink sm:text-6xl">瑰宝榜</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/72">
            让每一个瑰宝策展的履约、品质、内容深度与风云表现被看见。
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Stat label="瑰宝策展" value="17" />
            <Stat label="当前评分月" value="6月" />
            <Stat label="晋级线" value="Top 12" />
          </div>
        </div>
        <aside className="rounded-md border border-ink/12 bg-white/75 p-5">
          <h2 className="text-xl font-semibold text-ink">本月 Top 6</h2>
          <div className="mt-4 grid gap-3">
            {rows.slice(0, 6).map((row, index) => (
              <div
                className="grid grid-cols-[40px_1fr_auto] items-center gap-3 rounded-md border border-ink/10 bg-paper/60 p-3"
                key={row.id}
              >
                <strong>{index + 1}</strong>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{row.name}</p>
                  <p className="truncate text-xs text-ink/60">策展人：{row.curators || "-"}</p>
                  <p className="truncate text-xs text-ink/60">辅佐员：{row.assistants || "-"}</p>
                </div>
                <strong className="text-cinnabar">{row.total}</strong>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">公开总榜</h2>
        <div className="overflow-hidden rounded-md border border-ink/12 bg-white/75">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead className="bg-ink text-paper">
                <tr>
                  {["排名", "策展名称", "策展人", "辅佐员", "A 履约", "B 品质", "C 内容", "基础", "风云", "本月"].map(
                    (head) => (
                      <th className="px-4 py-3 text-sm" key={head}>
                        {head}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr className="border-t border-ink/10" key={row.id}>
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-semibold">{row.name}</td>
                    <td className="px-4 py-3">{row.curators || "-"}</td>
                    <td className="px-4 py-3">{row.assistants || "-"}</td>
                    <td className="px-4 py-3">{row.a}</td>
                    <td className="px-4 py-3">{row.b}</td>
                    <td className="px-4 py-3">{row.c}</td>
                    <td className="px-4 py-3">{row.base}</td>
                    <td className="px-4 py-3">+{row.fengyun}</td>
                    <td className="px-4 py-3 font-semibold">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-ink/12 bg-white/75 p-4">
      <strong className="block text-3xl">{value}</strong>
      <span className="text-sm font-medium text-ink/60">{label}</span>
    </div>
  );
}
