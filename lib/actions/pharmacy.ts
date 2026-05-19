﻿"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { uploadImageAsset } from "@/lib/supabase/storage";
import { isValidMedicineForm } from "@/lib/constants/medicines";
import { getDoctorAvailability } from "@/lib/doctor-availability";

const EUR_TO_DZD_RATE = 155.8;

export async function savePharmacyProfileAction(formData: FormData) {
  const { profile } = await requireRole(["pharmacist", "admin"]);
  const pharmacyId = String(formData.get("pharmacy_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const googleMapsLink = String(formData.get("google_maps_link") ?? "").trim() || null;
  const openDays = String(formData.get("open_days") ?? "").trim() || null;
  const closedDays = String(formData.get("closed_days") ?? "").trim() || null;
  const isOpen24h = formData.getAll("is_open_24_7").includes("true");
  const latitudeRaw = String(formData.get("latitude") ?? "").trim();
  const longitudeRaw = String(formData.get("longitude") ?? "").trim();
  const openTime = isOpen24h ? null : String(formData.get("open_time") ?? "").trim() || null;
  const closeTime = isOpen24h ? null : String(formData.get("close_time") ?? "").trim() || null;
  const imageFile = formData.get("image") as File | null;
  const latitude = latitudeRaw ? Number(latitudeRaw) : null;
  const longitude = longitudeRaw ? Number(longitudeRaw) : null;
  const availability = getDoctorAvailability({ isOpen24h, openTime, closeTime });

  if (!name || !city) throw new Error("Le nom de la pharmacie et la ville sont obligatoires.");
  if ((latitudeRaw && Number.isNaN(latitude)) || (longitudeRaw && Number.isNaN(longitude))) throw new Error("Latitude ou longitude invalide.");

  const supabase = await createClient();
  const uploadedImageUrl = imageFile && imageFile.size > 0 ? await uploadImageAsset("pharmacies", profile.id, imageFile) : null;

  if (pharmacyId) {
    if (profile.role === "pharmacist") {
      const { data: ownedPharmacy } = await supabase.from("pharmacies").select("id").eq("id", pharmacyId).eq("user_id", profile.id).maybeSingle();
      if (!ownedPharmacy) throw new Error("Cette pharmacie ne t'appartient pas.");
    }

    const payload: Record<string, unknown> = {
      name,
      city,
      address,
      phone,
      google_maps_link: googleMapsLink,
      latitude,
      longitude,
      is_open: isOpen24h ? true : availability.isOpen,
      open_days: openDays,
      closed_days: closedDays,
      is_open_24_7: isOpen24h,
      open_time: openTime,
      close_time: closeTime
    };
    if (uploadedImageUrl) payload.image_url = uploadedImageUrl;

    const { error } = await supabase.from("pharmacies").update(payload).eq("id", pharmacyId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("pharmacies").insert({
      user_id: profile.id,
      name,
      city,
      address,
      phone,
      google_maps_link: googleMapsLink,
      latitude,
      longitude,
      is_open: isOpen24h ? true : availability.isOpen,
      open_days: openDays,
      closed_days: closedDays,
      is_open_24_7: isOpen24h,
      open_time: openTime,
      close_time: closeTime,
      image_url: uploadedImageUrl
    });

    if (error) throw new Error(error.message);
  }

  revalidatePath("/pharmacy/dashboard");
}

export async function addMedicineAction(formData: FormData) {
  const { user, profile } = await requireRole(["pharmacist", "admin"]);
  const name = String(formData.get("name") ?? "").trim();
  const priceAmountRaw = String(formData.get("price_amount") ?? "").trim();
  const priceCurrency = String(formData.get("price_currency") ?? "dzd").trim().toLowerCase();
  const priceDzdRaw = String(formData.get("price_dzd") ?? "").trim();
  const priceEurRaw = String(formData.get("price_eur") ?? "").trim();
  const priceAmount = priceAmountRaw ? Number(priceAmountRaw) : null;
  const legacyPriceDzd = priceDzdRaw ? Number(priceDzdRaw) : null;
  const legacyPriceEur = priceEurRaw ? Number(priceEurRaw) : null;
  const price = priceAmount !== null
    ? priceCurrency === "eur"
      ? Number((priceAmount * EUR_TO_DZD_RATE).toFixed(2))
      : priceAmount
    : legacyPriceDzd !== null
      ? legacyPriceDzd
      : legacyPriceEur !== null
        ? Number((legacyPriceEur * EUR_TO_DZD_RATE).toFixed(2))
        : null;
  const dosage = String(formData.get("dosage") ?? "").trim() || null;
  const formValue = String(formData.get("form") ?? "").trim();
  const formCustom = String(formData.get("form_custom") ?? "").trim();
  const form = formCustom || formValue || null;
  const categorieValue = String(formData.get("categorie") ?? "").trim();
  const categorieCustom = String(formData.get("categorie_custom") ?? "").trim();
  const categorie = categorieCustom || categorieValue || null;
  const requiresPrescription = formData.get("requires_prescription") === "on";
  const description = String(formData.get("description") ?? "").trim() || null;
  const pharmacyId = String(formData.get("pharmacy_id") ?? "").trim();
  const initialStatus = String(formData.get("initial_status") ?? "").trim() || "available";
  const initialQuantityRaw = String(formData.get("initial_quantity") ?? "").trim();
  const initialQuantity = initialQuantityRaw ? Number(initialQuantityRaw) : null;
  const imageFile = formData.get("image") as File | null;

  if (!name) throw new Error("Le nom du medicament est obligatoire.");
  if ((priceAmountRaw && (priceAmount === null || Number.isNaN(priceAmount) || priceAmount < 0)) || (priceDzdRaw && (legacyPriceDzd === null || Number.isNaN(legacyPriceDzd) || legacyPriceDzd < 0)) || (priceEurRaw && (legacyPriceEur === null || Number.isNaN(legacyPriceEur) || legacyPriceEur < 0))) throw new Error("Prix du medicament invalide.");
  if (initialQuantityRaw && (initialQuantity === null || Number.isNaN(initialQuantity) || initialQuantity < 0)) throw new Error("Quantite initiale invalide.");
  if (formValue && formValue !== "__other" && form && !isValidMedicineForm(form)) throw new Error("Forme pharmaceutique invalide.");

  const imageUrl = imageFile && imageFile.size > 0 ? await uploadImageAsset("medicines", user.id, imageFile) : null;
  const supabase = await createClient();
  const { data: insertedMedicine, error } = await supabase.from("medicines").insert({
    name,
    price,
    dosage,
    form,
    categorie,
    requires_prescription: requiresPrescription,
    description,
    image_url: imageUrl,
    created_by: user.id
  }).select("id").single();

  if (error) throw new Error(error.message);

  if (pharmacyId && insertedMedicine?.id) {
    if (profile.role === "pharmacist") {
      const { data: pharmacy } = await supabase.from("pharmacies").select("id").eq("id", pharmacyId).eq("user_id", profile.id).maybeSingle();
      if (!pharmacy) throw new Error("Cette pharmacie ne t'appartient pas.");
    }

    const quantityFromStatus = initialStatus === "available" ? (initialQuantity ?? 1) : 0;
    const { error: stockError } = await supabase.from("stock").upsert({
      pharmacy_id: pharmacyId,
      medicine_id: insertedMedicine.id,
      quantity: quantityFromStatus,
      updated_at: new Date().toISOString()
    }, { onConflict: "pharmacy_id,medicine_id" });

    if (stockError) throw new Error(stockError.message);
  }

  revalidatePath("/pharmacy/dashboard");
  revalidatePath("/pharmacy/medicines");
}

export async function updateMedicineAction(formData: FormData) {
  const { user } = await requireRole(["pharmacist", "admin"]);
  const medicineId = String(formData.get("medicine_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const priceAmountRaw = String(formData.get("price_amount") ?? "").trim();
  const priceCurrency = String(formData.get("price_currency") ?? "dzd").trim().toLowerCase();
  const priceDzdRaw = String(formData.get("price_dzd") ?? "").trim();
  const priceEurRaw = String(formData.get("price_eur") ?? "").trim();
  const priceAmount = priceAmountRaw ? Number(priceAmountRaw) : null;
  const legacyPriceDzd = priceDzdRaw ? Number(priceDzdRaw) : null;
  const legacyPriceEur = priceEurRaw ? Number(priceEurRaw) : null;
  const price = priceAmount !== null
    ? priceCurrency === "eur"
      ? Number((priceAmount * EUR_TO_DZD_RATE).toFixed(2))
      : priceAmount
    : legacyPriceDzd !== null
      ? legacyPriceDzd
      : legacyPriceEur !== null
        ? Number((legacyPriceEur * EUR_TO_DZD_RATE).toFixed(2))
        : null;
  const dosage = String(formData.get("dosage") ?? "").trim() || null;
  const formValue = String(formData.get("form") ?? "").trim();
  const formCustom = String(formData.get("form_custom") ?? "").trim();
  const form = formCustom || formValue || null;
  const categorieValue = String(formData.get("categorie") ?? "").trim();
  const categorieCustom = String(formData.get("categorie_custom") ?? "").trim();
  const categorie = categorieCustom || categorieValue || null;
  const requiresPrescription = formData.get("requires_prescription") === "on";
  const description = String(formData.get("description") ?? "").trim() || null;
  const imageFile = formData.get("image") as File | null;

  if (!medicineId) throw new Error("L'ID du medicament est obligatoire.");
  if (!name) throw new Error("Le nom du medicament est obligatoire.");
  if ((priceAmountRaw && (priceAmount === null || Number.isNaN(priceAmount) || priceAmount < 0)) || (priceDzdRaw && (legacyPriceDzd === null || Number.isNaN(legacyPriceDzd) || legacyPriceDzd < 0)) || (priceEurRaw && (legacyPriceEur === null || Number.isNaN(legacyPriceEur) || legacyPriceEur < 0))) throw new Error("Prix du medicament invalide.");
  if (formValue && formValue !== "__other" && form && !isValidMedicineForm(form)) throw new Error("Forme pharmaceutique invalide.");

  const supabase = await createClient();
  const uploadedImageUrl = imageFile && imageFile.size > 0 ? await uploadImageAsset("medicines", user.id, imageFile) : null;
  const payload: Record<string, unknown> = {
    name,
    price,
    dosage,
    form,
    categorie,
    requires_prescription: requiresPrescription,
    description
  };

  if (uploadedImageUrl) payload.image_url = uploadedImageUrl;

  const { error } = await supabase.from("medicines").update(payload).eq("id", medicineId);
  if (error) throw new Error(error.message);

  revalidatePath("/pharmacy/dashboard");
  revalidatePath("/pharmacy/medicines");
  revalidatePath("/search");
}

export async function updateStockAction(formData: FormData) {
  const { profile } = await requireRole(["pharmacist", "admin"]);
  const pharmacyId = String(formData.get("pharmacy_id") ?? "").trim();
  const medicineId = String(formData.get("medicine_id") ?? "").trim();
  const quantity = Number(formData.get("quantity") ?? 0);

  if (!pharmacyId || !medicineId || Number.isNaN(quantity) || quantity < 0) throw new Error("Informations de stock invalides.");

  const supabase = await createClient();
  if (profile.role === "pharmacist") {
    const { data: pharmacy } = await supabase.from("pharmacies").select("id").eq("id", pharmacyId).eq("user_id", profile.id).maybeSingle();
    if (!pharmacy) throw new Error("Cette pharmacie ne t'appartient pas.");
  }

  const { error } = await supabase.from("stock").upsert({ pharmacy_id: pharmacyId, medicine_id: medicineId, quantity, updated_at: new Date().toISOString() }, { onConflict: "pharmacy_id,medicine_id" });
  if (error) throw new Error(error.message);
  revalidatePath("/pharmacy/dashboard");
}

export async function deleteMedicineAction(formData: FormData) {
  const { profile } = await requireRole(["pharmacist", "admin"]);
  const pharmacyId = String(formData.get("pharmacy_id") ?? "").trim();
  const medicineId = String(formData.get("medicine_id") ?? "").trim();

  if (!pharmacyId || !medicineId) {
    throw new Error("L'ID de la pharmacie et l'ID du medicament sont obligatoires.");
  }

  const supabase = await createClient();

  // Verify that the pharmacist owns this pharmacy before allowing deletion from its stock
  if (profile.role === "pharmacist") {
    const { data: ownedPharmacy, error: pharmacyError } = await supabase
      .from("pharmacies")
      .select("id")
      .eq("id", pharmacyId)
      .eq("user_id", profile.id)
      .maybeSingle();

    if (pharmacyError) throw new Error(`Erreur lors de la verification de la pharmacie: ${pharmacyError.message}`);
    if (!ownedPharmacy) throw new Error("Cette pharmacie ne t'appartient pas ou n'existe pas.");
  }

  // Delete the medicine from the pharmacy's stock (pharmacy_medicines table)
  const { error } = await supabase.from("pharmacy_medicines").delete().eq("pharmacy_id", pharmacyId).eq("medicine_id", medicineId);

  if (error) throw new Error(`Erreur lors de la suppression du medicament du stock: ${error.message}`);

  revalidatePath("/pharmacy/dashboard");
  revalidatePath("/pharmacy/medicines"); // Revalidate the medicines page if it exists
  revalidatePath("/search"); // Revalidate search results as stock might change
}
