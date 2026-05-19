import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPath } from "@/lib/auth/roles";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      return NextResponse.redirect(new URL(next || getDashboardPath(profile?.role), origin));
    }
  }

  return NextResponse.redirect(new URL("/login", origin));
}
