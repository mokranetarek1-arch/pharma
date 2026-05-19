import { addMedicineAction, updateMedicineAction, updateStockAction } from "@/lib/actions/pharmacy";
import { getMedicineFormLabel, MEDICINE_FORMS } from "@/lib/constants/medicines";
import type { PharmacistDashboardData } from "@/lib/types";
import { HoverCard, Reveal } from "@/components/ui/motion";

const EUR_TO_DZD_RATE = 155.8;
const medicineCategories = [
  "Antalgique",
  "Antibiotique",
  "Anti-inflammatoire",
  "Antipyretique",
  "Antiseptique",
  "Antihistaminique",
  "Antitussif",
  "Vitamine",
  "Complement alimentaire",
  "Dermatologie",
  "Gastro-enterologie",
  "Cardiologie",
  "Diabete",
  "Pediatrie",
  "Gynecologie",
  "Ophtalmologie",
  "ORL",
  "Neurologie"
] as const;

export function PharmacyMedicinesPanel({ data }: { data: PharmacistDashboardData }) {
  const primaryPharmacy = data.pharmacies[0];
  const categories = Array.from(new Set([...medicineCategories, ...data.catalogue.map((medicine) => medicine.categorie).filter(Boolean) as string[]]));

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
        <Reveal>
          <div className="soft-panel rounded-[2rem] border border-slate-200 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Nouveau medicament</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Ajouter au catalogue</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">Cette page est reservee a la creation des medicaments et a la gestion du stock pour eviter de melanger profil et operations.</p>
            <form action={addMedicineAction} className="mt-6 space-y-4">
              <input name="name" required className="field-input w-full" placeholder="Ex: Doliprane" />
              <input type="hidden" name="pharmacy_id" value={primaryPharmacy?.id ?? ""} />
              <div className="grid gap-4 sm:grid-cols-3">
                <input name="price_amount" type="number" min="0" step="0.01" className="field-input w-full" placeholder="Prix" />
                <select name="price_currency" defaultValue="dzd" className="field-input w-full">
                  <option value="dzd">Dinar algerien (DA)</option>
                  <option value="eur">Euro (EUR)</option>
                </select>
                <input name="dosage" className="field-input w-full" placeholder="Ex: 1000 mg" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <select name="form" defaultValue="" className="field-input w-full">
                  <option value="">Choisir la forme</option>
                  {MEDICINE_FORMS.map((form) => (
                    <option key={form.value} value={form.value}>{form.label}</option>
                  ))}
                  <option value="__other">Autre</option>
                </select>
                <input name="form_custom" className="field-input w-full" placeholder="Autre forme personnalisee" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <select name="categorie" defaultValue="" className="field-input w-full">
                  <option value="">Choisir une categorie</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                  <option value="__other">Autre</option>
                </select>
                <input name="categorie_custom" className="field-input w-full" placeholder="Autre categorie personnalisee" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <select name="initial_status" defaultValue="available" className="field-input w-full">
                  <option value="available">Disponibilite: disponible</option>
                  <option value="unavailable">Disponibilite: non disponible</option>
                  <option value="on_request">Disponibilite: sous commande</option>
                </select>
                <input name="initial_quantity" type="number" min="0" className="field-input w-full" placeholder="Quantite initiale (ex: 12)" />
              </div>
              <label className="flex items-center gap-3 rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <input type="checkbox" name="requires_prescription" className="h-4 w-4 accent-amber-600" />
                Ce medicament exige une ordonnance
              </label>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Photo du medicament</p>
                <input type="file" name="image" accept="image/*" className="field-input w-full file:mr-4 file:rounded-full file:border-0 file:bg-amber-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-amber-800" />
              </div>
              <textarea name="description" rows={4} className="field-input w-full min-h-28" placeholder="Informations simples pour le catalogue" />
              <button className="primary-button">Ajouter au catalogue</button>
            </form>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="soft-panel rounded-[2rem] border border-slate-200 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-700">Stock pharmacie</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Mettre a jour l'inventaire</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">Relie un medicament a ta pharmacie avec une quantite precise. La recherche publique affichera seulement les lignes en stock.</p>
            <form action={updateStockAction} className="mt-6 space-y-4">
              <select name="pharmacy_id" required className="field-input w-full">
                <option value="">Choisir une pharmacie</option>
                {data.pharmacies.map((pharmacy) => <option key={pharmacy.id} value={pharmacy.id}>{pharmacy.name} - {pharmacy.city}</option>)}
              </select>
              <select name="medicine_id" required className="field-input w-full">
                <option value="">Choisir un medicament</option>
                {data.catalogue.map((medicine) => <option key={medicine.id} value={medicine.id}>{medicine.name} {medicine.categorie ? `- ${medicine.categorie}` : ""} {medicine.form ? `- ${getMedicineFormLabel(medicine.form)}` : ""} {medicine.requiresPrescription ? "- ordonnance" : ""} {medicine.dosage ? `- ${medicine.dosage}` : ""} {medicine.price !== null ? `- ${formatPrice(medicine.price)}` : ""}</option>)}
              </select>
              <input type="number" min="0" name="quantity" required className="field-input w-full" placeholder="0" />
              <button className="primary-button">Enregistrer le stock</button>
            </form>
          </div>
        </Reveal>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <Reveal>
          <div className="soft-panel rounded-[2rem] border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Inventaire</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">Stock actuel</h2>
              </div>
              <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">{data.inventory.length} ligne(s)</div>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-sm text-slate-500">
                    <th>Medicament</th>
                    <th>Pharmacie</th>
                    <th>Ville</th>
                    <th>Quantite</th>
                    <th>Maj</th>
                  </tr>
                </thead>
                <tbody>
                  {data.inventory.map((item) => (
                    <tr key={item.stockId} className="rounded-2xl bg-slate-50 text-sm text-slate-700">
                      <td className="rounded-l-2xl px-4 py-4">
                        <div className="flex items-center gap-3">
                          <MedicineThumb imageUrl={item.medicineImageUrl} name={item.medicineName} />
                          <div>
                            <p className="font-semibold text-slate-950">{item.medicineName}</p>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {item.form ? <Pill>{getMedicineFormLabel(item.form)}</Pill> : null}
                              {item.categorie ? <Pill tone="cyan">{item.categorie}</Pill> : null}
                              {item.dosage ? <Pill tone="slate">{item.dosage}</Pill> : null}
                              {item.price !== null ? <Pill tone="emerald">{formatPrice(item.price)}</Pill> : null}
                            </div>
                            {item.requiresPrescription ? <p className="mt-2 text-xs font-semibold text-amber-700">Ordonnance requise</p> : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">{item.pharmacyName}</td>
                      <td className="px-4 py-4">{item.city}</td>
                      <td className="px-4 py-4">{item.quantity}</td>
                      <td className="rounded-r-2xl px-4 py-4">{new Date(item.updatedAt).toLocaleDateString("fr-FR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="soft-panel rounded-[2rem] border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Catalogue</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">Medicaments en base</h2>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">{data.catalogue.length} medicament(s)</div>
            </div>
            <div className="mt-6 grid gap-4">
              {data.catalogue.map((medicine) => (
                <HoverCard key={medicine.id}>
                  <div className="interactive-card rounded-[1.7rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <MedicineThumb imageUrl={medicine.imageUrl} name={medicine.name} />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-950">{medicine.name}</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {medicine.form ? <Pill>{getMedicineFormLabel(medicine.form)}</Pill> : null}
                          {medicine.categorie ? <Pill tone="cyan">{medicine.categorie}</Pill> : null}
                          {medicine.dosage ? <Pill tone="slate">{medicine.dosage}</Pill> : null}
                          {medicine.price !== null ? <Pill tone="emerald">{formatPrice(medicine.price)}</Pill> : null}
                        </div>
                        {medicine.description ? <p className="mt-3 text-sm leading-6 text-slate-600">{medicine.description}</p> : null}
                        {medicine.requiresPrescription ? <p className="mt-2 text-xs font-semibold text-amber-700">Ordonnance requise</p> : null}

                        <details className="mt-4 rounded-[1rem] border border-slate-200 bg-white p-4">
                          <summary className="cursor-pointer text-sm font-semibold text-slate-700">Modifier ce medicament</summary>
                          <form action={updateMedicineAction} className="mt-4 space-y-4">
                            <input type="hidden" name="medicine_id" value={medicine.id} />
                            <input name="name" defaultValue={medicine.name} required className="field-input w-full" placeholder="Nom du medicament" />
                            <div className="grid gap-4 sm:grid-cols-3">
                              <input name="price_amount" type="number" min="0" step="0.01" defaultValue={medicine.price ?? ""} className="field-input w-full" placeholder="Prix" />
                              <select name="price_currency" defaultValue="dzd" className="field-input w-full">
                                <option value="dzd">Dinar algerien (DA)</option>
                                <option value="eur">Euro (EUR)</option>
                              </select>
                              <input name="dosage" defaultValue={medicine.dosage ?? ""} className="field-input w-full" placeholder="Dosage" />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <select name="form" defaultValue={medicine.form ?? ""} className="field-input w-full">
                                <option value="">Choisir la forme</option>
                                {MEDICINE_FORMS.map((form) => (
                                  <option key={form.value} value={form.value}>{form.label}</option>
                                ))}
                                <option value="__other">Autre</option>
                              </select>
                              <input name="form_custom" className="field-input w-full" placeholder="Autre forme personnalisee" />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <select name="categorie" defaultValue={medicine.categorie ?? ""} className="field-input w-full">
                                <option value="">Choisir une categorie</option>
                                {categories.map((category) => (
                                  <option key={`${medicine.id}-${category}`} value={category}>{category}</option>
                                ))}
                                <option value="__other">Autre</option>
                              </select>
                              <input name="categorie_custom" className="field-input w-full" placeholder="Autre categorie personnalisee" />
                            </div>
                            <label className="flex items-center gap-3 rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                              <input type="checkbox" name="requires_prescription" defaultChecked={medicine.requiresPrescription} className="h-4 w-4 accent-amber-600" />
                              Ce medicament exige une ordonnance
                            </label>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-slate-700">Photo du medicament</p>
                              <input type="file" name="image" accept="image/*" className="field-input w-full file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700" />
                            </div>
                            <textarea name="description" rows={4} defaultValue={medicine.description ?? ""} className="field-input w-full min-h-28" placeholder="Informations simples pour le catalogue" />
                            <button className="secondary-button">Enregistrer les modifications</button>
                          </form>
                        </details>
                      </div>
                    </div>
                  </div>
                </HoverCard>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function MedicineThumb({ imageUrl, name }: { imageUrl: string | null; name: string }) { if (imageUrl) return <img src={imageUrl} alt={name} className="h-14 w-14 rounded-[1rem] object-cover ring-1 ring-slate-200" />; return <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700">{name.slice(0, 2).toUpperCase()}</div>; }
function Pill({ children, tone = "emerald" }: { children: React.ReactNode; tone?: "emerald" | "cyan" | "slate" }) { const tones = { emerald: "bg-emerald-100 text-emerald-800", cyan: "bg-cyan-100 text-cyan-800", slate: "bg-slate-200 text-slate-700" }; return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>; }
function formatPrice(price: number) {
  const eur = price / EUR_TO_DZD_RATE;
  return `${price.toFixed(2)} DA / ${eur.toFixed(2)} EUR`;
}
