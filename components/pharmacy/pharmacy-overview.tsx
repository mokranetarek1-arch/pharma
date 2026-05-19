import Link from "next/link";
import type { PharmacistDashboardData } from "@/lib/types";
import { DashboardShortcutCard } from "@/components/layout/dashboard-shortcut-card";
import { HoverCard, Reveal, StaggerGroup, StaggerItem } from "@/components/ui/motion";
import { getMedicineFormLabel } from "@/lib/constants/medicines";

export function PharmacyOverview({ data }: { data: PharmacistDashboardData }) {
  const primaryPharmacy = data.pharmacies[0];
  const recentInventory = data.inventory.slice(0, 4);
  const recentMedicines = data.catalogue.slice(0, 3);
  const averageRating = data.metrics.averageRating;

  return (
    <div className="space-y-6">
      <StaggerGroup className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" delay={0.06}>
        <StaggerItem><StatCard label="Pharmacies gerees" value={String(data.metrics.pharmaciesCount)} helper="Profil public et disponibilite" tone="green" /></StaggerItem>
        <StaggerItem><StatCard label="Lignes de stock" value={String(data.metrics.activeStockCount)} helper="Produits relies a ton inventaire" tone="amber" /></StaggerItem>
        <StaggerItem><StatCard label="Medicaments visibles" value={String(data.metrics.visibleMedicinesCount)} helper="Apparaissent dans la recherche publique" tone="blue" /></StaggerItem>
        <StaggerItem><StatCard label="Note globale" value={averageRating !== null ? `${averageRating.toFixed(1)} / 5` : "-"} helper={data.metrics.reviewCount ? `${data.metrics.reviewCount} avis patients` : "Pas encore d'avis"} tone="green" /></StaggerItem>
      </StaggerGroup>

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Reveal>
          <div className="soft-panel rounded-[1.5rem] p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-600">Espace pharmacie</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">Une organisation plus claire pour mieux travailler.</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">Utilise des pages dediees pour separer ton profil pharmacie, la gestion des medicaments et la mise a jour du stock.</p>
              </div>
              <div className="rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Pharmacie principale</p>
                <p className="mt-2 font-semibold text-slate-900">{primaryPharmacy?.name || "Aucune pharmacie"}</p>
                <p className="mt-1 text-slate-600">{primaryPharmacy?.city || "Ville non renseignee"}</p>
                {primaryPharmacy ? <Link href={`/pharmacies/${primaryPharmacy.id}`} className="mt-3 inline-flex text-sm font-semibold text-green-700 hover:text-green-800">Voir le profil public</Link> : null}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <DashboardShortcutCard href="/pharmacy/dashboard" title="Vue d'ensemble" text="Revenir au tableau de bord principal de la pharmacie." cta="Ouvrir le dashboard" tone="amber" />
              <DashboardShortcutCard href="/pharmacy/profile" title="Profil pharmacie" text="Nom, photo, horaires, contact public et presentation visible par les patients." cta="Modifier le profil" tone="emerald" />
              <DashboardShortcutCard href="/pharmacy/medicines" title="Medicaments et stock" text="Ajouter au catalogue, definir les formes et mettre a jour l'inventaire." cta="Gerer les medicaments" tone="blue" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="soft-panel rounded-[1.5rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Apercu public</p>
            <div className="mt-4 rounded-[1rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <PharmacyVisual imageUrl={primaryPharmacy?.imageUrl ?? null} name={primaryPharmacy?.name ?? "Ph"} />
                <div>
                  <p className="font-semibold text-slate-900">{primaryPharmacy?.name || "Configure ton profil"}</p>
                  <p className="mt-1 text-sm text-slate-600">{primaryPharmacy?.city || "Ajoute une ville"}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Chip>{primaryPharmacy?.isOpen ? "Ouverte" : "Fermee"}</Chip>
                {primaryPharmacy?.phone ? <Chip>{primaryPharmacy.phone}</Chip> : null}
                {primaryPharmacy?.googleMapsLink ? <Chip>Maps active</Chip> : null}
                {primaryPharmacy?.ratingSummary ? <Chip>{(primaryPharmacy.ratingSummary.averageRating ?? 0).toFixed(1)} / 5</Chip> : null}
                {primaryPharmacy?.ratingSummary ? <Chip>{primaryPharmacy.ratingSummary.reviewCount} avis</Chip> : null}
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">Cette fiche est celle que les patients et les doctors verront pendant la recherche.</p>
          </div>
        </Reveal>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <div className="soft-panel rounded-[1.5rem] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Inventaire recent</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Dernieres lignes de stock</h2>
              </div>
              <Link href="/pharmacy/medicines" className="secondary-button text-sm">Voir tout</Link>
            </div>
            <div className="mt-6 space-y-3">
              {recentInventory.length ? recentInventory.map((item) => (
                <HoverCard key={item.stockId}>
                  <div className="interactive-card rounded-[1rem] border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{item.medicineName}</p>
                        <p className="mt-1 text-sm text-slate-600">{item.pharmacyName} · {item.city}</p>
                      </div>
                      <div className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">{item.quantity}</div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.form ? <Chip>{getMedicineFormLabel(item.form)}</Chip> : null}
                      {item.dosage ? <Chip>{item.dosage}</Chip> : null}
                      {item.categorie ? <Chip>{item.categorie}</Chip> : null}
                      {item.price !== null ? <Chip>{formatPrice(item.price)}</Chip> : null}
                    </div>
                  </div>
                </HoverCard>
              )) : <EmptyBlock text="Aucune ligne de stock pour le moment. Ajoute d'abord tes medicaments puis mets a jour l'inventaire." />}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="soft-panel rounded-[1.5rem] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Catalogue recent</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Medicaments les plus recents</h2>
              </div>
              <Link href="/pharmacy/medicines" className="secondary-button text-sm">Ajouter</Link>
            </div>
            <div className="mt-6 space-y-3">
              {recentMedicines.length ? recentMedicines.map((medicine) => (
                <div key={medicine.id} className="rounded-[1rem] border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <MedicineVisual imageUrl={medicine.imageUrl} name={medicine.name} />
                    <div>
                      <p className="font-semibold text-slate-900">{medicine.name}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {medicine.form ? <Chip>{getMedicineFormLabel(medicine.form)}</Chip> : null}
                        {medicine.dosage ? <Chip>{medicine.dosage}</Chip> : null}
                        {medicine.categorie ? <Chip>{medicine.categorie}</Chip> : null}
                        {medicine.price !== null ? <Chip>{formatPrice(medicine.price)}</Chip> : null}
                      </div>
                    </div>
                  </div>
                </div>
              )) : <EmptyBlock text="Le catalogue est vide pour le moment. Commence par ajouter un premier medicament." />}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <Reveal>
          <div className="soft-panel rounded-[1.5rem] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Visibilite publique</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Ce que les utilisateurs peuvent voir</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <InfoCard label="Produits visibles" value={String(data.metrics.visibleMedicinesCount)} helper="Medicaments avec stock positif dans la recherche" />
              <InfoCard label="Unites en stock" value={String(data.metrics.totalUnitsInStock)} helper="Somme de toutes les quantites actuelles" />
              <InfoCard label="Catalogue total" value={String(data.metrics.catalogueCount)} helper="Base globale disponible pour tes ajouts" />
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600">Pour un vrai compteur de recherches par pharmacie, il faudra lier les journaux de recherche aux pharmacies ou aux lignes de stock. Là, on affiche deja une mesure fiable de ta presence publique: ce qui peut vraiment sortir dans les resultats.</p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="soft-panel rounded-[1.5rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Store public</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Les patients peuvent ouvrir ta pharmacie</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">Quand un utilisateur trouve un medicament, il peut maintenant ouvrir la page publique de la pharmacie pour voir le profil, les avis et les medicaments visibles.</p>
            {primaryPharmacy ? (
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`/pharmacies/${primaryPharmacy.id}`} className="primary-button">Ouvrir mon store</Link>
                <Link href="/pharmacy/profile" className="secondary-button">Ameliorer le profil</Link>
              </div>
            ) : (
              <EmptyBlock text="Cree d'abord une pharmacie pour activer le store public." />
            )}
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function StatCard({ label, value, helper, tone }: { label: string; value: string; helper: string; tone: "green" | "amber" | "blue" }) {
  const tones = {
    green: "border-green-100 bg-green-50 text-green-800",
    amber: "border-amber-100 bg-amber-50 text-amber-800",
    blue: "border-blue-100 bg-blue-50 text-blue-800"
  };
  return <div className={`rounded-[1rem] border p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)] ${tones[tone]}`}><p className="text-sm opacity-75">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p><p className="mt-2 text-sm opacity-80">{helper}</p></div>;
}
function PharmacyVisual({ imageUrl, name }: { imageUrl: string | null; name: string }) { if (imageUrl) return <img src={imageUrl} alt={name} className="h-14 w-14 rounded-[0.9rem] object-cover ring-1 ring-slate-200" />; return <div className="flex h-14 w-14 items-center justify-center rounded-[0.9rem] bg-green-50 text-sm font-semibold text-green-700">{name.slice(0, 2).toUpperCase()}</div>; }
function MedicineVisual({ imageUrl, name }: { imageUrl: string | null; name: string }) { if (imageUrl) return <img src={imageUrl} alt={name} className="h-12 w-12 rounded-[0.85rem] object-cover ring-1 ring-slate-200" />; return <div className="flex h-12 w-12 items-center justify-center rounded-[0.85rem] bg-blue-50 text-xs font-semibold text-blue-700">{name.slice(0, 2).toUpperCase()}</div>; }
function Chip({ children }: { children: React.ReactNode }) { return <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">{children}</span>; }
function EmptyBlock({ text }: { text: string }) { return <div className="rounded-[1rem] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-7 text-slate-600">{text}</div>; }
function InfoCard({ label, value, helper }: { label: string; value: string; helper: string }) { return <div className="rounded-[1rem] border border-slate-200 bg-white p-4"><p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p><p className="mt-2 text-sm leading-6 text-slate-600">{helper}</p></div>; }
function formatPrice(price: number) { return `${price.toFixed(2)} DA`; }
