import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AdminOverview } from "@/components/admin/admin-overview";
import { requireRole } from "@/lib/auth/guards";
import { getAdminOverview } from "@/lib/data/admin";

export default async function AdminPage() {
  const { user, profile } = await requireRole(["admin"]);
  const overview = await getAdminOverview();

  return (
    <DashboardShell title="Administration" subtitle="Supervise les comptes, les pharmacies et l'activite generale depuis une interface simple." userEmail={user.email ?? ""} role={profile.role}>
      <AdminOverview overview={overview} />
    </DashboardShell>
  );
}
