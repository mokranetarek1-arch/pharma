"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadImageAsset } from "@/lib/supabase/storage";

export async function updateUserProfileAction(formData: FormData) {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non connecté");

  const fullName = String(formData.get("full_name") ?? "").trim();
  const gender = String(formData.get("gender") ?? "").trim();
  const birthdate = String(formData.get("birthdate") ?? "").trim();
  const imageFile = formData.get("photo") as File | null;

  let photo_url = null;
  if (imageFile && imageFile.size > 0) {
    photo_url = await uploadImageAsset("profiles", user.id, imageFile);
  }

  const updatePayload: Record<string, unknown> = {
    full_name: fullName,
    gender,
    birthdate
  };
  if (photo_url) updatePayload.photo_url = photo_url;

  const { error } = await supabase.from("profiles").update(updatePayload).eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/profile");
}
