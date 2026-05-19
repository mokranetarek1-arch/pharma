import Link from "next/link";
import { ensureProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import { Reveal } from "@/components/ui/motion";

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

export default async function ContactPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const profile = user ? await ensureProfile(user) : null;

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-6 sm:px-8">
      <Reveal>
        <section className="soft-panel rounded-[2.4rem] p-8">
          <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Contact</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950 sm:text-5xl">Parler du projet, proposer un partenariat ou demander une demo.</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">Cette page donne au site une vraie presence produit. Tu pourras ensuite la brancher a un formulaire, WhatsApp, email support ou CRM.</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Email</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">contact@pharmaplatform.app</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">Pour les demandes de demo, d'integration et les questions produit.</p>
            </div>
            <div className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Telephone</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">+213 555 00 00 00</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">Pour une mise en relation rapide avec l'equipe produit.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="secondary-button">Retour accueil</Link>
            {profile ? <Link href={getProfilePath(profile.role)} className="secondary-button">Mon profil</Link> : null}
            <Link href="/search" className="primary-button">Ouvrir la recherche</Link>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
