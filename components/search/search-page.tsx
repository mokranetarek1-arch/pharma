﻿"use client";

import Link from "next/link";
import { useState } from "react";
import { SearchForm } from "@/components/search/search-form";
import { signOutAction } from "@/lib/actions/auth";
import { getMedicineFormLabel } from "@/lib/constants/medicines";
import type { DoctorSearchResult, SearchResult, SearchType, UserRole } from "@/lib/types";
import { HoverCard, Pressable, Reveal, StaggerGroup, StaggerItem } from "@/components/ui/motion";
// ...existing code...
import { motion, AnimatePresence } from "framer-motion";

const searchHighlights = [
  "Recherche publique sans inscription",
  "Medecins et medicaments en un seul endroit",
  "Filtre par specialite ou ville",
  "Contact direct et disponibilite visible"
];

const specialtyInfoMap: Record<string, { title: string; description: string }> = {
  Cardiologie: {
    title: "Soins du cœur et de la circulation",
    description: "La cardiologie traite les maladies cardiovasculaires, l'hypertension et les troubles du rythme. Ce spécialiste peut aider à stabiliser l'état cardiaque et à prévenir les complications." 
  },
  Pediatrie: {
    title: "Santé des enfants et adolescents",
    description: "La pédiatrie couvre la croissance, la vaccination, les infections infantiles et les besoin spécifiques des plus jeunes patients." 
  },
  Dermatologie: {
    title: "Soins de la peau et des annexes",
    description: "La dermatologie traite l'acné, l'eczéma, les plaies, les infections et les maladies de la peau, des ongles et des muqueuses." 
  },
  Gynecologie: {
    title: "Santé féminine et gynécologique",
    description: "La gynécologie s'occupe des troubles menstruels, de la contraception, de la grossesse et des pathologies de l'appareil reproducteur féminin." 
  },
  Orthopedie: {
    title: "Appareil locomoteur et articulations",
    description: "L'orthopédie prend en charge les os, les articulations, les tendons et les ligaments, notamment après blessure ou en cas d'arthrose." 
  },
  Psychiatrie: {
    title: "Santé mentale et comportementale",
    description: "La psychiatrie soutient les patients confrontés à l'anxiété, la dépression, le stress et d'autres troubles psychiques." 
  },
  Neurologie: {
    title: "Système nerveux et fonctions cérébrales",
    description: "La neurologie traite les migraines, les troubles moteurs, les troubles cognitifs et les pathologies du cerveau et des nerfs." 
  },
  "Medecine generale": {
    title: "Consultation générale et coordination des soins",
    description: "Le médecin généraliste est le premier contact pour les symptômes courants et oriente vers le bon spécialiste si nécessaire." 
  },
  "Oto-rhino-laryngologie": {
    title: "Oreille, nez et gorge",
    description: "L'ORL s'occupe des infections, des troubles de l'audition, du nez et de la voix, ainsi que des problèmes de sinus et de gorge." 
  },
  Ophtalmologie: {
    title: "Santé des yeux et de la vision",
    description: "L'ophtalmologie traite la vue, les blessures oculaires, le glaucome, la cataracte et autres troubles visuels." 
  }
};

function getSpecialtyInfo(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;
  return Object.entries(specialtyInfoMap).reduce<{ name: string; title: string; description: string } | null>((match, [name, info]) => {
    if (match) return match;
    const key = name.toLowerCase();
    if (normalized === key || normalized.includes(key)) {
      return { name, title: info.title, description: info.description };
    }
    return null;
  }, null);
}

export function SearchPage({ roleLabel, title, description, searchType = "medicine", results, doctorResults = [], query, city, speciality, userEmail, userRole, action = "/search" }: { roleLabel: string; title: string; description: string; searchType?: SearchType; results: SearchResult[]; doctorResults?: DoctorSearchResult[]; query: string; city: string; speciality?: string; userEmail: string | null; userRole?: UserRole | null; action?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDoctorSearch = searchType === "doctor";
  const activeResults = isDoctorSearch ? doctorResults : results;
  const hasQuery = Boolean(query.trim() || speciality?.trim());
  const contextualActions = getContextualActions(userRole);
  const specialtyInfo = isDoctorSearch ? getSpecialtyInfo(speciality || query) : null;

  return (
    <>
      {/* Sliding Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-slate-200 p-6 shadow-lg"
          >
            <button onClick={() => setMenuOpen(false)} className="mb-4 text-slate-500 hover:text-slate-700">Fermer</button>
            <nav className="space-y-4">
              <Link href="/" className="block text-slate-700 hover:text-slate-900 font-medium">Accueil</Link>
              <Link href="/about" className="block text-slate-700 hover:text-slate-900 font-medium">A propos</Link>
              <Link href="/contact" className="block text-slate-700 hover:text-slate-900 font-medium">Contact</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {/* Overlay supprimé pour éviter l'effet d'écran noir */}

      <main className="mx-auto min-h-screen max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <Reveal>
          <header className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.06)]">
            <div className="bg-[linear-gradient(135deg,#f0fdf4,#ffffff_55%,#eff6ff)] px-6 py-8 sm:px-8 lg:px-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-center gap-4 max-w-3xl">
                  <button onClick={() => setMenuOpen(true)} className="flex flex-col space-y-1 p-2">
                    <span className="block h-0.5 w-6 bg-slate-600"></span>
                    <span className="block h-0.5 w-6 bg-slate-600"></span>
                    <span className="block h-0.5 w-6 bg-slate-600"></span>
                  </button>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-600">{roleLabel}</p>
                    <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl lg:text-5xl">{title}</h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
                  </div>
                </div>
              <div className="max-w-md space-y-3">
                <div className="rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">{userEmail || "Mode public"}</div>
                {contextualActions.length ? (
                  <div className="flex flex-wrap gap-3">
                    {contextualActions.map((item) => (
                      <Pressable key={item.href}>
                        <Link href={item.href} className={item.primary ? "primary-button inline-flex text-sm" : "secondary-button inline-flex text-sm"}>{item.label}</Link>
                      </Pressable>
                    ))}
                  </div>
                ) : null}
                {userEmail ? (
                  <form action={signOutAction}>
                    <Pressable>
                      <button className="secondary-button text-sm">Deconnexion</button>
                    </Pressable>
                  </form>
                ) : null}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">{searchHighlights.map((item) => <Badge key={item} label={item} dark />)}</div>
          </div>
          <div className="px-4 py-5 sm:px-6 lg:px-8">
            <div className="mb-6 flex gap-6 border-b border-slate-200">
              <Link href="/search" className={`pb-3 text-sm font-semibold transition-colors ${!isDoctorSearch ? "border-b-2 border-green-600 text-green-700" : "text-slate-500 hover:text-slate-800"}`}>Chercher un médicament</Link>
              <Link href={action === "/doctor/search" ? "/doctor/search" : "/search?type=doctor"} className={`pb-3 text-sm font-semibold transition-colors ${isDoctorSearch ? "border-b-2 border-green-600 text-green-700" : "text-slate-500 hover:text-slate-800"}`}>Trouver un médecin</Link>
            </div>
            <SearchForm key={searchType} query={query} city={city} speciality={speciality} searchType={searchType} action={action} />
          </div>
        </header>
      </Reveal>
      {isDoctorSearch && specialtyInfo ? (
        <section className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-slate-700 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Information specialité</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-900">{specialtyInfo.name}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{specialtyInfo.description}</p>
        </section>
      ) : null}

      {!hasQuery ? (
        <section className="mt-6 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <Reveal>
            <div className="soft-panel rounded-[1.5rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Comment ca marche</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Une recherche rapide, lisible et rassurante.</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <GuideCard index="01" title="Tape le nom" text="Medicaments ou categories, avec ou sans compte." />
                <GuideCard index="02" title="Filtre la ville" text="Si tu veux te concentrer sur une zone precise." />
                <GuideCard index="03" title="Agis direct" text="Vois la disponibilite et appelle la pharmacie." />
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="soft-panel rounded-[1.5rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{isDoctorSearch ? "Conseil rapide" : "Exemples"}</p>
              {isDoctorSearch ? (
                <div className="mt-4 space-y-3">
                  <Suggestion label="Recherche par specialite" helper="Clique sur une specialite pour voir les medecins" />
                  <Suggestion label="Ajoute une ville" helper="Filtre les resultats geographiquement" />
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <Suggestion label="Doliprane" helper="Nom exact du medicament" />
                  <Suggestion label="Antibiotique" helper="Recherche par categorie" />
                  <Suggestion label="Insuline" helper="Produit sensible, verification rapide" />
                  <Suggestion label="Vitamine C" helper="Recherche grand public" />
                </div>
              )}
            </div>
          </Reveal>
        </section>
      ) : null}

      <section className="mt-6 space-y-5">
        <Reveal>
          <div className="soft-panel flex flex-col gap-3 rounded-[1.25rem] px-5 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {hasQuery ? (
                <>
                  <span className="font-semibold text-slate-900">{activeResults.length}</span> resultat(s) pour <span className="font-semibold text-slate-900">{query}</span>
                  {city ? <> dans <span className="font-semibold text-slate-900">{city}</span></> : null}
                </>
              ) : (
                "Lance une recherche pour afficher des resultats pertinents."
              )}
            </p>
            <div className="flex flex-wrap gap-2"><Badge label="Rapide" /><Badge label="Clair" /><Badge label={isDoctorSearch ? "Medecins" : "Medicaments"} /></div>
          </div>
        </Reveal>

        <StaggerGroup className="space-y-5" delay={0.08}>
          {isDoctorSearch
            ? doctorResults.map((doctor) => (
                <StaggerItem key={doctor.doctorId}>
                  <HoverCard>
                    <DoctorResultCard doctor={doctor} />
                  </HoverCard>
                </StaggerItem>
              ))
            : results.map((result) => {
                const stockStatus = getStockStatus(result.quantity, (result as any).availability_status);

                return (
                  <StaggerItem key={result.stockId}>
                    <HoverCard>
                      <article className="interactive-card overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.06)]">
                        <div className="grid gap-0 xl:grid-cols-[1.2fr_0.8fr]">
                          <div className="border-b border-slate-100 bg-white p-5 sm:p-6 xl:border-b-0 xl:border-r">
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                              <MedicineVisual imageUrl={result.medicineImageUrl} name={result.medicineName} />
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-green-700">Fiche medicament</span>
                                  <StockBadge status={stockStatus} />
                                  {result.requiresPrescription ? <Pill tone="amber">Ordonnance obligatoire</Pill> : <Pill tone="emerald">Sans ordonnance</Pill>}
                                </div>
                                <h2 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-[2rem]">{result.medicineName}</h2>
                                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{result.medicineDescription || "Information essentielle du produit affichee de facon claire pour aider le patient ou le docteur a prendre une decision rapide."}</p>

                                <dl className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                  <SpecCard label="Forme pharmaceutique" value={getMedicineFormLabel(result.form) || "Non renseignee"} accent="emerald" />
                                  <SpecCard label="Dosage" value={result.dosage || "Non renseigne"} accent="blue" />
                                  <SpecCard label="Categorie" value={result.categorie || "Non renseignee"} accent="slate" />
                                  <SpecCard label="Prix" value={result.price !== null ? `${result.price.toFixed(2)} DA` : "Non renseigne"} accent="amber" />
                                </dl>
                              </div>
                            </div>
                          </div>

                          <div className="flex h-full flex-col justify-between bg-slate-50/70 p-5 sm:p-6">
                            <div>
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Pharmacie</p>
                                <AvailabilityBadge isOpen={result.pharmacyIsOpen} />
                              </div>
                              <div className="mt-4 flex items-center gap-3 rounded-[1rem] border border-slate-200 bg-white p-3">
                                <PharmacyThumb imageUrl={result.pharmacyImageUrl} name={result.pharmacyName} />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-semibold text-slate-900">{result.pharmacyName}</p>
                                  <p className="mt-1 text-sm text-slate-600">{result.city || "Ville non renseignee"}</p>
                                  <RatingStars ratingSummary={result.pharmacyRatingSummary} />
                                </div>
                              </div>

                              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <MetricTile label="Disponibilite" value={stockStatus.label} tone={stockStatus.tone} />
                                <MetricTile label="Mise a jour" value={new Date(result.updatedAt).toLocaleDateString("fr-FR")} tone="slate" />
                              </div>

                              <div className="mt-4 rounded-[1rem] border border-slate-200 bg-white p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Action conseillee</p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{getActionAdvice(result.requiresPrescription, stockStatus)}</p>
                              </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                              <Pressable>
                                <Link href={`/pharmacies/${result.pharmacyId}`} className="secondary-button inline-flex text-sm">Voir la pharmacie</Link>
                              </Pressable>
                              {result.googleMapsLink ? (
                                <Pressable>
                                  <a href={result.googleMapsLink} target="_blank" rel="noreferrer" className="secondary-button inline-flex text-sm">Ouvrir Maps</a>
                                </Pressable>
                              ) : null}
                              {result.phone ? (
                                <Pressable>
                                  <a href={`tel:${result.phone}`} className="primary-button inline-flex text-sm">Appeler</a>
                                </Pressable>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </article>
                    </HoverCard>
                  </StaggerItem>
                );
              })}
        </StaggerGroup>

        {hasQuery && activeResults.length === 0 ? <AnimatedEmptyState /> : null}
      </section>
    </main>
  </>
  );
}

function RatingStars({ ratingSummary }: { ratingSummary?: { averageRating: number | null; reviewCount: number } }) {
  if (!ratingSummary) {
    return <p className="mt-2 text-sm text-slate-500">Pas encore d'avis</p>;
  }

  const average = Number(ratingSummary.averageRating?.toFixed(1) ?? 0);
  const filledStars = Math.round(average);

  return (
    <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
      <div className="flex items-center gap-1 text-amber-500">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} className={index < filledStars ? "text-amber-500" : "text-slate-200"} aria-hidden="true">★</span>
        ))}
      </div>
      <span>{average.toFixed(1)} · {ratingSummary.reviewCount} avis</span>
    </div>
  );
}

function getContextualActions(userRole?: UserRole | null) {
  switch (userRole) {
    case "pharmacist":
      return [
        { href: "/pharmacy/profile", label: "Profil pharmacie" },
        { href: "/pharmacy/medicines", label: "Ajouter un medicament", primary: true },
        { href: "/pharmacy/dashboard", label: "Stock" }
      ];
    case "doctor":
      return [
        { href: "/doctor/profile", label: "Mon profil", primary: true },
        { href: "/doctor/search", label: "Recherche medecin" }
      ];
    case "admin":
      return [
        { href: "/admin", label: "Admin", primary: true },
        { href: "/pharmacy/dashboard", label: "Pharmacie" }
      ];
    default:
      return [];
  }
}

function getStockStatus(quantity: number, status?: string) {
  if (status === "on_order") return { label: "Sous commande", tone: "amber" as const, badgeClass: "bg-amber-50 text-amber-600" };
  if (quantity <= 0) return { label: "Indisponible", tone: "red" as const, badgeClass: "bg-red-50 text-red-600" };
  if (quantity <= 5) return { label: "Stock faible", tone: "amber" as const, badgeClass: "bg-amber-50 text-amber-600" };
  return { label: "Disponible", tone: "emerald" as const, badgeClass: "bg-green-50 text-green-600" };
}

function getActionAdvice(requiresPrescription: boolean, stockStatus: ReturnType<typeof getStockStatus>) {
  if (stockStatus.label === "Sous commande") {
    return "Ce médicament est disponible sur commande. Contactez la pharmacie pour connaître le délai de réception.";
  }
  if (stockStatus.label === "Indisponible") {
    return "Le produit semble indisponible dans cette pharmacie. Essaie une autre pharmacie ou elargis la recherche a une autre ville.";
  }

  if (requiresPrescription) {
    return stockStatus.label === "Stock faible"
      ? "Ce produit exige une ordonnance et le stock parait faible. Appelle avant de te deplacer."
      : "Previens le patient de preparer son ordonnance avant de se deplacer vers la pharmacie.";
  }

  return stockStatus.label === "Stock faible"
    ? "Le produit est encore disponible mais le stock semble faible. Un appel rapide permet de confirmer avant de se rendre sur place."
    : "Le produit semble disponible. Un appel rapide permet de confirmer avant de se rendre sur place.";
}

function AnimatedEmptyState() {
  return (
    <Reveal>
      <div className="soft-panel overflow-hidden rounded-[1.5rem] p-10 text-center text-slate-600">
        <div className="relative mx-auto flex max-w-xl flex-col items-center">
          <span className="empty-orb left-10 top-2 h-20 w-20" />
          <span className="empty-orb right-6 top-10 h-16 w-16 [animation-delay:1.2s]" />
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Aucun resultat</div>
          <h3 className="mt-5 text-2xl font-semibold text-slate-900">Aucun resultat trouve pour cette recherche.</h3>
          <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600">Essaie un autre nom, une specialite plus large ou retire le filtre ville pour elargir la recherche.</p>
        </div>
      </div>
    </Reveal>
  );
}

function MetricTile({ label, value, tone }: { label: string; value: string; tone: "emerald" | "amber" | "red" | "slate" }) {
  const tones = {
    emerald: "bg-green-50 text-green-700 border border-green-100",
    amber: "bg-amber-50 text-amber-700 border border-amber-100",
    red: "bg-red-50 text-red-700 border border-red-100",
    slate: "bg-white text-slate-700 border border-slate-200"
  };

  return <div className={`rounded-[1rem] p-4 ${tones[tone]}`}><p className="text-[11px] font-semibold uppercase tracking-[0.24em] opacity-60">{label}</p><p className="mt-2 text-sm font-semibold leading-6">{value}</p></div>;
}

function SpecCard({ label, value, accent }: { label: string; value: string; accent: "emerald" | "blue" | "slate" | "amber" }) {
  const accents = {
    emerald: "border-green-100 bg-green-50 text-green-800",
    blue: "border-blue-100 bg-blue-50 text-blue-800",
    slate: "border-slate-200 bg-slate-50 text-slate-800",
    amber: "border-amber-100 bg-amber-50 text-amber-800"
  };

  return <div className={`rounded-[1rem] border p-4 ${accents[accent]}`}><dt className="text-[11px] font-semibold uppercase tracking-[0.24em] opacity-60">{label}</dt><dd className="mt-2 text-base font-semibold leading-6">{value}</dd></div>;
}

function DoctorResultCard({ doctor }: { doctor: DoctorSearchResult }) {
  const availability = getDoctorCardAvailability(doctor);
  const genderTone = getDoctorGenderTone(doctor.gender);
  const scheduleSummary = getDoctorScheduleSummary(doctor);
  const openDaysSummary = getDoctorOpenDaysSummary(doctor);

  return (
    <article className="interactive-card overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.06)]">
      <div className="grid gap-4 p-5 lg:grid-cols-[1.55fr_0.75fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${genderTone.badgeClass}`}>Medecin</span>
          </div>
          <div className="flex items-start gap-3">
            <DoctorCardAvatar name={doctor.fullName} photoUrl={doctor.photoUrl} visualMode={doctor.visualMode} avatarIcon={doctor.avatarIcon} gender={doctor.gender} />
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-slate-900">{formatDoctorName(doctor.fullName)}</h2>
              <p className="mt-1 text-sm font-medium text-slate-600">{doctor.speciality ?? "Specialite non renseignee"}</p>
              {doctor.gender ? <p className={`mt-1 text-sm font-medium ${genderTone.textClass}`}>{doctor.gender === "male" ? "Homme" : "Femme"}</p> : null}
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <CompactInfo label="Ville" value={doctor.city ?? "Non renseignee"} />
                <CompactInfo label="Commune" value={doctor.commune ?? "Non renseignee"} />
                <CompactInfo label="Adresse" value={doctor.address ?? "Non renseignee"} />
              </div>
            </div>
          </div>
          {(doctor.professionalBackground || doctor.experienceYears !== null) ? (
            <div className="rounded-[1.1rem] border border-slate-200 bg-slate-50 p-3">
              {doctor.experienceYears !== null ? (
                <p className="text-sm font-semibold text-slate-900">{doctor.experienceYears} annees d'experience</p>
              ) : null}
              {doctor.professionalBackground ? (
                <>
                  <p className={`${doctor.experienceYears !== null ? "mt-2" : ""} text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500`}>Parcours professionnel</p>
                  <p
                    className="mt-2 text-sm leading-6 text-slate-600"
                    style={{
                      whiteSpace: "pre-line"
                    }}
                  >
                    {doctor.professionalBackground}
                  </p>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4 text-slate-600">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Actions consultation</p>
            <div className="min-w-[10rem] text-right">
              <RatingStars ratingSummary={doctor.ratingSummary} />
            </div>
          </div>
          <div className="mt-4 rounded-[1rem] border border-slate-200 bg-white p-3">
            <p className={`text-sm font-semibold ${availability.isOpen ? "text-emerald-700" : "text-red-600"}`}>{availability.isOpen ? "Ouvert" : "Ferme"}</p>
            <p className="mt-2 text-xs font-semibold text-slate-500">{availability.detail}</p>
            {availability.closedDay ? <p className="mt-1 text-xs text-slate-500">{availability.closedDay}</p> : null}
          </div>
          <div className="mt-3 rounded-[1rem] border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600">
            {doctor.googleMapsLink || doctor.address
              ? "Lien direct disponible pour ouvrir la localisation du cabinet."
              : "Ajoute une adresse ou un lien de localisation pour guider les patients plus facilement."}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {doctor.phone ? (
              <Pressable>
                <a href={`tel:${doctor.phone}`} className="primary-button inline-flex text-sm">Appeler</a>
              </Pressable>
            ) : null}
            {doctor.googleMapsLink ? (
              <Pressable>
                <a
                  href={doctor.googleMapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="secondary-button inline-flex text-sm"
                >
                  Localisation
                </a>
              </Pressable>
            ) : doctor.address ? (
              <Pressable>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([doctor.address, doctor.commune, doctor.city].filter(Boolean).join(", "))}`}
                  target="_blank"
                  rel="noreferrer"
                  className="secondary-button inline-flex text-sm"
                >
                  Localisation
                </a>
              </Pressable>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function ResultInfo({ label, value }: { label: string; value: string }) { return <div className="rounded-[1rem] border border-slate-200 bg-white p-4 text-sm"><p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p><p className="mt-2 font-semibold text-slate-900">{value}</p></div>; }
function CompactInfo({ label, value }: { label: string; value: string }) { return <div className="rounded-[0.9rem] border border-slate-200 bg-white px-3 py-2.5 text-sm"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p><p className="mt-1 font-semibold leading-5 text-slate-900">{value}</p></div>; }
function DoctorCardAvatar({ name, photoUrl, visualMode, avatarIcon, gender }: { name: string | null; photoUrl: string | null; visualMode?: "photo" | "icon"; avatarIcon?: string | null; gender?: "male" | "female" | null }) {
  if (visualMode !== "icon" && photoUrl) return <img src={photoUrl} alt={name ?? "Photo du medecin"} className="h-16 w-16 rounded-[1rem] object-cover ring-1 ring-slate-200" />;
  if (visualMode === "icon") return <MedicalIconAvatar icon={avatarIcon ?? "stethoscope"} gender={gender} />;
  const genderTone = getDoctorGenderTone(gender);
  return <div className={`flex h-16 w-16 items-center justify-center rounded-[1rem] text-sm font-semibold ${genderTone.avatarClass}`}>{getDoctorInitials(name)}</div>;
}
function MedicalIconAvatar({ icon, gender }: { icon: string; gender?: "male" | "female" | null }) {
  const genderTone = getDoctorGenderTone(gender);
  return (
    <div className={`flex h-16 w-16 items-center justify-center rounded-[1rem] ring-1 ${genderTone.avatarClass}`}>
      <svg viewBox="0 0 64 64" className={`h-9 w-9 ${genderTone.iconClass}`} fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {icon === "cross" ? <><path d="M32 14v36" /><path d="M14 32h36" /></> : null}
        {icon === "heart" ? <path d="M32 49 17 35a10 10 0 1 1 15-12 10 10 0 1 1 15 12Z" /> : null}
        {icon === "pill" ? <><path d="M22 42 42 22a9 9 0 1 1 13 13L35 55a9 9 0 0 1-13-13Z" /><path d="M26 38 38 26" /></> : null}
        {icon === "stethoscope" ? <><path d="M22 12v15a10 10 0 0 0 20 0V12" /><path d="M26 12v10" /><path d="M38 12v10" /><path d="M42 34a8 8 0 1 1-16 0" /><circle cx="46" cy="40" r="6" /></> : null}
      </svg>
    </div>
  );
}
function stripDoctorPrefix(name?: string | null) { return name?.replace(/^\s*(dr\.?|docteur)\s+/i, "").trim() ?? ""; }
function formatDoctorName(name?: string | null) { const clean = stripDoctorPrefix(name); return clean ? `Dr ${clean}` : "Dr Medecin"; }
function getDoctorInitials(name?: string | null) { const clean = stripDoctorPrefix(name); const parts = clean.split(" ").filter(Boolean); return parts.length ? parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase() : "DR"; }
function getDoctorScheduleSummary(doctor: DoctorSearchResult) {
  if (doctor.isOpen24h) return "24h/24 et 7j/7";

  const hours = doctor.openTime || doctor.closeTime ? `${doctor.openTime ?? "--:--"} a ${doctor.closeTime ?? "--:--"}` : null;
  return hours || "Horaires non renseignes";
}
function getDoctorOpenDaysSummary(doctor: DoctorSearchResult) {
  if (doctor.isOpen24h) return "Tous les jours";
  if (doctor.openDays) {
    const days = doctor.openDays.split(",").map((day) => day.trim()).filter(Boolean);
    return days.length >= 2 ? `Du ${days[0]} au ${days[days.length - 1]}` : `Le ${days[0]}`;
  }
  if (doctor.closedDays) {
    const closedDays = doctor.closedDays.split(",").map((day) => day.trim()).filter(Boolean);
    if (closedDays.length >= 2) return `Ferme du ${closedDays[0]} au ${closedDays[closedDays.length - 1]}`;
    if (closedDays.length === 1) return `Ferme le ${closedDays[0]}`;
  }
  return "Disponibilite non renseignee";
}
function getDoctorCardAvailability(doctor: DoctorSearchResult) {
  if (doctor.isOpen24h) {
    return {
      isOpen: true,
      detail: "24h/24 et 7j/7",
      closedDay: undefined
    };
  }

  const closedDays = doctor.closedDays?.split(",").map((day) => day.trim()).filter(Boolean) ?? [];
  const closedDay = closedDays.length ? `Fermé ${closedDays.join(", ")}` : undefined;
  const schedule = doctor.openTime || doctor.closeTime ? `Horaires ${doctor.openTime ?? "--:--"} à ${doctor.closeTime ?? "--:--"}` : "Horaires non renseignés";
  const openDays = doctor.openDays ? getDoctorOpenDaysSummary(doctor) : undefined;

  return {
    isOpen: !!doctor.openDays,
    detail: openDays ? `${openDays} · ${schedule}` : schedule,
    closedDay
  };
}
function getDoctorGenderTone(gender?: "male" | "female" | null) {
  if (gender === "female") {
    return {
      badgeClass: "bg-pink-50 text-pink-700",
      softBadgeClass: "border-pink-200 bg-pink-50 text-pink-700",
      avatarClass: "bg-pink-50 text-pink-700 ring-pink-100",
      iconClass: "text-pink-700",
      textClass: "text-pink-700"
    };
  }

  return {
    badgeClass: "bg-blue-50 text-blue-700",
    softBadgeClass: "border-blue-200 bg-blue-50 text-blue-700",
    avatarClass: "bg-blue-50 text-blue-700 ring-blue-100",
    iconClass: "text-blue-700",
    textClass: "text-blue-700"
  };
}

function StockBadge({ status }: { status: ReturnType<typeof getStockStatus> }) {
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.badgeClass}`}>{status.label}</span>;
}

function Badge({ label, dark }: { label: string; dark?: boolean }) { return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${dark ? "border border-slate-200 bg-white text-slate-600" : "bg-slate-50 text-slate-600 border border-slate-200"}`}>{label}</span>; }
function GuideCard({ index, title, text }: { index: string; title: string; text: string }) { return <div className="rounded-[1rem] border border-slate-200 bg-white p-4"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{index}</p><h3 className="mt-3 text-lg font-semibold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>; }
function Suggestion({ label, helper }: { label: string; helper: string }) { return <div className="rounded-[1rem] border border-slate-200 bg-white px-4 py-4"><p className="font-semibold text-slate-900">{label}</p><p className="mt-1 text-sm text-slate-600">{helper}</p></div>; }
function MedicineVisual({ imageUrl, name }: { imageUrl: string | null; name: string }) { if (imageUrl) return <img src={imageUrl} alt={name} className="h-[7rem] w-[7rem] rounded-[1rem] object-cover shadow-sm ring-1 ring-slate-200" />; return <div className="flex h-[7rem] w-[7rem] items-center justify-center rounded-[1rem] bg-green-50 text-lg font-semibold text-green-700 ring-1 ring-green-100">{name.slice(0, 2).toUpperCase()}</div>; }
function PharmacyThumb({ imageUrl, name }: { imageUrl: string | null; name: string }) { if (imageUrl) return <img src={imageUrl} alt={name} className="h-11 w-11 rounded-xl object-cover ring-1 ring-slate-200" />; return <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xs font-semibold text-blue-700">{name.slice(0, 2).toUpperCase()}</div>; }
function AvailabilityBadge({ isOpen }: { isOpen: boolean }) { return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${isOpen ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{isOpen ? "Ouverte" : "Fermee"}</span>; }
function Pill({ children, tone = "emerald" }: { children: React.ReactNode; tone?: "emerald" | "amber" }) { const tones = { emerald: "bg-green-50 text-green-700", amber: "bg-amber-50 text-amber-700" }; return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>; }
