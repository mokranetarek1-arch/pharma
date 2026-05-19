import Link from "next/link";
import { ensureProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/motion";

const values = [
  {
    title: "Recherche utile",
    text: "Faire gagner du temps aux patients, doctors et pharmaciens en affichant directement les informations qui comptent."
  },
  {
    title: "Interface simple",
    text: "Construire une plateforme qui reste facile a utiliser meme quand le service grandit."
  },
  {
    title: "Base serieuse",
    text: "Poser une experience credible pour un futur produit healthtech plus ambitieux."
  }
];

function getProfilePath(role?: string | null) {
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

export default async function AboutPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const profile = user ? await ensureProfile(user) : null;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-8">
      <Reveal>
        <section className="soft-panel rounded-[2.4rem] p-8">
          <p className="text-sm uppercase tracking-[0.32em] text-slate-400">A propos</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950 sm:text-5xl">Une plateforme pour relier la recherche de medicaments et les pharmacies.</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">Le projet combine une recherche publique tres rapide avec un espace pharmacien plus structure, pour que l'information circule mieux entre patients, doctors et pharmacies.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="secondary-button">Accueil</Link>
            {profile ? <Link href={getProfilePath(profile.role)} className="secondary-button">Mon profil</Link> : null}
            <Link href="/search" className="primary-button">Lancer une recherche</Link>
          </div>
        </section>
      </Reveal>

      <StaggerGroup className="mt-8 grid gap-4 md:grid-cols-3" delay={0.08}>
        {values.map((value) => (
          <StaggerItem key={value.title}>
            <div className="soft-panel rounded-[1.8rem] p-6">
              <h2 className="text-2xl font-semibold text-white">{value.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-200">{value.text}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </main>
  );
}
