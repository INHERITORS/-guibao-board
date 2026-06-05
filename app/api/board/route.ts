import { NextResponse } from "next/server";
import { seedRows, seedSettings, seedTodos } from "@/lib/board";
import { getServiceSupabase } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const [{ data: rows, error: rowsError }, { data: notes, error: notesError }] =
      await Promise.all([
        supabase.from("curations").select("*").order("display_order"),
        supabase.from("board_notes").select("*").order("display_order")
      ]);

    if (rowsError || notesError) {
      return NextResponse.json(
        {
          setupRequired: true,
          rows: seedRows,
          todos: seedTodos,
          settings: seedSettings
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      rows: rows || [],
      todos: (notes || []).filter((note) => note.type === "todo"),
      settings: (notes || []).filter((note) => note.type === "setting")
    });
  } catch {
    return NextResponse.json({
      setupRequired: true,
      rows: seedRows,
      todos: seedTodos,
      settings: seedSettings
    });
  }
}
