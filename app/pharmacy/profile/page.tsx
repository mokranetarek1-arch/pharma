import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PharmacyProfilePanel } from "@/components/pharmacy/pharmacy-profile-panel";
import { requireRole } from "@/lib/auth/guards";
import { getPharmacistDashboardData } from "@/lib/data/pharmacy";

export default async function PharmacyProfilePage() {
  const { user, profile } = await requireRole(["pharmacist", "admin"]);
  const dashboardData = await getPharmacistDashboardData(user.id, profile.role);

  return (
    <DashboardShell title="Profil pharmacie" subtitle="Gere l'identité publique de ta pharmacie, sa disponibilité et sa localisation depuis un écran dedié." userEmail={user.email ?? ""} role={profile.role}>
      <PharmacyProfilePanel data={dashboardData} />
    </DashboardShell>
  );
}
