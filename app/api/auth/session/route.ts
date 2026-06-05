import { NextRequest, NextResponse } from "next/server";
import { adminEmails, getAnonSupabase } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ user: null, isAdmin: false });

  const supabase = getAnonSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return NextResponse.json({ user: null, isAdmin: false });

  const email = data.user.email?.toLowerCase() || "";
  return NextResponse.json({
    user: { email },
    isAdmin: adminEmails().includes(email)
  });
}
