"use client";

import Link from "next/link";
import { useState } from "react";
import { saveDoctorProfileAction } from "@/lib/actions/doctor";
import { DashboardShortcutCard } from "@/components/layout/dashboard-shortcut-card";
import { algeriaWilayas, communesByWilaya, doctorAvatarIcons, weekDays } from "@/lib/constants/doctor-profile";
import { getDoctorAvailability } from "@/lib/doctor-availability";
import type { DoctorProfileData } from "@/lib/types";
import { Reveal, Pressable } from "@/components/ui/motion";

const specialityOptions = [
  "Cardiologie",
  "Pediatrie",
  "Dermatologie",
  "Gynecologie",
  "Orthopedie",
  "Psychiatrie",
  "Neurologie",
  "Medecine generale",
  "Oto-rhino-laryngologie",
  "Ophtalmologie"
];

export function DoctorProfilePanel({ data, saved = false }: { data: DoctorProfileData; saved?: boolean }) {
  const [isOpen24h, setIsOpen24h] = useState(data.isOpen24h);
  const [openDayValues, setOpenDayValues] = useState<string[]>(parseDayValues(data.openDays));
  const [closedDayValues, setClosedDayValues] = useState<string[]>(parseDayValues(data.closedDays));
  const [selectedWilaya, setSelectedWilaya] = useState(data.city ?? "");
  const [visualMode, setVisualMode] = useState<"photo" | "icon">(data.visualMode ?? "photo");
  const [selectedIcon, setSelectedIcon] = useState(data.avatarIcon ?? "stethoscope");
  const availability = getDoctorAvailability({
    isOpen24h,
    openTime: data.openTime,
    closeTime: data.closeTime
  });
  const availableCommunes = communesByWilaya[selectedWilaya] ?? [];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
      <Reveal>
        <div className="soft-panel rounded-[1.5rem] p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-600">Profil medecin</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Identite, consultation, localisation et horaires</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">Renseigne un profil plus propre et plus rassurant pour les patients: nom, sexe, wilaya, commune, adresse precise, lien de localisation et mode d'affichage.</p>
              {saved ? <p className="mt-4 rounded-[1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">Profil enregistre avec succes.</p> : null}
            </div>
            <div className="rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-right text-sm text-slate-600">
              <p className="font-semibold text-slate-900">{formatDoctorDisplayName(data.fullName)}</p>
              <p className="mt-1">{data.speciality || "Specialite"}</p>
              {data.ratingSummary ? (
                <p className="mt-1 text-sm text-slate-500">{data.ratingSummary.averageRating?.toFixed(1)} ★ · {data.ratingSummary.reviewCount} avis</p>
              ) : (
                <p className="mt-1 text-sm text-slate-500">Aucun avis encore</p>
              )}
              <p className="mt-1">{getGenderLabel(data.gender)}</p>
            </div>
          </div>

          <form action={saveDoctorProfileAction} className="mt-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom du medecin">
                <input name="full_name" required defaultValue={stripDoctorPrefix(data.fullName)} className="field-input" placeholder="Ex: Mohamed Benali" />
              </Field>
              <Field label="Sexe">
                <select name="gender" defaultValue={data.gender ?? ""} className="field-input" required>
                  <option value="" disabled>Choisir</option>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                </select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Specialite">
                <input name="speciality" defaultValue={data.speciality ?? ""} list="speciality-options" className="field-input" placeholder="Ex: Cardiologie" />
                <datalist id="speciality-options">
                  {specialityOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </Field>
              <Field label="Experience (annees)">
                <input name="experience_years" type="number" min="0" defaultValue={data.experienceYears ?? ""} className="field-input" placeholder="Ex: 8" />
              </Field>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-600">Apparence du profil</p>
              <input type="hidden" name="current_photo_url" value={data.photoUrl ?? ""} />
              <input type="hidden" name="visual_mode" value={visualMode} />
              <div className="mt-4 flex items-center gap-4 rounded-[1.25rem] border border-slate-200 bg-white p-4">
                <DoctorAvatar name={data.fullName} photoUrl={data.photoUrl} visualMode={visualMode} avatarIcon={selectedIcon} />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Photo ou icone medicale</p>
                  <p className="mt-1 text-sm text-slate-600">Tu peux afficher soit une vraie photo, soit une icone medicale si tu preferes un rendu plus neutre.</p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1rem] border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">Mode visuel</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button type="button" onClick={() => setVisualMode("photo")} className={`rounded-full border px-4 py-2 text-sm font-semibold ${visualMode === "photo" ? "border-emerald-300 bg-emerald-100 text-emerald-900" : "border-slate-200 bg-white text-slate-700"}`}>
                      Photo
                    </button>
                    <button type="button" onClick={() => setVisualMode("icon")} className={`rounded-full border px-4 py-2 text-sm font-semibold ${visualMode === "icon" ? "border-emerald-300 bg-emerald-100 text-emerald-900" : "border-slate-200 bg-white text-slate-700"}`}>
                      Icone medicale
                    </button>
                  </div>
                </div>

                <Field label="Icone medicale">
                  <select name="avatar_icon" value={selectedIcon} onChange={(event) => setSelectedIcon(event.target.value)} className="field-input" disabled={visualMode !== "icon"}>
                    {doctorAvatarIcons.map((icon) => (
                      <option key={icon.value} value={icon.value}>{icon.label}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Photo du medecin" full>
                <input type="file" name="image" accept="image/*" className="field-input file:mr-4 file:rounded-full file:border-0 file:bg-emerald-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-800" disabled={visualMode !== "photo"} />
              </Field>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-600">Coordonnees de consultation</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Numero de telephone">
                  <input name="phone" defaultValue={data.phone ?? ""} className="field-input" placeholder="Ex: 0555000000" />
                </Field>
                <Field label="Wilaya">
                  <input
                    name="city"
                    defaultValue={data.city ?? ""}
                    list="algeria-wilayas"
                    className="field-input"
                    placeholder="Choisir une wilaya"
                    onChange={(event) => setSelectedWilaya(event.target.value)}
                  />
                  <datalist id="algeria-wilayas">
                    {algeriaWilayas.map((wilaya) => (
                      <option key={wilaya} value={wilaya} />
                    ))}
                  </datalist>
                </Field>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Commune">
                  <input
                    name="commune"
                    defaultValue={data.commune ?? ""}
                    list="algeria-communes"
                    className="field-input"
                    placeholder={availableCommunes.length ? "Choisir une commune" : "Saisir la commune"}
                  />
                  <datalist id="algeria-communes">
                    {availableCommunes.map((commune) => (
                      <option key={commune} value={commune} />
                    ))}
                  </datalist>
                </Field>
                <Field label="Lien de localisation">
                  <input name="google_maps_link" defaultValue={data.googleMapsLink ?? ""} className="field-input" placeholder="Lien Google Maps ou lien de localisation" />
                </Field>
              </div>

              <Field label="Adresse / point de repere" full>
                <textarea name="address" rows={4} defaultValue={data.address ?? ""} className="field-input min-h-28" placeholder="Cabinet, quartier, adresse ou point de repere" />
              </Field>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-600">Parcours professionnel</p>
              <Field label="Presentation professionnelle" full>
                <textarea name="professional_background" rows={5} defaultValue={data.professionalBackground ?? ""} className="field-input mt-4 min-h-32" placeholder="Diplomes, hopitaux, cabinets, specialisations et parcours du medecin..." />
              </Field>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
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
                    <input type="hidden" name="is_open_24_7" value="false" />
                    <input name="is_open_24_7" type="checkbox" value="true" checked={isOpen24h} onChange={(event) => setIsOpen24h(event.target.checked)} className="h-4 w-4 accent-emerald-600" />
                    24/7
                  </label>
                </div>
              </div>
              {isOpen24h ? (
                <p className="mt-4 rounded-[1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Le cabinet sera affiche comme ouvert 24h/24 et 7j/7.</p>
              ) : (
                <>
                  <input type="hidden" name="open_days" value={formatDayValues(openDayValues)} />
                  <input type="hidden" name="closed_days" value={formatDayValues(closedDayValues)} />
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
                      <input name="open_time" type="time" defaultValue={data.openTime ?? ""} className="field-input" />
                    </Field>
                    <Field label="Heure de fermeture">
                      <input name="close_time" type="time" defaultValue={data.closeTime ?? ""} className="field-input" />
                    </Field>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">La disponibilite est calculee automatiquement selon l'heure actuelle, les horaires saisis et le mode 24/7.</p>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/doctor/search" className="secondary-button">Recherche medecin</Link>
              <Link href="/search" className="secondary-button">Recherche generale</Link>
              <Link href="/" className="secondary-button">Accueil</Link>
            </div>

            <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-emerald-900">
              <p className="font-semibold">Conseil :</p>
              <p className="mt-2">Le profil affichera toujours le prefixe Dr automatiquement, meme si tu saisis juste le nom du medecin.</p>
            </div>

            <div className="grid gap-3">
              <button type="submit" className="primary-button py-3 text-base font-semibold">Enregistrer le profil</button>
            </div>
          </form>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="space-y-6">
          <div className="soft-panel rounded-[1.5rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-600">Raccourcis rapides</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DashboardShortcutCard href="/doctor/profile" title="Profil medecin" text="Modifier ton identite, ta localisation et tes horaires." cta="Ouvrir le profil" tone="amber" />
              <DashboardShortcutCard href="/doctor/search" title="Recherche medecin" text="Voir comment ta fiche apparait dans la recherche." cta="Voir la recherche" tone="blue" />
              <DashboardShortcutCard href="/search" title="Recherche generale" text="Parcourir toute la plateforme depuis la recherche publique." cta="Parcourir la plateforme" tone="emerald" />
            </div>
          </div>

          <div className="soft-panel rounded-[1.5rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Apercu medecin</p>
            <div className="mt-4 rounded-[1rem] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <DoctorAvatar name={data.fullName} photoUrl={data.photoUrl} visualMode={visualMode} avatarIcon={selectedIcon} />
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-slate-900">{formatDoctorDisplayName(data.fullName)}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {data.speciality ? <Tag>{data.speciality}</Tag> : <Tag>Specialite</Tag>}
                      <StatusTag isOpen={availability.isOpen} label={availability.label} />
                      {data.gender ? <Tag>{getGenderLabel(data.gender)}</Tag> : null}
                      {selectedWilaya ? <Tag>{selectedWilaya}</Tag> : null}
                      {data.commune ? <Tag>{data.commune}</Tag> : null}
                      {data.experienceYears !== null ? <Tag>{`${data.experienceYears} ans d'experience`}</Tag> : null}
                    </div>
                  </div>
                </div>
                <ClockBadge isOpen={availability.isOpen} />
              </div>
              {data.phone ? <p className="mt-4 text-sm text-slate-600">Telephone: {data.phone}</p> : null}
              {data.address ? <p className="mt-2 text-sm leading-7 text-slate-600">{data.address}</p> : null}
              {data.googleMapsLink ? <p className="mt-2 text-sm text-blue-700">Lien localisation ajoute</p> : null}
              {data.openDays ? <p className="mt-2 text-sm text-slate-600">Jours d'ouverture: {data.openDays}</p> : null}
              {data.closedDays ? <p className="mt-2 text-sm text-slate-600">Jours de fermeture: {data.closedDays}</p> : null}
              {data.professionalBackground ? (
                <div className="mt-4 rounded-[1rem] border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Parcours professionnel</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{data.professionalBackground}</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="soft-panel rounded-[1.5rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-600">Conseils</p>
            <div className="mt-4 space-y-3">
              <AdviceCard title="Wilaya puis commune" text="La recherche sera plus utile si la wilaya et la commune sont bien remplies ensemble." />
              <AdviceCard title="Lien de localisation" text="Ajoute un vrai lien Maps pour faciliter l'arrivee des patients au cabinet." />
              <AdviceCard title="Mode photo ou icone" text="Si tu ne veux pas montrer de photo, l'icone medicale donne quand meme un rendu propre et professionnel." />
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) { return <label className={full ? "sm:col-span-2 block" : "block"}><span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>{children}</label>; }
function Tag({ children }: { children: React.ReactNode }) { return <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">{children}</span>; }
function AdviceCard({ title, text }: { title: string; text: string }) { return <div className="rounded-[1rem] border border-slate-200 bg-white p-4"><p className="font-semibold text-slate-900">{title}</p><p className="mt-2 text-sm leading-7 text-slate-600">{text}</p></div>; }
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
function StatusTag({ isOpen, label }: { isOpen: boolean; label: string }) { return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isOpen ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{label}</span>; }
function DoctorAvatar({ name, photoUrl, visualMode, avatarIcon }: { name: string | null; photoUrl: string | null; visualMode?: "photo" | "icon"; avatarIcon?: string | null }) {
  if (visualMode !== "icon" && photoUrl) {
    return <img src={photoUrl} alt={name ?? "Photo du medecin"} className="h-20 w-20 rounded-[1.25rem] object-cover ring-1 ring-slate-200" />;
  }

  if (visualMode === "icon") {
    return <MedicalIconAvatar icon={avatarIcon ?? "stethoscope"} />;
  }

  return <div className="flex h-20 w-20 items-center justify-center rounded-[1.25rem] bg-emerald-50 text-lg font-semibold text-emerald-700 ring-1 ring-emerald-100">{getDoctorInitials(name)}</div>;
}
function MedicalIconAvatar({ icon }: { icon: string }) {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-[1.25rem] bg-emerald-50 ring-1 ring-emerald-100">
      <svg viewBox="0 0 64 64" className="h-11 w-11 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {icon === "cross" ? (
          <>
            <path d="M32 14v36" />
            <path d="M14 32h36" />
          </>
        ) : null}
        {icon === "heart" ? (
          <path d="M32 49 17 35a10 10 0 1 1 15-12 10 10 0 1 1 15 12Z" />
        ) : null}
        {icon === "pill" ? (
          <>
            <path d="M22 42 42 22a9 9 0 1 1 13 13L35 55a9 9 0 0 1-13-13Z" />
            <path d="M26 38 38 26" />
          </>
        ) : null}
        {icon === "stethoscope" ? (
          <>
            <path d="M22 12v15a10 10 0 0 0 20 0V12" />
            <path d="M26 12v10" />
            <path d="M38 12v10" />
            <path d="M42 34a8 8 0 1 1-16 0" />
            <circle cx="46" cy="40" r="6" />
          </>
        ) : null}
      </svg>
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
function stripDoctorPrefix(name?: string | null) {
  return name?.replace(/^\s*(dr\.?|docteur)\s+/i, "").trim() ?? "";
}
function formatDoctorDisplayName(name?: string | null) {
  const cleanName = stripDoctorPrefix(name);
  return cleanName ? `Dr ${cleanName}` : "Dr Medecin";
}
function getDoctorInitials(name?: string | null) {
  const cleanName = stripDoctorPrefix(name);
  const parts = cleanName.split(" ").filter(Boolean);
  if (!parts.length) return "DR";
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}
function getGenderLabel(gender?: string | null) {
  if (gender === "male") return "Homme";
  if (gender === "female") return "Femme";
  return "Sexe non precise";
}
