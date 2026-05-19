import type { Profile, UserRole } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

function normalizeRole(role?: string | null): UserRole {
  if (role === "doctor" || role === "pharmacist" || role === "admin") {
    return role;
  }

  return "user";
}

export async function ensureProfile(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, phone, gender, created_at")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  if (profile) {
    return profile;
  }

  const metadata = user.user_metadata ?? {};

  return {
    id: user.id,
    email: user.email ?? "",
    full_name: typeof metadata.full_name === "string" ? metadata.full_name : "",
    role: normalizeRole(typeof metadata.role === "string" ? metadata.role : null),
    phone: null,
    gender: metadata.gender === "male" || metadata.gender === "female" ? metadata.gender : null,
    created_at: new Date().toISOString()
  } satisfies Profile;
}
