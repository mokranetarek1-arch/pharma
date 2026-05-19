import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPath } from "@/lib/auth/roles";
import { ensureProfile } from "@/lib/auth/profile";
import type { UserRole } from "@/lib/types";

export async function requireRole(allowedRoles: UserRole[]) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await ensureProfile(user);

  if (!allowedRoles.includes(profile.role)) {
    redirect(getDashboardPath(profile.role));
  }

  return { user, profile };
}
