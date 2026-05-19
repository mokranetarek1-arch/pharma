import { addMedicineAction, savePharmacyProfileAction, updateStockAction } from "@/lib/actions/pharmacy";
import { getMedicineFormLabel, MEDICINE_FORMS } from "@/lib/constants/medicines";
import type { PharmacistDashboardData } from "@/lib/types";

export function InventoryPanel({ data }: { data: PharmacistDashboardData }) {
  const primaryPharmacy = data.pharmacies[0];
  const hasPharmacy = Boolean(primaryPharmacy);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Pharmacies gerees" value={String(data.pharmacies.length)} tone="teal" />
        <StatCard label="Medicaments en stock" value={String(data.inventory.length)} tone="amber" />
        <StatCard label="Catalogue disponible" value={String(data.catalogue.length)} tone="slate" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-emerald-100 bg-white/95 p-6 shadow-[0_20px_70px_rgba(15,118,110,0.08)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Profil pharmacie</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Nom, contact, photo et localisation</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{hasPharmacy ? "Mets a jour les informations publiques de ta pharmacie." : "Commence par enregistrer ta pharmacie pour pouvoir gerer le stock."}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right text-sm text-emerald-800">
              <p className="font-semibold">{hasPharmacy ? primaryPharmacy.name : "Aucune pharmacie"}</p>
              <div className="mt-1 flex items-center justify-end gap-2"><AvailabilityBadge isOpen={primaryPharmacy?.isOpen ?? false} /></div>
            </div>
          </div>

          <form action={savePharmacyProfileAction} className="mt-6 grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="pharmacy_id" value={primaryPharmacy?.id ?? ""} />
            <div className="sm:col-span-2 flex items-center gap-4 rounded-[1.6rem] border border-emerald-100 bg-emerald-50/60 p-4">
              <PharmacyAvatar imageUrl={primaryPharmacy?.imageUrl ?? null} name={primaryPharmacy?.name ?? "Pharmacie"} />
              <div>
                <p className="text-sm font-semibold text-emerald-900">Photo de profil pharmacie</p>
                <p className="mt-1 text-sm text-emerald-800/80">Ajoute un visuel simple pour rendre ta pharmacie plus reconnaissable dans l'interface.</p>
              </div>
            </div>
            <Field label="Nom de la pharmacie"><input name="name" required defaultValue={primaryPharmacy?.name ?? ""} className="field-input" placeholder="Ex: Pharmacie Centrale" /></Field>
            <Field label="Ville"><input name="city" required defaultValue={primaryPharmacy?.city ?? ""} className="field-input" placeholder="Ex: Alger" /></Field>
            <Field label="Telephone"><input name="phone" defaultValue={primaryPharmacy?.phone ?? ""} className="field-input" placeholder="Ex: 0555000000" /></Field>
            <Field label="Lien Google Maps"><input name="google_maps_link" defaultValue={primaryPharmacy?.googleMapsLink ?? ""} className="field-input" placeholder="https://maps.google.com/..." /></Field>
            <Field label="Disponibilite actuelle"><select name="is_open" defaultValue={primaryPharmacy?.isOpen ? "open" : "closed"} className="field-input"><option value="open">Ouverte</option><option value="closed">Fermee</option></select></Field>
            <Field label="Photo pharmacie"><input type="file" name="image" accept="image/*" className="field-input file:mr-4 file:rounded-full file:border-0 file:bg-emerald-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-800" /></Field>
            <Field label="Adresse" full><textarea name="address" rows={3} defaultValue={primaryPharmacy?.address ?? ""} className="field-input min-h-24" placeholder="Rue, quartier, point de repere" /></Field>
            <Field label="Latitude"><input name="latitude" defaultValue={primaryPharmacy?.latitude ?? ""} className="field-input" placeholder="36.7538" /></Field>
            <Field label="Longitude"><input name="longitude" defaultValue={primaryPharmacy?.longitude ?? ""} className="field-input" placeholder="3.0588" /></Field>
            <div className="sm:col-span-2 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600"><p>Ces informations seront affichees aux doctors et aux patients pendant la recherche.</p><button className="rounded-full bg-emerald-700 px-5 py-3 font-semibold text-white">{hasPharmacy ? "Mettre a jour" : "Creer la pharmacie"}</button></div>
          </form>
        </div>

        <div className="rounded-[2rem] border border-amber-100 bg-white/95 p-6 shadow-[0_20px_70px_rgba(217,119,6,0.08)]">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Nouveau medicament</p>
          <h2 className="mt-3 text-2xl font-semibold">Ajouter au catalogue</h2>
          <form action={addMedicineAction} className="mt-6 space-y-4">
            <input name="name" required className="field-input w-full" placeholder="Ex: Doliprane" />
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="price" type="number" min="0" step="0.01" className="field-input w-full" placeholder="Prix (ex: 450)" />
              <input name="dosage" className="field-input w-full" placeholder="Ex: 1000 mg" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <select name="form" defaultValue="" className="field-input w-full">
                <option value="">Choisir la forme</option>
                {MEDICINE_FORMS.map((form) => (
                  <option key={form.value} value={form.value}>{form.label}</option>
                ))}
              </select>
            </div>
            <input name="categorie" className="field-input w-full" placeholder="Categorie (ex: analgesique, antibiotique)" />
            <label className="flex items-center gap-3 rounded-[1rem] border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm text-amber-900"><input type="checkbox" name="requires_prescription" className="h-4 w-4" />Ce medicament exige une ordonnance</label>
            <input type="file" name="image" accept="image/*" className="field-input w-full file:mr-4 file:rounded-full file:border-0 file:bg-amber-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-amber-800" />
            <textarea name="description" rows={4} className="field-input w-full min-h-28" placeholder="Informations simples pour le catalogue" />
            <button className="rounded-full bg-amber-600 px-5 py-3 font-semibold text-white">Ajouter au catalogue</button>
          </form>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[2rem] border border-[var(--border)] bg-white/95 p-6 shadow-[0_20px_70px_rgba(18,32,24,0.06)]">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Stock pharmacie</p>
          <h2 className="mt-3 text-2xl font-semibold">Mettre a jour l'inventaire</h2>
          <p className="mt-2 text-sm text-slate-600">Choisis la pharmacie et la quantite disponible pour chaque medicament.</p>
          <form action={updateStockAction} className="mt-6 space-y-4">
            <select name="pharmacy_id" required className="field-input w-full"><option value="">Choisir une pharmacie</option>{data.pharmacies.map((pharmacy) => <option key={pharmacy.id} value={pharmacy.id}>{pharmacy.name} - {pharmacy.city}</option>)}</select>
            <select name="medicine_id" required className="field-input w-full"><option value="">Choisir un medicament</option>{data.catalogue.map((medicine) => <option key={medicine.id} value={medicine.id}>{medicine.name} {medicine.categorie ? `- ${medicine.categorie}` : ""} {medicine.form ? `- ${getMedicineFormLabel(medicine.form)}` : ""} {medicine.requiresPrescription ? "- ordonnance" : ""} {medicine.dosage ? `- ${medicine.dosage}` : ""} {medicine.price !== null ? `- ${formatPrice(medicine.price)}` : ""}</option>)}</select>
            <input type="number" min="0" name="quantity" required className="field-input w-full" placeholder="0" />
            <button className="rounded-full bg-slate-950 px-5 py-3 font-semibold text-white">Enregistrer le stock</button>
          </form>
        </div>

        <div className="rounded-[2rem] border border-[var(--border)] bg-white/95 p-6 shadow-[0_20px_70px_rgba(18,32,24,0.06)]">
          <div className="flex items-start justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.3em] text-slate-500">Inventaire</p><h2 className="mt-3 text-2xl font-semibold">Stock actuel</h2></div><div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">{data.inventory.length} ligne(s)</div></div>
          <div className="mt-6 overflow-x-auto"><table className="min-w-full border-separate border-spacing-y-3"><thead><tr className="text-left text-sm text-slate-500"><th>Medicament</th><th>Pharmacie</th><th>Ville</th><th>Quantite</th><th>Maj</th></tr></thead><tbody>{data.inventory.map((item) => (<tr key={item.stockId} className="rounded-2xl bg-slate-50 text-sm text-slate-700"><td className="rounded-l-2xl px-4 py-4"><div className="flex items-center gap-3"><MedicineThumb imageUrl={item.medicineImageUrl} name={item.medicineName} /><div><p className="font-semibold text-slate-900">{item.medicineName}</p><div className="mt-1 flex flex-wrap gap-2">{item.form ? <Pill>{getMedicineFormLabel(item.form)}</Pill> : null}{item.categorie ? <Pill tone="cyan">{item.categorie}</Pill> : null}{item.dosage ? <Pill tone="slate">{item.dosage}</Pill> : null}{item.price !== null ? <Pill>{formatPrice(item.price)}</Pill> : null}</div>{item.requiresPrescription ? <p className="mt-2 text-xs font-semibold text-amber-700">Ordonnance requise</p> : null}</div></div></td><td className="px-4 py-4">{item.pharmacyName}</td><td className="px-4 py-4">{item.city}</td><td className="px-4 py-4">{item.quantity}</td><td className="rounded-r-2xl px-4 py-4">{new Date(item.updatedAt).toLocaleDateString("fr-FR")}</td></tr>))}</tbody></table></div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/60 bg-white/95 p-6 shadow-[0_20px_70px_rgba(18,32,24,0.06)]">
        <div className="flex items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.3em] text-slate-500">Catalogue</p><h2 className="mt-3 text-2xl font-semibold">Medicaments en base</h2></div><div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">{data.catalogue.length} medicament(s)</div></div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.catalogue.map((medicine) => (
            <div key={medicine.id} className="rounded-[1.7rem] border border-slate-100 bg-slate-50/90 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start gap-3">
                <MedicineThumb imageUrl={medicine.imageUrl} name={medicine.name} />
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900">{medicine.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">{medicine.form ? <Pill>{getMedicineFormLabel(medicine.form)}</Pill> : null}{medicine.categorie ? <Pill tone="cyan">{medicine.categorie}</Pill> : null}{medicine.dosage ? <Pill tone="slate">{medicine.dosage}</Pill> : null}{medicine.price !== null ? <Pill>{formatPrice(medicine.price)}</Pill> : null}</div>
                  {medicine.description ? <p className="mt-3 text-sm leading-6 text-slate-600">{medicine.description}</p> : null}
                  {medicine.requiresPrescription ? <p className="mt-2 text-xs font-semibold text-amber-700">Ordonnance requise</p> : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: "teal" | "amber" | "slate" }) {
  const tones = { teal: "border-emerald-100 bg-emerald-50/70 text-emerald-900", amber: "border-amber-100 bg-amber-50/70 text-amber-900", slate: "border-slate-200 bg-slate-50 text-slate-900" };
  return <div className={`rounded-[1.5rem] border p-5 ${tones[tone]}`}><p className="text-sm opacity-70">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>;
}
function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) { return <label className={full ? "sm:col-span-2 block" : "block"}><span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>{children}</label>; }
function PharmacyAvatar({ imageUrl, name }: { imageUrl: string | null; name: string }) { if (imageUrl) return <img src={imageUrl} alt={name} className="h-[4.5rem] w-[4.5rem] rounded-[1.4rem] object-cover" />; return <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.4rem] bg-emerald-100 text-lg font-semibold text-emerald-800">{name.slice(0, 2).toUpperCase()}</div>; }
function MedicineThumb({ imageUrl, name }: { imageUrl: string | null; name: string }) { if (imageUrl) return <img src={imageUrl} alt={name} className="h-14 w-14 rounded-[1rem] object-cover" />; return <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-slate-200 text-xs font-semibold text-slate-700">{name.slice(0, 2).toUpperCase()}</div>; }
function AvailabilityBadge({ isOpen }: { isOpen: boolean }) { return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isOpen ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>{isOpen ? "Ouverte" : "Fermee"}</span>; }
function Pill({ children, tone = "emerald" }: { children: React.ReactNode; tone?: "emerald" | "cyan" | "slate" }) { const tones = { emerald: "bg-emerald-100 text-emerald-800", cyan: "bg-cyan-100 text-cyan-800", slate: "bg-slate-200 text-slate-700" }; return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>; }
function formatPrice(price: number) { return `${price.toFixed(2)} DA`; }
