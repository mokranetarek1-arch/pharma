import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/motion";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[0.96fr_1.04fr]">
        <Reveal>
          <section className="rounded-[2.4rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))] p-6 shadow-[0_24px_90px_rgba(1,6,17,0.26)] backdrop-blur-xl sm:p-8 lg:p-10">
            <AuthForm mode="signup" />
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-200">
              <p>Deja un compte ?</p>
              <div className="flex gap-3">
                <Link href="/login" className="font-semibold text-teal-200 transition hover:text-white">Se connecter</Link>
                <span className="text-slate-400">•</span>
                <Link href="/" className="font-semibold text-teal-200 transition hover:text-white">Accueil</Link>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.08}>
          <section className="relative overflow-hidden rounded-[2.4rem] border border-white/12 bg-[linear-gradient(150deg,rgba(245,158,11,0.16),rgba(255,255,255,0.12)_38%,rgba(104,224,207,0.12))] p-8 shadow-[0_28px_100px_rgba(1,6,17,0.24)] backdrop-blur-xl sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(15,118,110,0.16),transparent_24%)]" />
            <div className="relative">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-200">Inscription</p>
              <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl">Choisis ton role et entre directement dans le bon parcours.</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-100">L'inscription publique couvre `user`, `doctor` et `pharmacist`. Le role `admin` reste reserve a une attribution manuelle pour garder le controle du back-office.</p>
              <StaggerGroup className="mt-10 space-y-4" delay={0.12}>
                <StaggerItem><RoleLine title="Utilisateur" text="Recherche simple de medicaments, contact rapide et parcours sans friction." /></StaggerItem>
                <StaggerItem><RoleLine title="Medecin" text="Recherche prioritaire pour orienter un patient vers la bonne pharmacie." /></StaggerItem>
                <StaggerItem><RoleLine title="Pharmacien" text="Creation du profil pharmacie, localisation, stock et catalogue dans le dashboard." /></StaggerItem>
              </StaggerGroup>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}

function RoleLine({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-4 backdrop-blur">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-100">{text}</p>
    </div>
  );
}
