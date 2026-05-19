import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/motion";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.04fr_0.96fr]">
        <Reveal>
          <section className="relative overflow-hidden rounded-[2.4rem] border border-white/12 bg-[linear-gradient(145deg,rgba(6,14,28,0.84),rgba(8,47,73,0.7)_52%,rgba(15,118,110,0.46))] p-8 text-white shadow-[0_32px_110px_rgba(1,6,17,0.32)] sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(253,224,71,0.14),transparent_24%)]" />
            <div className="relative">
              <p className="text-sm uppercase tracking-[0.3em] text-teal-200">Connexion securisee</p>
              <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">Accede a ton espace produit selon ton role.</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-100">Une authentification unique pour doctor, patient, pharmacien et admin, avec une interface qui s'adapte a l'usage reel de chacun.</p>
              <StaggerGroup className="mt-10 grid gap-4 sm:grid-cols-2" delay={0.14}>
                <StaggerItem><AuthFeature title="Role-based routing" text="La plateforme t'envoie automatiquement vers le bon espace apres connexion." /></StaggerItem>
                <StaggerItem><AuthFeature title="Mobile first" text="Utilisable rapidement au comptoir, en cabinet ou en deplacement." /></StaggerItem>
                <StaggerItem><AuthFeature title="Medicine search" text="Resultats lisibles, contact direct et lien Maps en un geste." /></StaggerItem>
                <StaggerItem><AuthFeature title="Pharmacy ops" text="Le pharmacien pilote son profil et son stock depuis le meme espace." /></StaggerItem>
              </StaggerGroup>
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.08}>
          <section className="rounded-[2.4rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))] p-6 shadow-[0_24px_90px_rgba(1,6,17,0.26)] backdrop-blur-xl sm:p-8 lg:p-10">
            <AuthForm mode="login" />
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-200">
              <p>Pas encore de compte ?</p>
              <div className="flex gap-3">
                <Link href="/signup" className="font-semibold text-teal-200 transition hover:text-white">Creer un compte</Link>
                <span className="text-slate-400">•</span>
                <Link href="/" className="font-semibold text-teal-200 transition hover:text-white">Accueil</Link>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}

function AuthFeature({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.6rem] border border-white/12 bg-white/8 p-4 backdrop-blur">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-100">{text}</p>
    </div>
  );
}
