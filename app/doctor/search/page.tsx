import { SearchPage } from "@/components/search/search-page";
import { requireRole } from "@/lib/auth/guards";
import { searchDoctors } from "@/lib/data/search";

export default async function DoctorSearchPage({ searchParams }: { searchParams: Promise<{ q?: string; city?: string; speciality?: string }> }) {
  const { user, profile } = await requireRole(["doctor", "admin"]);
  const params = await searchParams;
  const query = params.q ?? "";
  const city = params.city ?? "";
  const speciality = params.speciality ?? "";
  const doctorResults = await searchDoctors(query, city, speciality);

  return (
    <SearchPage
      roleLabel="Medecin"
      title="Recherche medecin"
      description="Trouve rapidement un medecin par nom, specialite et ville pour verifier comment ta fiche apparait dans la recherche."
      searchType="doctor"
      results={[]}
      doctorResults={doctorResults}
      query={query}
      city={city}
      speciality={speciality}
      userEmail={user.email ?? null}
      userRole={profile.role}
      action="/doctor/search"
    />
  );
}
