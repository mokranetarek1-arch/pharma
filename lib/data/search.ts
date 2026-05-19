import { createClient } from "@/lib/supabase/server";
import { getDoctorAvailability } from "@/lib/doctor-availability";
import type { DoctorSearchResult, SearchResult } from "@/lib/types";

type MedicineRow = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  dosage: string | null;
  form: string | null;
  categorie: string | null;
  requires_prescription: boolean | null;
  image_url: string | null;
};

type PharmacyRow = {
  id: string;
  name: string;
  city: string;
  phone: string | null;
  google_maps_link: string | null;
  image_url: string | null;
  is_open: boolean | null;
};

type StockRow = {
  id: string;
  pharmacy_id: string;
  medicine_id: string;
  quantity: number;
  updated_at: string;
};

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
  id: string;
  full_name: string | null;
  gender?: "male" | "female" | null;
};

type RatingSummaryRow = {
  target_id: string;
  average_rating: number | null;
  review_count: number;
};

function buildRatingMap(rows: RatingSummaryRow[]) {
  return new Map(rows.map((row) => [row.target_id, { averageRating: row.average_rating === null ? null : Number(row.average_rating), reviewCount: Number(row.review_count) }]));
}

export async function searchMedicines(query: string, city?: string) {
  const supabase = await createClient();
  const normalizedQuery = query.trim();
  const normalizedCity = city?.trim();

  if (!normalizedQuery) return [];

  const { data: matchingMedicines, error: medicinesError } = await supabase
    .from("medicines")
    .select("id, name, description, price, dosage, form, categorie, requires_prescription, image_url")
    .or(`name.ilike.%${normalizedQuery}%,categorie.ilike.%${normalizedQuery}%`)
    .limit(25)
    .returns<MedicineRow[]>();

  if (medicinesError) throw new Error(medicinesError.message);

  const medicines = matchingMedicines ?? [];
  const medicineIds = medicines.map((medicine) => medicine.id);
  if (!medicineIds.length) return [];

  let pharmacies: PharmacyRow[] = [];
  let pharmacyIds: string[] | null = null;

  if (normalizedCity) {
    const { data: matchingPharmacies, error: pharmaciesError } = await supabase
      .from("pharmacies")
      .select("id, name, city, phone, google_maps_link, image_url, is_open")
      .ilike("city", `%${normalizedCity}%`)
      .limit(50)
      .returns<PharmacyRow[]>();

    if (pharmaciesError) throw new Error(pharmaciesError.message);

    pharmacies = matchingPharmacies ?? [];
    pharmacyIds = pharmacies.map((pharmacy) => pharmacy.id);
    if (!pharmacyIds.length) return [];
  }

  let stockQuery = supabase
    .from("stock")
    .select("id, pharmacy_id, medicine_id, quantity, updated_at")
    .in("medicine_id", medicineIds)
    .gt("quantity", 0);

  if (pharmacyIds) stockQuery = stockQuery.in("pharmacy_id", pharmacyIds);

  const { data: stockRows, error: stockError } = await stockQuery
    .order("updated_at", { ascending: false })
    .limit(50)
    .returns<StockRow[]>();

  if (stockError) throw new Error(stockError.message);

  const stock = stockRows ?? [];
  if (!stock.length) return [];

  const missingPharmacyIds = [...new Set(stock.map((row) => row.pharmacy_id))].filter(
    (id) => !pharmacies.some((pharmacy) => pharmacy.id === id)
  );

  if (missingPharmacyIds.length) {
    const { data: loadedPharmacies, error: loadedPharmaciesError } = await supabase
      .from("pharmacies")
      .select("id, name, city, phone, google_maps_link, image_url, is_open")
      .in("id", missingPharmacyIds)
      .returns<PharmacyRow[]>();

    if (loadedPharmaciesError) throw new Error(loadedPharmaciesError.message);
    pharmacies = [...pharmacies, ...(loadedPharmacies ?? [])];
  }

  const medicineMap = new Map(medicines.map((medicine) => [medicine.id, medicine]));
  const pharmacyMap = new Map(pharmacies.map((pharmacy) => [pharmacy.id, pharmacy]));
  const uniquePharmacyIds = [...new Set(stock.map((row) => row.pharmacy_id))];

  const { data: pharmacyRatingRows, error: pharmacyRatingError } = await supabase
    .from("review_summary")
    .select("target_id, average_rating, review_count")
    .eq("target_type", "pharmacy")
    .in("target_id", uniquePharmacyIds)
    .returns<RatingSummaryRow[]>();

  if (pharmacyRatingError) throw new Error(pharmacyRatingError.message);
  const pharmacyRatingMap = buildRatingMap(pharmacyRatingRows ?? []);

  return stock
    .map((row): SearchResult | null => {
      const medicine = medicineMap.get(row.medicine_id);
      const pharmacy = pharmacyMap.get(row.pharmacy_id);
      if (!medicine || !pharmacy) return null;

      return {
        stockId: row.id,
        medicineId: medicine.id,
        medicineName: medicine.name,
        medicineDescription: medicine.description,
        price: medicine.price === null ? null : Number(medicine.price),
        dosage: medicine.dosage,
        form: medicine.form,
        categorie: medicine.categorie,
        requiresPrescription: Boolean(medicine.requires_prescription),
        medicineImageUrl: medicine.image_url,
        pharmacyId: pharmacy.id,
        pharmacyName: pharmacy.name,
        pharmacyImageUrl: pharmacy.image_url,
        pharmacyIsOpen: Boolean(pharmacy.is_open),
        city: pharmacy.city,
        phone: pharmacy.phone,
        quantity: row.quantity,
        updatedAt: row.updated_at,
        googleMapsLink: pharmacy.google_maps_link,
        pharmacyRatingSummary: pharmacyRatingMap.get(pharmacy.id)
      };
    })
    .filter((item): item is SearchResult => item !== null);
}

export async function searchDoctors(query: string, city?: string, speciality?: string) {
  const supabase = await createClient();
  const normalizedQuery = query.trim();
  const normalizedCity = city?.trim();
  const normalizedSpeciality = speciality?.trim();

  if (!normalizedQuery && !normalizedSpeciality) return [];

  const { data: matchingProfiles, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "doctor")
    .ilike("full_name", `%${normalizedQuery}%`)
    .limit(50)
    .returns<ProfileRow[]>();

  if (profileError) throw new Error(profileError.message);

  const profileIds = matchingProfiles?.map((profile) => profile.id) ?? [];
  let doctorsQuery = supabase.from("doctors").select("id, user_id, speciality, photo_url, visual_mode, avatar_icon, experience_years, professional_background, phone, city, commune, address, google_maps_link, open_days, closed_days, is_open_24_7, open_time, close_time, is_available");

  if (profileIds.length) {
    const quotedIds = profileIds.map((id) => `"${id}"`).join(",");
    if (normalizedQuery) {
      doctorsQuery = doctorsQuery.or(`speciality.ilike.%${normalizedQuery}%,user_id.in.(${quotedIds})`);
    }
  } else if (normalizedQuery) {
    doctorsQuery = doctorsQuery.ilike("speciality", `%${normalizedQuery}%`);
  }

  if (normalizedSpeciality) {
    doctorsQuery = doctorsQuery.ilike("speciality", `%${normalizedSpeciality}%`);
  }

  if (normalizedCity) {
    doctorsQuery = doctorsQuery.or("city.ilike.%" + normalizedCity + "%,commune.ilike.%" + normalizedCity + "%");
  }

  const { data: doctors, error: doctorsError } = await doctorsQuery.limit(50).returns<DoctorRow[]>();
  if (doctorsError) throw new Error(doctorsError.message);

  const doctorRows = doctors ?? [];
  if (!doctorRows.length) return [];

  const doctorIds = doctorRows.map((doctor) => doctor.id);
  const { data: doctorRatingRows, error: doctorRatingError } = await supabase
    .from("review_summary")
    .select("target_id, average_rating, review_count")
    .eq("target_type", "doctor")
    .in("target_id", doctorIds)
    .returns<RatingSummaryRow[]>();

  if (doctorRatingError) throw new Error(doctorRatingError.message);
  const doctorRatingMap = buildRatingMap(doctorRatingRows ?? []);

  const userIds = [...new Set(doctorRows.map((doctor) => doctor.user_id))];
  const { data: doctorProfiles, error: doctorProfilesError } = await supabase
    .from("profiles")
    .select("id, full_name, gender")
    .in("id", userIds)
    .returns<ProfileRow[]>();

  if (doctorProfilesError) throw new Error(doctorProfilesError.message);

  const profileMap = new Map(doctorProfiles.map((profile) => [profile.id, profile]));

  return doctorRows.map((doctor): DoctorSearchResult => {
    const availability = getDoctorAvailability({
      isOpen24h: doctor.is_open_24_7,
      openTime: doctor.open_time,
      closeTime: doctor.close_time
    });
    const doctorProfile = profileMap.get(doctor.user_id);

    return {
      doctorId: doctor.id,
      userId: doctor.user_id,
      fullName: doctorProfile?.full_name ?? null,
      gender: doctorProfile?.gender ?? null,
      speciality: doctor.speciality,
      city: doctor.city,
      commune: doctor.commune,
      address: doctor.address,
      googleMapsLink: doctor.google_maps_link ?? null,
      phone: doctor.phone,
      photoUrl: doctor.photo_url ?? null,
      visualMode: doctor.visual_mode === "icon" ? "icon" : "photo",
      avatarIcon: doctor.avatar_icon ?? "stethoscope",
      experienceYears: doctor.experience_years ?? null,
      professionalBackground: doctor.professional_background ?? null,
      openDays: doctor.open_days ?? null,
      closedDays: doctor.closed_days ?? null,
      isOpen24h: Boolean(doctor.is_open_24_7),
      openTime: doctor.open_time ?? null,
      closeTime: doctor.close_time ?? null,
      isAvailable: availability.isOpen,
      ratingSummary: doctorRatingMap.get(doctor.id)
    };
  });
}
