﻿"use client";

import React from "react";
import Link from "next/link";
import { savePharmacyProfileAction, deleteMedicineAction } from "@/lib/actions/pharmacy";
import { algeriaWilayas, weekDays } from "@/lib/constants/doctor-profile";
import { getMedicineFormLabel } from "@/lib/constants/medicines";
import { getDoctorAvailability } from "@/lib/doctor-availability";
import type { PharmacistDashboardData } from "@/lib/types";
import { Reveal } from "@/components/ui/motion";

export function PharmacyProfilePanel({ data }: { data: PharmacistDashboardData }) {
  const primaryPharmacy = data.pharmacies[0];
  const hasPharmacy = Boolean(primaryPharmacy);
  const recentMedicines = data.catalogue.slice(0, 3);
  const [isOpen24h, setIsOpen24h] = React.useState(Boolean(primaryPharmacy?.isOpen24h));
  const [openDayValues, setOpenDayValues] = React.useState<string[]>(parseDayValues(primaryPharmacy?.openDays));
  const [closedDayValues, setClosedDayValues] = React.useState<string[]>(parseDayValues(primaryPharmacy?.closedDays));
  const availability = getDoctorAvailability({
    isOpen24h,
    openTime: primaryPharmacy?.openTime,
    closeTime: primaryPharmacy?.closeTime
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
      <Reveal>
        <div className="soft-panel rounded-[2rem] border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-400 font-extrabold drop-shadow-sm">Profil pharmacie</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">Nom, contact, localisation et disponibilité</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">Cette page regroupe l'identité publique de la pharmacie, mais tu peux aussi partir directement vers la gestion des médicaments depuis le panneau à droite.</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-right text-sm font-semibold text-slate-900">
              <p>{hasPharmacy ? primaryPharmacy.name : "Aucune pharmacie"}</p>
              <p className="mt-1">{primaryPharmacy?.city || "Ville"}</p>
              {primaryPharmacy?.ratingSummary ? (
                <>
                  <p className="mt-2 text-sm text-slate-600">Note globale: {primaryPharmacy.ratingSummary.averageRating?.toFixed(1) ?? "0.0"} / 5</p>
                  <p className="mt-1 text-sm text-slate-600">Avis patients: {primaryPharmacy.ratingSummary.reviewCount}</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-slate-600">Aucun avis patient pour le moment</p>
              )}
            </div>
          </div>

          <form id="pharmacy-profile-form" action={savePharmacyProfileAction} className="mt-6 grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="pharmacy_id" value={primaryPharmacy?.id ?? ""} />
            <div className="sm:col-span-2 flex items-center gap-4 rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4">
              <PharmacyAvatar imageUrl={primaryPharmacy?.imageUrl ?? null} name={primaryPharmacy?.name ?? "Pharmacie"} />
              <div>
                <p className="text-sm font-semibold text-slate-900">Photo de profil pharmacie</p>
                <p className="mt-1 text-sm text-slate-600">Ajoute un visuel simple pour rendre ta pharmacie plus reconnaissable pendant la recherche.</p>
              </div>
            </div>
            <Field label="Nom de la pharmacie"><input name="name" required defaultValue={primaryPharmacy?.name ?? ""} className="field-input" placeholder="Ex: Pharmacie Centrale" /></Field>
            <Field label="Wilaya">
              <input name="city" required defaultValue={primaryPharmacy?.city ?? ""} list="algeria-wilayas-pharmacy" className="field-input" placeholder="Choisir une wilaya" />
              <datalist id="algeria-wilayas-pharmacy">
                {algeriaWilayas.map((wilaya) => (
                  <option key={wilaya} value={wilaya} />
                ))}
              </datalist>
            </Field>
            <Field label="Telephone"><input name="phone" defaultValue={primaryPharmacy?.phone ?? ""} className="field-input" placeholder="Ex: 0555000000" /></Field>
            <Field label="Lien Google Maps"><input name="google_maps_link" defaultValue={primaryPharmacy?.googleMapsLink ?? ""} className="field-input" placeholder="https://maps.google.com/..." /></Field>
            <Field label="Photo pharmacie"><input type="file" name="image" accept="image/*" className="field-input file:mr-4 file:rounded-full file:border-0 file:bg-emerald-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-800" /></Field>
            <Field label="Adresse" full><textarea name="address" rows={3} defaultValue={primaryPharmacy?.address ?? ""} className="field-input min-h-24" placeholder="Rue, quartier, point de repere" /></Field>
            <div className="sm:col-span-2 flex items-center justify-between gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600"><p>Ces informations seront affichees aux patients et aux doctors pendant la recherche.</p><button className="primary-button">{hasPharmacy ? "Mettre a jour" : "Creer la pharmacie"}</button></div>
          </form>

          <div className="mt-6 rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-600">Horaires</p>
            <div className="mt-4 rounded-[1.25rem] border border-emerald-100 bg-white p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <ClockBadge isOpen={availability.isOpen} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{availability.label}</p>
                    <p className="mt-1 text-sm text-slate-600">{availability.scheduleLabel}</p>
                  </div>
                </div>
                <label className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                  <input type="hidden" name="is_open_24_7" value="false" form="pharmacy-profile-form" />
                  <input name="is_open_24_7" type="checkbox" value="true" checked={isOpen24h} onChange={(event) => setIsOpen24h(event.target.checked)} className="h-4 w-4 accent-emerald-600" form="pharmacy-profile-form" />
                  24/7
                </label>
              </div>
            </div>
            {isOpen24h ? (
              <p className="mt-4 rounded-[1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">La pharmacie sera affichee comme ouverte 24h/24 et 7j/7.</p>
            ) : (
              <>
                <div className="hidden">
                  <input type="hidden" name="open_days" value={formatDayValues(openDayValues)} form="pharmacy-profile-form" />
                  <input type="hidden" name="closed_days" value={formatDayValues(closedDayValues)} form="pharmacy-profile-form" />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Jours d'ouverture">
                    <DaySelector
                      mode="open"
                      selectedDays={openDayValues}
                      onToggle={(day) => {
                        setOpenDayValues((current) => toggleDayValue(current, day));
                        setClosedDayValues((current) => current.filter((item) => item !== day));
                      }}
                    />
                  </Field>
                  <Field label="Jours de fermeture">
                    <DaySelector
                      mode="closed"
                      selectedDays={closedDayValues}
                      onToggle={(day) => {
                        setClosedDayValues((current) => toggleDayValue(current, day));
                        setOpenDayValues((current) => current.filter((item) => item !== day));
                      }}
                    />
                  </Field>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Heure d'ouverture">
                    <input name="open_time" type="time" defaultValue={primaryPharmacy?.openTime ?? ""} className="field-input" form="pharmacy-profile-form" />
                  </Field>
                  <Field label="Heure de fermeture">
                    <input name="close_time" type="time" defaultValue={primaryPharmacy?.closeTime ?? ""} className="field-input" form="pharmacy-profile-form" />
                  </Field>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">La disponibilite est calculee automatiquement selon l'heure actuelle, les horaires saisis et le mode 24/7.</p>
              </>
            )}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="space-y-6">
          <div className="soft-panel rounded-[2rem] border border-slate-200 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-400 font-extrabold drop-shadow-sm">Medicaments</p>
            <h3 className="mt-3 text-2xl font-bold text-slate-950">Ajouter un medicament</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">L'ajout de medicaments et la mise a jour du stock se font dans une page dediee pour rester bien organises.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/pharmacy/medicines" className="primary-button">Aller vers les medicaments</Link>
              <Link href="/pharmacy/dashboard" className="secondary-button">Retour vue d'ensemble</Link>
            </div>
          </div>

          <div className="soft-panel rounded-[2rem] border border-slate-200 bg-white p-6">
            <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-slate-700">Conseils</p>
            <div className="mt-4 space-y-4">
              <AdviceCard title="Nom visible" text="Choisis le nom exact que les patients connaissent deja pour etre trouve plus vite." />
              <AdviceCard title="Disponibilite claire" text="Le statut ouverte ou fermee aide a eviter des deplacements inutiles et augmente la confiance." />
              <AdviceCard title="Maps + telephone" text="Ces deux champs rendent la carte resultat beaucoup plus utile et plus proche d'une vraie experience Booking." />
            </div>
          </div>

          <div className="soft-panel rounded-[2rem] border border-slate-200 bg-white p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-400 font-bold">Apercu de fiche</p>
            <div className="mt-4 flex items-center gap-3">
              <PharmacyAvatar imageUrl={primaryPharmacy?.imageUrl ?? null} name={primaryPharmacy?.name ?? "Pharmacie"} />
              <div>
                <p className="text-lg font-bold text-slate-950">{primaryPharmacy?.name || "Nom pharmacie"}</p>
                <p className="mt-1 text-sm font-medium text-slate-600">{primaryPharmacy?.city || "Ville"}</p>
                {primaryPharmacy?.ratingSummary ? (
                  <p className="mt-2 text-sm font-medium text-slate-600">{primaryPharmacy.ratingSummary.averageRating?.toFixed(1)} ★ · {primaryPharmacy.ratingSummary.reviewCount} avis</p>
                ) : (
                  <p className="mt-2 text-sm font-medium text-slate-600">Aucun avis pour l'instant</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Tag>{primaryPharmacy?.isOpen ? "Ouverte" : "Fermee"}</Tag>
              {primaryPharmacy?.ratingSummary ? <Tag>{`Note ${primaryPharmacy.ratingSummary.averageRating?.toFixed(1) ?? "0.0"} / 5`}</Tag> : null}
              {primaryPharmacy?.ratingSummary ? <Tag>{`${primaryPharmacy.ratingSummary.reviewCount} avis`}</Tag> : null}
              {primaryPharmacy?.phone ? <Tag>{primaryPharmacy.phone}</Tag> : null}
              {primaryPharmacy?.googleMapsLink ? <Tag>Google Maps</Tag> : null}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Medicaments recents</p>
              <div className="mt-4 space-y-3">
                {recentMedicines.length ? recentMedicines.map((medicine) => (
                  <div key={medicine.id} className="flex items-center justify-between rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                    <div>
                      <p className="font-semibold text-slate-950">{medicine.name}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {medicine.form ? <Tag>{getMedicineFormLabel(medicine.form)}</Tag> : null}
                        {medicine.dosage ? <Tag>{medicine.dosage}</Tag> : null}
                        {medicine.categorie ? <Tag>{medicine.categorie}</Tag> : null}
                        {medicine.price !== null ? <Tag>{formatPrice(medicine.price)}</Tag> : null}
                      </div>
                    </div>
                    <form action={deleteMedicineAction}>
                      <input type="hidden" name="pharmacy_id" value={primaryPharmacy?.id ?? ""} />
                      <input type="hidden" name="medicine_id" value={medicine.id} />
                      <button className="rounded-xl bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition-colors">
                        <span className="text-xs font-bold">Supprimer</span>
                      </button>
                    </form>
                  </div>
            )) : <div className="rounded-[1.4rem] border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-600">Aucun medicament encore. Clique sur `Aller vers les medicaments` pour commencer.</div>}
              </div>
            </div>

          </div>
        </div>
      </Reveal>
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) { return <label className={full ? "sm:col-span-2 block" : "block"}><span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>{children}</label>; }
function PharmacyAvatar({ imageUrl, name }: { imageUrl: string | null; name: string }) { if (imageUrl) return <img src={imageUrl} alt={name} className="h-[4.8rem] w-[4.8rem] rounded-[1.4rem] object-cover ring-1 ring-slate-200" />; return <div className="flex h-[4.8rem] w-[4.8rem] items-center justify-center rounded-[1.4rem] border border-slate-200 bg-slate-100 text-lg font-semibold text-slate-900">{name.slice(0, 2).toUpperCase()}</div>; }
function AdviceCard({ title, text }: { title: string; text: string }) { return <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm"><p className="text-base font-bold text-slate-950">{title}</p><p className="mt-2 text-sm leading-7 text-slate-600">{text}</p></div>; }
function Tag({ children }: { children: React.ReactNode }) { return <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">{children}</span>; }
function DaySelector({ mode, selectedDays, onToggle }: { mode: "open" | "closed"; selectedDays: string[]; onToggle: (day: string) => void }) {
  const activeClasses = mode === "open"
    ? "border-emerald-300 bg-emerald-100 text-emerald-900"
    : "border-amber-300 bg-amber-100 text-amber-900";

  return (
    <div className="rounded-[1rem] border border-slate-200 bg-white p-3">
      <div className="flex flex-wrap gap-2">
        {weekDays.map((day) => {
          const active = selectedDays.includes(day);

          return (
            <button
              key={day}
              type="button"
              onClick={() => onToggle(day)}
              className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${active ? activeClasses : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
            >
              {day}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        {selectedDays.length ? selectedDays.join(", ") : "Aucun jour selectionne"}
      </p>
    </div>
  );
}
function ClockBadge({ isOpen }: { isOpen: boolean }) {
  return (
    <div className={`relative flex h-16 w-16 items-center justify-center rounded-full border shadow-sm ${isOpen ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
      <div className="absolute h-1.5 w-1.5 rounded-full bg-slate-800" />
      <div className="absolute h-5 w-0.5 -translate-y-1 rounded-full bg-slate-800" />
      <div className="absolute h-4 w-0.5 translate-x-2 rotate-90 rounded-full bg-slate-800" />
      <div className={`absolute inset-1 rounded-full border ${isOpen ? "border-emerald-100" : "border-amber-100"}`} />
    </div>
  );
}
function parseDayValues(value: string | null | undefined) {
  if (!value) return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}
function toggleDayValue(values: string[], day: string) {
  return values.includes(day) ? values.filter((item) => item !== day) : [...values, day];
}
function formatDayValues(values: string[]) {
  return values.join(", ");
}
function formatPrice(price: number) {
  return `${price.toFixed(2)} DA`;
}
