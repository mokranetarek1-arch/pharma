import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PharmacyMedicinesPanel } from "@/components/pharmacy/pharmacy-medicines-panel";
import { requireRole } from "@/lib/auth/guards";
import { getPharmacistDashboardData } from "@/lib/data/pharmacy";

export default async function PharmacyMedicinesPage() {
  const { user, profile } = await requireRole(["pharmacist", "admin"]);
  const dashboardData = await getPharmacistDashboardData(user.id, profile.role);

  return (
    <DashboardShell title="Medicaments et stock" subtitle="Ajoute des medicaments au catalogue et mets a jour l'inventaire depuis une page operationnelle dediee." userEmail={user.email ?? ""} role={profile.role}>
      <PharmacyMedicinesPanel data={dashboardData} />
    </DashboardShell>
  );
}
