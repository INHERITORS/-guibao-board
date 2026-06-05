import { NextRequest, NextResponse } from "next/server";
import type { BoardState } from "@/lib/board";
import { adminEmails, getAnonSupabase, getServiceSupabase } from "@/lib/supabase/server";

async function authorize(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return false;

  const supabase = getAnonSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user?.email) return false;

  return adminEmails().includes(data.user.email.toLowerCase());
}

export async function POST(request: NextRequest) {
  if (!(await authorize(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as BoardState;
  const supabase = getServiceSupabase();

  const rows = payload.rows.map((row, index) => ({
    id: row.id,
    name: row.name,
    curators: row.curators || "",
    assistants: row.assistants || "",
    a: Number(row.a || 0),
    b1: Number(row.b1 || 0),
    b2: Number(row.b2 || 0),
    c: Number(row.c || 0),
    fengyun: Number(row.fengyun || 0),
    display_order: index + 1
  }));

  const notes = [
    ...payload.todos.map((note, index) => ({
      type: "todo",
      title: note.title,
      body: note.body,
      display_order: index + 1
    })),
    ...payload.settings.map((note, index) => ({
      type: "setting",
      title: note.title,
      body: note.body,
      display_order: index + 1
    }))
  ];

  const { error: rowError } = await supabase.from("curations").upsert(rows);
  if (rowError) return NextResponse.json({ error: rowError.message }, { status: 400 });

  const { error: deleteError } = await supabase
    .from("board_notes")
    .delete()
    .in("type", ["todo", "setting"]);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 400 });

  const { error: noteError } = await supabase.from("board_notes").insert(notes);
  if (noteError) return NextResponse.json({ error: noteError.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
