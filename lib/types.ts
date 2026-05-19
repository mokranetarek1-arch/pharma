export type UserRole = "doctor" | "pharmacist" | "user" | "admin";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  phone: string | null;
  gender: "male" | "female" | null;
  created_at: string;
};

export type SearchResult = {
  stockId: string;
  medicineId: string;
  medicineName: string;
  medicineDescription: string | null;
  price: number | null;
  dosage: string | null;
  form: string | null;
  categorie: string | null;
  requiresPrescription: boolean;
  medicineImageUrl: string | null;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyImageUrl: string | null;
  pharmacyIsOpen: boolean;
  city: string;
  phone: string | null;
  quantity: number;
  updatedAt: string;
  googleMapsLink: string | null;
  pharmacyRatingSummary?: RatingSummary;
};

export type RatingSummary = {
  averageRating: number | null;
  reviewCount: number;
};

export type DoctorSearchResult = {
  doctorId: string;
  userId: string;
  fullName: string | null;
  gender: "male" | "female" | null;
  speciality: string | null;
  city: string | null;
  commune: string | null;
  address: string | null;
  googleMapsLink: string | null;
  phone: string | null;
  photoUrl: string | null;
  visualMode: "photo" | "icon";
  avatarIcon: string | null;
  experienceYears: number | null;
  professionalBackground: string | null;
  openDays: string | null;
  closedDays: string | null;
  isOpen24h: boolean;
  openTime: string | null;
  closeTime: string | null;
  isAvailable: boolean;
  ratingSummary?: RatingSummary;
};

export type SearchType = "medicine" | "doctor";

export type DoctorProfileData = {
  id: string | null;
  fullName: string | null;
  gender: "male" | "female" | null;
  speciality: string | null;
  phone: string | null;
  city: string | null;
  commune: string | null;
  address: string | null;
  googleMapsLink: string | null;
  photoUrl: string | null;
  visualMode: "photo" | "icon";
  avatarIcon: string | null;
  experienceYears: number | null;
  professionalBackground: string | null;
  openDays: string | null;
  closedDays: string | null;
  isOpen24h: boolean;
  openTime: string | null;
  closeTime: string | null;
  isAvailable: boolean;
  ratingSummary?: RatingSummary;
};

export type PharmacistDashboardData = {
  metrics: {
    pharmaciesCount: number;
    activeStockCount: number;
    catalogueCount: number;
    visibleMedicinesCount: number;
    totalUnitsInStock: number;
    averageRating: number | null;
    reviewCount: number;
  };
  pharmacies: {
    id: string;
    name: string;
    city: string;
    address: string | null;
    phone: string | null;
    latitude: number | null;
    longitude: number | null;
    googleMapsLink: string | null;
    imageUrl: string | null;
    isOpen: boolean;
    openDays: string | null;
    closedDays: string | null;
    isOpen24h: boolean;
    openTime: string | null;
    closeTime: string | null;
    ratingSummary?: RatingSummary;
  }[];
  catalogue: {
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    dosage: string | null;
    form: string | null;
    categorie: string | null;
    requiresPrescription: boolean;
    imageUrl: string | null;
  }[];
  inventory: SearchResult[];
};

export type PublicPharmacyStoreData = {
  pharmacy: {
    id: string;
    name: string;
    city: string;
    address: string | null;
    phone: string | null;
    googleMapsLink: string | null;
    imageUrl: string | null;
    isOpen: boolean;
    openDays: string | null;
    closedDays: string | null;
    isOpen24h: boolean;
    openTime: string | null;
    closeTime: string | null;
    ratingSummary?: RatingSummary;
  };
  medicines: SearchResult[];
};

export type AdminOverviewData = {
  metrics: { users: number; pharmacies: number; medicines: number; stockItems: number };
  users: { id: string; email: string; fullName: string | null; role: UserRole }[];
  pharmacies: { id: string; name: string; city: string; phone: string | null; ownerEmail: string | null }[];
};
