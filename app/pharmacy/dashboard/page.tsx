import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PharmacyOverview } from "@/components/pharmacy/pharmacy-overview";
import { requireRole } from "@/lib/auth/guards";
import { getPharmacistDashboardData } from "@/lib/data/pharmacy";

export default async function PharmacyDashboardPage() {
  const { user, profile } = await requireRole(["pharmacist", "admin"]);
  const dashboardData = await getPharmacistDashboardData(user.id, profile.role);

  return (
    <DashboardShell title="Vue d'ensemble pharmacie" subtitle="Un hub clair pour naviguer entre ton profil public, la creation des medicaments et la gestion du stock." userEmail={user.email ?? ""} role={profile.role}>
      <PharmacyOverview data={dashboardData} />
    </DashboardShell>
  );
}
