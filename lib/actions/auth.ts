"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPath } from "@/lib/auth/roles";
import { ensureProfile } from "@/lib/auth/profile";

export type AuthActionState = {
  error: string | null;
  success: string | null;
};

export async function signupAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const role = String(formData.get("role") ?? "user");
  const gender = String(formData.get("gender") ?? "");
  const birthdate = String(formData.get("birthdate") ?? "").trim();

  if (!email || !password || !fullName || !gender || !birthdate) {
    return { error: "Tous les champs sont obligatoires.", success: null };
  }

  if (!["user", "doctor", "pharmacist"].includes(role)) {
    return { error: "Role invalide.", success: null };
  }

  if (!["male", "female"].includes(gender)) {
    return { error: "Sexe invalide.", success: null };
  }

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        role,
        full_name: fullName,
        gender,
        birthdate
      }
    }
  });

  if (error) {
    return { error: error.message, success: null };
  }

  // Met à jour le profil avec la date de naissance
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (user) {
    await supabase.from("profiles").update({ birthdate }).eq("id", user.id);
  }

  revalidatePath("/");

  return {
    error: null,
    success: "Compte cree avec succes. Tu peux maintenant te connecter."
  };
}

export async function loginAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email et mot de passe obligatoires.", success: null };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message, success: null };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Session introuvable apres connexion.", success: null };
  }

  const profile = await ensureProfile(user);
  redirect(getDashboardPath(profile.role));
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
