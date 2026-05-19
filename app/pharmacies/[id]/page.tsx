import Link from "next/link";
import { notFound } from "next/navigation";
import { getMedicineFormLabel } from "@/lib/constants/medicines";
import { getPublicPharmacyStoreData } from "@/lib/data/pharmacy";

export default async function PublicPharmacyStorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getPublicPharmacyStoreData(id);

  if (!data) notFound();

  const { pharmacy, medicines } = data;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.06)]">
        <div className="bg-[linear-gradient(135deg,#f0fdf4,#ffffff_55%,#eff6ff)] px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-4">
              <PharmacyVisual imageUrl={pharmacy.imageUrl} name={pharmacy.name} />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-600">Pharmacie</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">{pharmacy.name}</h1>
                <p className="mt-2 text-sm leading-7 text-slate-600">{pharmacy.city}{pharmacy.address ? ` · ${pharmacy.address}` : ""}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>{pharmacy.isOpen ? "Ouverte" : "Fermee"}</Badge>
                  {pharmacy.ratingSummary?.averageRating !== null && pharmacy.ratingSummary?.averageRating !== undefined ? (
                    <Badge>{pharmacy.ratingSummary.averageRating.toFixed(1)} / 5</Badge>
                  ) : null}
                  {pharmacy.ratingSummary ? <Badge>{pharmacy.ratingSummary.reviewCount} avis</Badge> : null}
                </div>
              </div>
            </div>
            <div className="space-y-3 rounded-[1rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Infos rapides</p>
              <p>{pharmacy.isOpen24h ? "Ouverte 24h/24 et 7j/7" : `${pharmacy.openTime ?? "--:--"} - ${pharmacy.closeTime ?? "--:--"}`}</p>
              {pharmacy.openDays ? <p>Jours d'ouverture: {pharmacy.openDays}</p> : null}
              {pharmacy.closedDays ? <p>Jours de fermeture: {pharmacy.closedDays}</p> : null}
              <div className="flex flex-wrap gap-2 pt-1">
                {pharmacy.phone ? <a href={`tel:${pharmacy.phone}`} className="primary-button inline-flex text-sm">Appeler</a> : null}
                {pharmacy.googleMapsLink ? <a href={pharmacy.googleMapsLink} target="_blank" rel="noreferrer" className="secondary-button inline-flex text-sm">Ouvrir Maps</a> : null}
                <Link href="/search" className="secondary-button inline-flex text-sm">Retour recherche</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Medicaments visibles" value={String(medicines.length)} helper="Disponibles dans la recherche" />
        <StatCard label="Unites en stock" value={String(medicines.reduce((sum, item) => sum + item.quantity, 0))} helper="Somme des quantites affichees" />
        <StatCard label="Ordonnance" value={String(medicines.filter((item) => item.requiresPrescription).length)} helper="Produits avec prescription" />
      </section>

      <section className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_12px_34px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Store pharmacie</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Medicaments actuellement visibles</h2>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">{medicines.length} produit(s)</div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {medicines.length ? medicines.map((item) => (
            <article key={item.stockId} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex gap-3">
                <MedicineVisual imageUrl={item.medicineImageUrl} name={item.medicineName} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{item.quantity > 0 ? "Disponible" : "Non disponible"}</Badge>
                    {item.requiresPrescription ? <Badge>Ordonnance</Badge> : null}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">{item.medicineName}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.medicineDescription || "Description non renseignee."}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.form ? <Badge>{getMedicineFormLabel(item.form)}</Badge> : null}
                    {item.dosage ? <Badge>{item.dosage}</Badge> : null}
                    {item.categorie ? <Badge>{item.categorie}</Badge> : null}
                    {item.price !== null ? <Badge>{item.price.toFixed(2)} DA</Badge> : null}
                  </div>
                </div>
              </div>
            </article>
          )) : <EmptyBlock text="Aucun medicament visible pour le moment dans cette pharmacie." />}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return <div className="rounded-[1rem] border border-slate-200 bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p><p className="mt-2 text-sm text-slate-600">{helper}</p></div>;
}
function Badge({ children }: { children: React.ReactNode }) { return <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">{children}</span>; }
function PharmacyVisual({ imageUrl, name }: { imageUrl: string | null; name: string }) { if (imageUrl) return <img src={imageUrl} alt={name} className="h-16 w-16 rounded-[1rem] object-cover ring-1 ring-slate-200" />; return <div className="flex h-16 w-16 items-center justify-center rounded-[1rem] bg-green-50 text-sm font-semibold text-green-700">{name.slice(0, 2).toUpperCase()}</div>; }
function MedicineVisual({ imageUrl, name }: { imageUrl: string | null; name: string }) { if (imageUrl) return <img src={imageUrl} alt={name} className="h-16 w-16 rounded-[1rem] object-cover ring-1 ring-slate-200" />; return <div className="flex h-16 w-16 items-center justify-center rounded-[1rem] bg-blue-50 text-sm font-semibold text-blue-700">{name.slice(0, 2).toUpperCase()}</div>; }
function EmptyBlock({ text }: { text: string }) { return <div className="rounded-[1rem] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-7 text-slate-600 lg:col-span-2">{text}</div>; }
