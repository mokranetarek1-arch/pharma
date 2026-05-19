import { updateUserRoleAction } from "@/lib/actions/admin";
import type { AdminOverviewData } from "@/lib/types";
import { HoverCard, Reveal, StaggerGroup, StaggerItem } from "@/components/ui/motion";

export function AdminOverview({ overview }: { overview: AdminOverviewData }) {
  return (
    <div className="space-y-6">
      <StaggerGroup className="grid gap-4 md:grid-cols-4" delay={0.06}>
        <StaggerItem><Metric label="Utilisateurs" value={String(overview.metrics.users)} tone="green" /></StaggerItem>
        <StaggerItem><Metric label="Pharmacies" value={String(overview.metrics.pharmacies)} tone="blue" /></StaggerItem>
        <StaggerItem><Metric label="Medicaments" value={String(overview.metrics.medicines)} tone="slate" /></StaggerItem>
        <StaggerItem><Metric label="Lignes de stock" value={String(overview.metrics.stockItems)} tone="amber" /></StaggerItem>
      </StaggerGroup>

      <section className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
        <Reveal>
          <div className="soft-panel rounded-[1.5rem] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-600">Utilisateurs</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Gestion des roles</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Promouvoir, corriger ou verifier les comptes sans sortir de la plateforme.</p>
              </div>
              <div className="rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-right text-sm text-slate-600">
                <p className="font-semibold text-slate-900">{overview.users.length}</p>
                <p>Profils charges</p>
              </div>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-3">
                <thead><tr className="text-left text-sm text-slate-500"><th>Email</th><th>Nom</th><th>Role</th><th>Action</th></tr></thead>
                <tbody>
                  {overview.users.map((user) => (
                    <tr key={user.id} className="bg-slate-50 text-sm">
                      <td className="rounded-l-xl px-4 py-4 font-medium text-slate-900">{user.email}</td>
                      <td className="px-4 py-4 text-slate-600">{user.fullName || "-"}</td>
                      <td className="px-4 py-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{user.role}</span></td>
                      <td className="rounded-r-xl px-4 py-4">
                        <form action={updateUserRoleAction} className="flex flex-wrap items-center gap-2">
                          <input type="hidden" name="user_id" value={user.id} />
                          <select name="role" defaultValue={user.role} className="field-input rounded-xl px-3 py-2 text-sm shadow-none">
                            <option value="user">user</option>
                            <option value="doctor">doctor</option>
                            <option value="pharmacist">pharmacist</option>
                            <option value="admin">admin</option>
                          </select>
                          <button className="primary-button px-4 py-2 text-xs">Sauver</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="soft-panel rounded-[1.5rem] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Pharmacies</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Vue rapide</h2>
              </div>
              <div className="rounded-[1rem] bg-blue-50 px-4 py-3 text-sm font-medium text-blue-600">Annuaire</div>
            </div>
            <StaggerGroup className="mt-6 space-y-3" delay={0.1}>
              {overview.pharmacies.map((pharmacy) => (
                <StaggerItem key={pharmacy.id}>
                  <HoverCard>
                    <div className="interactive-card rounded-[1rem] border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{pharmacy.name}</h3>
                          <p className="mt-1 text-sm text-slate-600">{pharmacy.city}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{pharmacy.phone || "Sans telephone"}</span>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{pharmacy.ownerEmail || "Aucun pharmacien associe"}</p>
                    </div>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "green" | "amber" | "slate" | "blue" }) {
  const tones = {
    green: "border-green-100 bg-green-50 text-green-800",
    amber: "border-amber-100 bg-amber-50 text-amber-800",
    slate: "border-slate-200 bg-white text-slate-800",
    blue: "border-blue-100 bg-blue-50 text-blue-800"
  };

  return <div className={`rounded-[1rem] border p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)] ${tones[tone]}`}><p className="text-sm opacity-70">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>;
}
