import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DoctorProfilePanel } from "@/components/doctor/doctor-profile-panel";
import { requireRole } from "@/lib/auth/guards";
import { getDoctorProfileData } from "@/lib/data/doctor";

export default async function DoctorProfilePage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { user, profile } = await requireRole(["doctor", "admin"]);
  const params = await searchParams;
  const doctorData = await getDoctorProfileData(user.id, profile.role);

  return (
    <DashboardShell title="Profil medecin" subtitle="Renseigne ta specialite, ton numero, ta localisation et ta disponibilite depuis un ecran dedie." userEmail={user.email ?? ""} role={profile.role}>
      <DoctorProfilePanel data={doctorData} saved={params.saved === "1"} />
    </DashboardShell>
  );
}
