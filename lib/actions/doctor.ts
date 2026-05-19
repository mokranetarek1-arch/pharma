"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { getDoctorAvailability } from "@/lib/doctor-availability";
import { createClient } from "@/lib/supabase/server";
import { uploadImageAsset } from "@/lib/supabase/storage";

function normalizeDoctorName(value: string) {
  return value.replace(/^\s*(dr\.?|docteur)\s+/i, "").trim();
}

export async function saveDoctorProfileAction(formData: FormData) {
  const { profile } = await requireRole(["doctor", "admin"]);
  const fullName = normalizeDoctorName(String(formData.get("full_name") ?? ""));
  const gender = String(formData.get("gender") ?? "").trim();
  const speciality = String(formData.get("speciality") ?? "").trim() || null;
  const currentPhotoUrl = String(formData.get("current_photo_url") ?? "").trim() || null;
  const visualMode = formData.get("visual_mode") === "icon" ? "icon" : "photo";
  const avatarIcon = String(formData.get("avatar_icon") ?? "stethoscope").trim() || "stethoscope";
  const imageFile = formData.get("image") as File | null;
  const rawExperienceYears = String(formData.get("experience_years") ?? "").trim();
  const experienceYears = rawExperienceYears ? Number(rawExperienceYears) : null;
  const professionalBackground = String(formData.get("professional_background") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const commune = String(formData.get("commune") ?? "").trim() || null;
  const address = String(formData.get("address") ?? "").trim() || null;
  const googleMapsLink = String(formData.get("google_maps_link") ?? "").trim() || null;
  const openDays = String(formData.get("open_days") ?? "").trim() || null;
  const closedDays = String(formData.get("closed_days") ?? "").trim() || null;
  const isOpen24h = formData.getAll("is_open_24_7").includes("true");
  const openTime = isOpen24h ? null : String(formData.get("open_time") ?? "").trim() || null;
  const closeTime = isOpen24h ? null : String(formData.get("close_time") ?? "").trim() || null;
  const availability = getDoctorAvailability({ isOpen24h, openTime, closeTime });

  if (!fullName) {
    throw new Error("Le nom du medecin est obligatoire.");
  }

  if (gender && !["male", "female"].includes(gender)) {
    throw new Error("Le sexe est invalide.");
  }

  if (experienceYears !== null && (!Number.isFinite(experienceYears) || experienceYears < 0)) {
    throw new Error("L'experience doit etre un nombre valide.");
  }

  const supabase = await createClient();
  const uploadedPhotoUrl = imageFile && imageFile.size > 0 ? await uploadImageAsset("doctors", profile.id, imageFile) : null;
  const photoUrl = visualMode === "photo" ? uploadedPhotoUrl ?? currentPhotoUrl : null;

  const { error: profileError } = await supabase.from("profiles").update({
    full_name: fullName,
    phone,
    gender: gender || null
  }).eq("id", profile.id);
  if (profileError) throw new Error(profileError.message);

  const doctorPayload = {
    user_id: profile.id,
    speciality,
    photo_url: photoUrl,
    visual_mode: visualMode,
    avatar_icon: avatarIcon,
    experience_years: experienceYears,
    professional_background: professionalBackground,
    phone,
    city,
    commune,
    address,
    google_maps_link: googleMapsLink,
    open_days: openDays,
    closed_days: closedDays,
    is_open_24_7: isOpen24h,
    open_time: openTime,
    close_time: closeTime,
    is_available: availability.isOpen
  };

  const { data: existingDoctor, error: existingDoctorError } = await supabase
    .from("doctors")
    .select("id")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (existingDoctorError) throw new Error(existingDoctorError.message);

  const { error: doctorError } = existingDoctor
    ? await supabase.from("doctors").update(doctorPayload).eq("id", existingDoctor.id)
    : await supabase.from("doctors").insert(doctorPayload);

  if (doctorError) throw new Error(doctorError.message);

  revalidatePath("/doctor/profile");
  revalidatePath("/doctor/search");
  revalidatePath("/");
  redirect("/doctor/profile?saved=1");
}
