"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

export async function updateUserRoleAction(formData: FormData) {
  const { user } = await requireRole(["admin"]);
  const userId = String(formData.get("user_id") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();

  if (!userId || !["doctor", "pharmacist", "user", "admin"].includes(role)) {
    throw new Error("Role invalide.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
  if (error) throw new Error(error.message);

  await supabase.from("admin_logs").insert({
    admin_id: user.id,
    action: "update_user_role",
    target_type: "profile",
    target_id: userId
  });

  revalidatePath("/admin");
}
