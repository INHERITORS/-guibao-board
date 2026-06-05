"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { BoardState, CurationRow, NoteRow } from "@/lib/board";
import { seedRows, seedSettings, seedTodos, sortRows } from "@/lib/board";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function AdminDashboard() {
  const [state, setState] = useState<BoardState>({
    rows: seedRows,
    todos: seedTodos,
    settings: seedSettings
  });
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("请先登入。");

  const supabase = useMemo(() => {
    if (!supabaseUrl || !anonKey) return null;
    return createClient(supabaseUrl, anonKey);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      const accessToken = data.session?.access_token || "";
      setToken(accessToken);
      if (accessToken) void verify(accessToken);
    });
    void loadBoard();
  }, [supabase]);

  async function verify(accessToken: string) {
    const response = await fetch("/api/auth/session", {
      headers: { authorization: `Bearer ${accessToken}` }
    });
    const data = await response.json();
    setEmail(data.user?.email || "");
    setIsAdmin(Boolean(data.isAdmin));
    setStatus(data.isAdmin ? "已登入，可以修改。" : "此账号不在 admin 名单。");
  }

  async function signIn() {
    if (!supabase || !email) return;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/admin` }
    });
    setStatus(error ? error.message : "登入链接已发送，请检查邮箱。");
  }

  async function signOut() {
    await supabase?.auth.signOut();
    setToken("");
    setIsAdmin(false);
    setStatus("已登出。");
  }

  async function loadBoard() {
    const response = await fetch("/api/board");
    const data = await response.json();
    setState({
      rows: data.rows || seedRows,
      todos: data.todos || seedTodos,
      settings: data.settings || seedSettings
    });
  }

  async function save() {
    const response = await fetch("/api/admin/save", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(state)
    });
    setStatus(response.ok ? "已保存并发布到公开榜。" : "保存失败，请确认账号权限和 Supabase 表格。");
  }

  function updateRow(index: number, field: keyof CurationRow, value: string) {
    setState((current) => ({
      ...current,
      rows: current.rows.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              [field]: ["a", "b1", "b2", "c", "fengyun"].includes(field)
                ? Number(value || 0)
                : value
            }
          : row
      )
    }));
  }

  function updateNote(type: "todos" | "settings", index: number, field: keyof NoteRow, value: string) {
    setState((current) => ({
      ...current,
      [type]: current[type].map((note, noteIndex) =>
        noteIndex === index ? { ...note, [field]: value } : note
      )
    }));
  }

  function addNote(type: "todos" | "settings") {
    setState((current) => ({
      ...current,
      [type]: [
        ...current[type],
        {
          type: type === "todos" ? "todo" : "setting",
          title: type === "todos" ? "新待处理事项" : "新发布设置",
          body: "请填写说明。",
          display_order: current[type].length + 1
        }
      ]
    }));
  }

  function removeNote(type: "todos" | "settings", index: number) {
    setState((current) => ({
      ...current,
      [type]: current[type].filter((_, noteIndex) => noteIndex !== index)
    }));
  }

  const rows = sortRows(state.rows);

  function makePublicMessage() {
    setMessage(
      [
        "【瑰宝榜 · 最新进度】",
        "",
        ...rows.slice(0, 5).map((row, index) => `${index + 1}. ${row.name}（${row.curators || "-"}）${row.total}分`),
        "",
        "请各策展继续补齐内容深度与风云题证据。"
      ].join("\n")
    );
  }

  function makeTeamMessage() {
    setMessage(
      rows
        .map(
          (row, index) =>
            `#${index + 1} ${row.name}\n策展人：${row.curators || "-"}\n辅佐员：${row.assistants || "-"}\n本月总分：${row.total}\nA履约：${row.a}｜B品质：${row.b}｜C内容：${row.c}｜风云：${row.fengyun}\n`
        )
        .join("\n")
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-7 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-semibold text-cinnabar">策划组后台</p>
        <h1 className="mt-2 text-4xl font-semibold">2026-06 月度评分</h1>
        <p className="mt-2 text-sm text-ink/65">{status}</p>
      </header>

      <section className="rounded-md border border-ink/12 bg-white/75 p-5">
        <div className="flex flex-wrap gap-3">
          <input
            className="min-h-11 rounded-md border border-ink/15 px-3"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin email"
            value={email}
          />
          <button className="rounded-md bg-ink px-4 font-semibold text-paper" onClick={signIn}>
            发送登入链接
          </button>
          <button className="rounded-md border border-ink/15 bg-white px-4 font-semibold" onClick={signOut}>
            登出
          </button>
          <button
            className="rounded-md bg-jade px-4 font-semibold text-white disabled:opacity-40"
            disabled={!isAdmin}
            onClick={save}
          >
            保存并发布
          </button>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          <section className="rounded-md border border-ink/12 bg-white/75 p-5">
            <h2 className="text-xl font-semibold">评分输入</h2>
            <p className="mt-2 text-sm text-ink/65">
              B1 内部分：5 表面、10 扎实、15 出众。B2 同侪票：最佳 +3、最进步 +2，封顶 15。
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse">
                <thead className="bg-ink text-paper">
                  <tr>
                    {["策展", "策展人", "辅佐员", "A", "B1", "B2", "C", "风云"].map((head) => (
                      <th className="px-3 py-2 text-left text-sm" key={head}>{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {state.rows.map((row, index) => (
                    <tr className="border-t border-ink/10" key={row.id}>
                      {(["name", "curators", "assistants", "a", "b1", "b2", "c", "fengyun"] as const).map((field) => (
                        <td className="px-2 py-2" key={field}>
                          <input
                            className="min-h-9 w-full rounded-md border border-ink/15 px-2"
                            disabled={!isAdmin}
                            onChange={(event) => updateRow(index, field, event.target.value)}
                            value={String(row[field] || "")}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-md border border-ink/12 bg-white/75 p-5">
            <h2 className="text-xl font-semibold">WhatsApp 公告</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              <button className="rounded-md border border-ink/15 px-4 py-2 font-semibold" onClick={makePublicMessage}>群组 Top 5</button>
              <button className="rounded-md border border-ink/15 px-4 py-2 font-semibold" onClick={makeTeamMessage}>各策展分数</button>
              <button className="rounded-md border border-ink/15 px-4 py-2 font-semibold" onClick={() => navigator.clipboard.writeText(message)}>复制</button>
            </div>
            <textarea
              className="mt-3 min-h-48 w-full rounded-md border border-ink/15 p-3"
              onChange={(event) => setMessage(event.target.value)}
              value={message}
            />
          </section>
        </div>

        <aside className="grid gap-5">
          <EditableNotes
            disabled={!isAdmin}
            notes={state.todos}
            onAdd={() => addNote("todos")}
            onRemove={(index) => removeNote("todos", index)}
            onUpdate={(index, field, value) => updateNote("todos", index, field, value)}
            title="待处理"
          />
          <EditableNotes
            disabled={!isAdmin}
            notes={state.settings}
            onAdd={() => addNote("settings")}
            onRemove={(index) => removeNote("settings", index)}
            onUpdate={(index, field, value) => updateNote("settings", index, field, value)}
            title="公开发布设置"
          />
        </aside>
      </section>
    </main>
  );
}

function EditableNotes({
  disabled,
  notes,
  onAdd,
  onRemove,
  onUpdate,
  title
}: {
  disabled: boolean;
  notes: NoteRow[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof NoteRow, value: string) => void;
  title: string;
}) {
  return (
    <section className="rounded-md border border-ink/12 bg-white/75 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button className="rounded-md border border-ink/15 px-3 py-2 text-sm font-semibold" disabled={disabled} onClick={onAdd}>
          新增
        </button>
      </div>
      <div className="mt-4 grid gap-3">
        {notes.map((note, index) => (
          <div className="grid gap-2 rounded-md border border-ink/10 bg-paper/60 p-3" key={index}>
            <input
              className="min-h-9 rounded-md border border-ink/15 px-2"
              disabled={disabled}
              onChange={(event) => onUpdate(index, "title", event.target.value)}
              value={note.title}
            />
            <textarea
              className="min-h-20 rounded-md border border-ink/15 p-2"
              disabled={disabled}
              onChange={(event) => onUpdate(index, "body", event.target.value)}
              value={note.body}
            />
            <button className="rounded-md border border-ink/15 px-3 py-2 text-sm font-semibold" disabled={disabled} onClick={() => onRemove(index)}>
              删除
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
