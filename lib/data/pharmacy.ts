import { createClient } from "@/lib/supabase/server";
import type { PharmacistDashboardData, PublicPharmacyStoreData, SearchResult, UserRole } from "@/lib/types";

type PharmacyRow = {
  id: string;
  name: string;
  city: string;
  address: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  google_maps_link: string | null;
  image_url: string | null;
  is_open: boolean | null;
  open_days: string | null;
  closed_days: string | null;
  is_open_24_7: boolean | null;
  open_time: string | null;
  close_time: string | null;
};

type RatingSummaryRow = {
  target_id: string;
  average_rating: number | null;
  review_count: number;
};

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

type InventoryRow = {
  id: string;
  quantity: number;
  updated_at: string;
  medicines: {
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    dosage: string | null;
    form: string | null;
    categorie: string | null;
    requires_prescription: boolean | null;
    image_url: string | null;
  } | null;
  pharmacies: {
    id: string;
    name: string;
    city: string;
    phone: string | null;
    google_maps_link: string | null;
    image_url: string | null;
    is_open: boolean | null;
  } | null;
};

export async function getPharmacistDashboardData(userId: string, role: UserRole): Promise<PharmacistDashboardData> {
  const supabase = await createClient();
  let pharmacyQuery = supabase
    .from("pharmacies")
    .select("id, name, city, address, phone, latitude, longitude, google_maps_link, image_url, is_open, open_days, closed_days, is_open_24_7, open_time, close_time")
    .order("created_at", { ascending: true });

  if (role === "pharmacist") pharmacyQuery = pharmacyQuery.eq("user_id", userId);

  const [{ data: pharmacies, error: pharmaciesError }, { data: catalogue, error: catalogueError }] = await Promise.all([
    pharmacyQuery.returns<PharmacyRow[]>(),
    supabase.from("medicines").select("id, name, description, price, dosage, form, categorie, requires_prescription, image_url").order("name").returns<MedicineRow[]>()
  ]);

  if (pharmaciesError) throw new Error(pharmaciesError.message);
  if (catalogueError) throw new Error(catalogueError.message);

  const pharmacyIds = (pharmacies ?? []).map((pharmacy) => pharmacy.id);
  const pharmacyRatingMap = new Map<string, { averageRating: number | null; reviewCount: number }>();

  if (pharmacyIds.length) {
    const { data: ratingRows, error: ratingError } = await supabase
      .from("review_summary")
      .select("target_id, average_rating, review_count")
      .eq("target_type", "pharmacy")
      .in("target_id", pharmacyIds)
      .returns<RatingSummaryRow[]>();

    if (ratingError) throw new Error(ratingError.message);
    (ratingRows ?? []).forEach((row) => pharmacyRatingMap.set(row.target_id, { averageRating: row.average_rating === null ? null : Number(row.average_rating), reviewCount: Number(row.review_count) }));
  }

  let inventory: SearchResult[] = [];

  if (pharmacyIds.length) {
    const { data: inventoryRows, error: inventoryError } = await supabase
      .from("stock")
      .select(`id, quantity, updated_at, medicines:medicine_id (id, name, description, price, dosage, form, categorie, requires_prescription, image_url), pharmacies:pharmacy_id (id, name, city, phone, google_maps_link, image_url, is_open)`)
      .in("pharmacy_id", pharmacyIds)
      .order("updated_at", { ascending: false })
      .returns<InventoryRow[]>();

    if (inventoryError) throw new Error(inventoryError.message);

    inventory = (inventoryRows ?? []).filter((row) => row.medicines && row.pharmacies).map((row): SearchResult => ({
      stockId: row.id,
      medicineId: row.medicines!.id,
      medicineName: row.medicines!.name,
      medicineDescription: row.medicines!.description,
      price: row.medicines!.price === null ? null : Number(row.medicines!.price),
      dosage: row.medicines!.dosage,
      form: row.medicines!.form,
      categorie: row.medicines!.categorie,
      requiresPrescription: Boolean(row.medicines!.requires_prescription),
      medicineImageUrl: row.medicines!.image_url,
      pharmacyId: row.pharmacies!.id,
      pharmacyName: row.pharmacies!.name,
      pharmacyImageUrl: row.pharmacies!.image_url,
      pharmacyIsOpen: Boolean(row.pharmacies!.is_open),
      city: row.pharmacies!.city,
      phone: row.pharmacies!.phone,
      quantity: row.quantity,
      updatedAt: row.updated_at,
      googleMapsLink: row.pharmacies!.google_maps_link,
      pharmacyRatingSummary: pharmacyRatingMap.get(row.pharmacies!.id)
    }));
  }

  const visibleMedicineIds = new Set(inventory.filter((item) => item.quantity > 0).map((item) => item.medicineId));
  const reviewSummaries = (pharmacies ?? [])
    .map((pharmacy) => pharmacyRatingMap.get(pharmacy.id))
    .filter((summary): summary is NonNullable<typeof summary> => Boolean(summary));
  const weightedRatingTotal = reviewSummaries.reduce((sum, item) => sum + ((item.averageRating ?? 0) * item.reviewCount), 0);
  const reviewCount = reviewSummaries.reduce((sum, item) => sum + item.reviewCount, 0);
  const averageRating = reviewCount ? weightedRatingTotal / reviewCount : null;

  return {
    metrics: {
      pharmaciesCount: (pharmacies ?? []).length,
      activeStockCount: inventory.length,
      catalogueCount: (catalogue ?? []).length,
      visibleMedicinesCount: visibleMedicineIds.size,
      totalUnitsInStock: inventory.reduce((sum, item) => sum + item.quantity, 0),
      averageRating,
      reviewCount
    },
    pharmacies: (pharmacies ?? []).map((pharmacy) => ({
      id: pharmacy.id,
      name: pharmacy.name,
      city: pharmacy.city,
      address: pharmacy.address,
      phone: pharmacy.phone,
      latitude: pharmacy.latitude,
      longitude: pharmacy.longitude,
      googleMapsLink: pharmacy.google_maps_link,
      imageUrl: pharmacy.image_url,
      isOpen: Boolean(pharmacy.is_open),
      openDays: pharmacy.open_days ?? null,
      closedDays: pharmacy.closed_days ?? null,
      isOpen24h: Boolean(pharmacy.is_open_24_7),
      openTime: pharmacy.open_time ?? null,
      closeTime: pharmacy.close_time ?? null,
      ratingSummary: pharmacyRatingMap.get(pharmacy.id)
    })),
    catalogue: (catalogue ?? []).map((medicine) => ({
      id: medicine.id,
      name: medicine.name,
      description: medicine.description,
      price: medicine.price === null ? null : Number(medicine.price),
      dosage: medicine.dosage,
      form: medicine.form,
      categorie: medicine.categorie,
      requiresPrescription: Boolean(medicine.requires_prescription),
      imageUrl: medicine.image_url
    })),
    inventory
  };
}

export async function getPublicPharmacyStoreData(pharmacyId: string): Promise<PublicPharmacyStoreData | null> {
  const supabase = await createClient();

  const { data: pharmacy, error: pharmacyError } = await supabase
    .from("pharmacies")
    .select("id, name, city, address, phone, google_maps_link, image_url, is_open, open_days, closed_days, is_open_24_7, open_time, close_time")
    .eq("id", pharmacyId)
    .maybeSingle<PharmacyRow>();

  if (pharmacyError) throw new Error(pharmacyError.message);
  if (!pharmacy) return null;

  const { data: ratingRows, error: ratingError } = await supabase
    .from("review_summary")
    .select("target_id, average_rating, review_count")
    .eq("target_type", "pharmacy")
    .eq("target_id", pharmacyId)
    .returns<RatingSummaryRow[]>();

  if (ratingError) throw new Error(ratingError.message);

  const pharmacyRating = (ratingRows ?? [])[0];

  const { data: inventoryRows, error: inventoryError } = await supabase
    .from("stock")
    .select(`id, quantity, updated_at, medicines:medicine_id (id, name, description, price, dosage, form, categorie, requires_prescription, image_url), pharmacies:pharmacy_id (id, name, city, phone, google_maps_link, image_url, is_open)`)
    .eq("pharmacy_id", pharmacyId)
    .gt("quantity", 0)
    .order("updated_at", { ascending: false })
    .returns<InventoryRow[]>();

  if (inventoryError) throw new Error(inventoryError.message);

  const medicines = (inventoryRows ?? [])
    .filter((row) => row.medicines && row.pharmacies)
    .map((row): SearchResult => ({
      stockId: row.id,
      medicineId: row.medicines!.id,
      medicineName: row.medicines!.name,
      medicineDescription: row.medicines!.description,
      price: row.medicines!.price === null ? null : Number(row.medicines!.price),
      dosage: row.medicines!.dosage,
      form: row.medicines!.form,
      categorie: row.medicines!.categorie,
      requiresPrescription: Boolean(row.medicines!.requires_prescription),
      medicineImageUrl: row.medicines!.image_url,
      pharmacyId,
      pharmacyName: pharmacy.name,
      pharmacyImageUrl: pharmacy.image_url,
      pharmacyIsOpen: Boolean(pharmacy.is_open),
      city: pharmacy.city,
      phone: pharmacy.phone,
      quantity: row.quantity,
      updatedAt: row.updated_at,
      googleMapsLink: pharmacy.google_maps_link,
      pharmacyRatingSummary: pharmacyRating
        ? {
            averageRating: pharmacyRating.average_rating === null ? null : Number(pharmacyRating.average_rating),
            reviewCount: Number(pharmacyRating.review_count)
          }
        : undefined
    }));

  return {
    pharmacy: {
      id: pharmacy.id,
      name: pharmacy.name,
      city: pharmacy.city,
      address: pharmacy.address,
      phone: pharmacy.phone,
      googleMapsLink: pharmacy.google_maps_link,
      imageUrl: pharmacy.image_url,
      isOpen: Boolean(pharmacy.is_open),
      openDays: pharmacy.open_days ?? null,
      closedDays: pharmacy.closed_days ?? null,
      isOpen24h: Boolean(pharmacy.is_open_24_7),
      openTime: pharmacy.open_time ?? null,
      closeTime: pharmacy.close_time ?? null,
      ratingSummary: pharmacyRating
        ? {
            averageRating: pharmacyRating.average_rating === null ? null : Number(pharmacyRating.average_rating),
            reviewCount: Number(pharmacyRating.review_count)
          }
        : undefined
    },
    medicines
  };
}
