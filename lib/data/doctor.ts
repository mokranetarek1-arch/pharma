import { createClient } from "@/lib/supabase/server";
import { getDoctorAvailability } from "@/lib/doctor-availability";
import type { DoctorProfileData, UserRole } from "@/lib/types";

type DoctorRow = {
  id: string;
  user_id: string;
  speciality: string | null;
  photo_url: string | null;
  visual_mode: "photo" | "icon" | null;
  avatar_icon: string | null;
  experience_years: number | null;
  professional_background: string | null;
  phone: string | null;
  city: string | null;
  commune: string | null;
  address: string | null;
  google_maps_link: string | null;
  open_days: string | null;
  closed_days: string | null;
  is_open_24_7: boolean | null;
  open_time: string | null;
  close_time: string | null;
  is_available: boolean | null;
};

type ProfileRow = {
  full_name: string | null;
  gender: "male" | "female" | null;
};

type RatingSummaryRow = {
  target_id: string;
  average_rating: number | null;
  review_count: number;
};

export async function getDoctorProfileData(userId: string, role: UserRole): Promise<DoctorProfileData> {
  const supabase = await createClient();
  const [{ data: profile }, doctorResponse] = await Promise.all([
    supabase.from("profiles").select("full_name, gender").eq("id", userId).maybeSingle<ProfileRow>(),
    supabase
      .from("doctors")
      .select("id, user_id, speciality, photo_url, visual_mode, avatar_icon, experience_years, professional_background, phone, city, commune, address, google_maps_link, open_days, closed_days, is_open_24_7, open_time, close_time, is_available, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .returns<(DoctorRow & { created_at?: string | null })[]>()
  ]);
  const doctor = doctorResponse?.data?.[0] ?? null;
  const availability = getDoctorAvailability({
    isOpen24h: doctor?.is_open_24_7,
    openTime: doctor?.open_time,
    closeTime: doctor?.close_time
  });

  let ratingSummary = undefined;
  if (doctor?.id) {
    const { data: ratingRow, error: ratingError } = await supabase
      .from("review_summary")
      .select("average_rating, review_count")
      .eq("target_type", "doctor")
      .eq("target_id", doctor.id)
      .maybeSingle<RatingSummaryRow>();

    if (ratingError) throw new Error(ratingError.message);
    if (ratingRow) {
      ratingSummary = { averageRating: ratingRow.average_rating === null ? null : Number(ratingRow.average_rating), reviewCount: Number(ratingRow.review_count) };
    }
  }

  return {
    id: doctor?.id ?? null,
    fullName: profile?.full_name ?? null,
    gender: profile?.gender ?? null,
    speciality: doctor?.speciality ?? null,
    experienceYears: doctor?.experience_years ?? null,
    professionalBackground: doctor?.professional_background ?? null,
    phone: doctor?.phone ?? null,
    city: doctor?.city ?? null,
    commune: doctor?.commune ?? null,
    address: doctor?.address ?? null,
    googleMapsLink: doctor?.google_maps_link ?? null,
    openDays: doctor?.open_days ?? null,
    closedDays: doctor?.closed_days ?? null,
    photoUrl: doctor?.photo_url ?? null,
    visualMode: doctor?.visual_mode === "icon" ? "icon" : "photo",
    avatarIcon: doctor?.avatar_icon ?? "stethoscope",
    isOpen24h: Boolean(doctor?.is_open_24_7),
    openTime: doctor?.open_time ?? null,
    closeTime: doctor?.close_time ?? null,
    isAvailable: availability.isOpen,
    ratingSummary
  };
}
