import { SearchPage } from "@/components/search/search-page";
import { ensureProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import { searchDoctors, searchMedicines } from "@/lib/data/search";
import type { SearchType } from "@/lib/types";

function normalizeSearchType(type?: string): SearchType {
  return type === "doctor" ? "doctor" : "medicine";
}

export default async function PublicSearchPage({ searchParams }: { searchParams: Promise<{ q?: string; city?: string; type?: string; speciality?: string }> }) {
  const params = await searchParams;
  const searchType = normalizeSearchType(params.type);
  const query = params.q ?? "";
  const city = params.city ?? "";
  const speciality = params.speciality ?? "";
  const medicineResults = searchType === "medicine" && query ? await searchMedicines(query, city) : [];
  const doctorResults = searchType === "doctor" ? await searchDoctors(query, city, speciality) : [];

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const profile = user ? await ensureProfile(user) : null;

  const title = searchType === "doctor" ? "Trouve un medcin ou specialiste" : "Trouve un medicament en quelques secondes";
  const description = searchType === "doctor"
    ? "Recherche de medecins par nom, spécialité et ville pour aider les patients à trouver le bon spécialiste."
    : "Recherche simple pour patients et visiteurs. Ajoute une ville si tu veux limiter aux pharmacies les plus proches.";

  return (
    <SearchPage
      roleLabel="Recherche publique"
      title={title}
      description={description}
      searchType={searchType}
      results={medicineResults}
      doctorResults={doctorResults}
      query={query}
      city={city}
      speciality={speciality}
      userEmail={user?.email ?? null}
      userRole={profile?.role ?? null}
      action="/search"
    />
  );
}
