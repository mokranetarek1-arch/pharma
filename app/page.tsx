﻿import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPath } from "@/lib/auth/roles";
import { SearchForm } from "@/components/search/search-form";
import { Floating, HoverCard, Pressable, Reveal, StaggerGroup, StaggerItem } from "@/components/ui/motion";

const trustPoints = [
  "Recherche publique sans compte",
  "Pharmacies ouvertes ou fermees visibles",
  "Ordonnance signalee sur le resultat",
  "Contact et Maps directement accessibles"
];

const featureCards = [
  {
    title: "Pour les patients",
    text: "Une recherche directe, claire et rassurante pour trouver vite un medicament et la bonne pharmacie."
  },
  {
    title: "Pour les medecins",
    text: "Une vue rapide pour orienter un patient selon la disponibilite, la ville et le statut de la pharmacie."
  },
  {
    title: "Pour les pharmaciens",
    text: "Un espace organise en pages distinctes pour le profil, le catalogue et le stock."
  }
];

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let dashboardHref = "/login";
  let profile = null;

  if (user) {
    const { data } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).maybeSingle();
    profile = data;
    dashboardHref = getDashboardPath(data?.role);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-8 lg:px-10">
      <Reveal>
        <header className="glass-card flex flex-col gap-4 rounded-[1.5rem] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-green-600">Pharma Platform</p>
            <p className="mt-2 text-sm text-slate-600">Trouve un medicament, localise une pharmacie et cree ton compte selon ton role.</p>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm">
            {user ? (
              <>
                <Link href={dashboardHref} className="primary-button">Mon espace</Link>
                <Link href="/search" className="secondary-button">Recherche</Link>
              </>
            ) : (
              <>
                <Link href="/login" className="secondary-button">Connexion</Link>
                <Link href="/signup" className="primary-button">Créer un compte</Link>
              </>
            )}
          </nav>
        </header>
      </Reveal>

      <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-emerald-100 bg-[linear-gradient(135deg,#ecfdf5,#ffffff_48%,#eff6ff)] px-6 py-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:px-8 lg:px-12 lg:py-12">

        <div className="relative mx-auto max-w-5xl text-center">
          <Reveal>
            <div className="mx-auto inline-flex rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-medium text-green-700">{getHomeGreeting(profile?.role, profile?.full_name)}</div>
            <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] text-slate-900 sm:text-5xl lg:text-6xl">Une plateforme medicale simple pour patient, medecin et pharmacien.</h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600">Recherche un médicament, découvre les pharmacies proches et crée ton compte rapidement selon ton rôle.</p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mx-auto mt-8 max-w-5xl rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_20px_40px_rgba(15,23,42,0.08)] sm:p-5">
              <div className="mt-2">
                <SearchForm query="" city="" searchType="medicine" action="/search" />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <QuickLink href="/signup" title="Patient" text="Crée ton compte pour chercher tes médicaments et pharmacies." />
                <QuickLink href="/signup" title="Medecin" text="Inscris-toi pour orienter tes patients rapidement." />
                <QuickLink href="/signup" title="Pharmacien" text="Ajoute ton compte pour gérer ton profil et ton stock." />
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
                <Link href="/login" className="secondary-button">Connexion</Link>
                <Link href="/signup" className="primary-button">Créer un compte</Link>
              </div>
              <div className="mt-5 flex flex-wrap justify-center gap-2">{trustPoints.map((point) => <span key={point} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">{point}</span>)}</div>
            </div>
          </Reveal>
        </div>
      </section>

      <StaggerGroup className="mt-8 grid gap-4 lg:grid-cols-3" delay={0.08}>
        {featureCards.map((card) => (
          <StaggerItem key={card.title}>
            <HoverCard>
              <article className="interactive-card soft-panel rounded-[1.5rem] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-600">Experience</p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-900">{card.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{card.text}</p>
              </article>
            </HoverCard>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <Reveal>
          <div className="soft-panel rounded-[1.5rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-600">Pourquoi ca marche mieux</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Une organisation claire pour chaque role.</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <InfoTile title="Recherche" text="Des l'accueil, sans forcer le visiteur a comprendre la plateforme avant d'agir." />
              <InfoTile title="Profil pharmacie" text="Une page dediee pour les informations publiques et la disponibilite." />
              <InfoTile title="Medicaments" text="Une page separee pour le catalogue et les mouvements de stock." />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="soft-panel rounded-[1.5rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">{user ? "Raccourcis" : "Acces rapide"}</p>
            <div className="mt-5 grid gap-3">
              {user ? (
                <>
                  <QuickLink href={getProfilePath(profile?.role)} title="Mon profil" text="Mettre a jour tes informations et ta disponibilite." />
                  {profile?.role === "doctor" && <QuickLink href="/doctor/search" title="Recherche medecin" text="Parcourir et orienter les patients." />}
                  {profile?.role === "pharmacist" && <QuickLink href="/pharmacy/dashboard" title="Tableau de bord" text="Gerer ton stock et ton inventaire." />}
                  <QuickLink href="/search" title="Recherche" text="Parcourir medicaments ou medecins." />
                </>
              ) : (
                <>
                  <QuickLink href="/search" title="Recherche publique" text="Pour patients et visiteurs sans compte." />
                  <QuickLink href="/search?type=doctor" title="Recherche medecin" text="Pour trouver un medecin rapidement." />
                  <QuickLink href={dashboardHref} title="Entrer dans la plateforme" text="Acceder a l'espace adapte au role connecte." />
                </>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

function InfoTile({ title, text }: { title: string; text: string }) {
  return <div className="rounded-[1rem] border border-slate-200 bg-white p-4"><h3 className="text-lg font-semibold text-slate-900">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></div>;
}

function getProfilePath(role?: string | null): string {
  switch (role) {
    case "doctor":
      return "/doctor/profile";
    case "pharmacist":
      return "/pharmacy/profile";
    case "admin":
      return "/admin";
    default:
      return "/search";
  }
}

function getHomeGreeting(role?: string | null, fullName?: string | null): string {
  const safeName = fullName?.trim();

  if (role === "doctor") {
    return safeName ? `Bienvenue Dr ${safeName}` : "Bienvenue Docteur";
  }

  if (role === "pharmacist") {
    return safeName ? `Bienvenue M. ${safeName}` : "Bienvenue Monsieur le pharmacien";
  }

  return "Commence ici pour ton parcours patient ou professionnel";
}

function QuickLink({ href, title, text }: { href: string; title: string; text: string }) {
  return <Pressable><Link href={href} className="interactive-card block rounded-[1rem] border border-slate-200 bg-white p-4"><h3 className="font-semibold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></Link></Pressable>;
}
