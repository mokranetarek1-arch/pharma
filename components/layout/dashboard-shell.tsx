import { signOutAction } from "@/lib/actions/auth";
import { getDashboardPath } from "@/lib/auth/roles";
import { Pressable, Reveal } from "@/components/ui/motion";

export function DashboardShell({ title, subtitle, userEmail, role, children }: { title: string; subtitle: string; userEmail: string; role: string; children: React.ReactNode }) {
  const homeHref = getDashboardPath(role);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6">
        <nav className="space-y-4">
          <a href="/search" className="block text-slate-700 hover:text-slate-900 font-medium">Accueil</a>
          <a href="/about" className="block text-slate-700 hover:text-slate-900 font-medium">A propos</a>
          <a href="/contact" className="block text-slate-700 hover:text-slate-900 font-medium">Contact</a>
          {/* Add profile link based on role */}
          {role === "doctor" && <a href="/doctor/profile" className="block text-slate-700 hover:text-slate-900 font-medium">Profil</a>}
          {role === "pharmacist" && <a href="/pharmacy/profile" className="block text-slate-700 hover:text-slate-900 font-medium">Profil</a>}
          {role === "admin" && <a href="/admin" className="block text-slate-700 hover:text-slate-900 font-medium">Profil</a>}
        </nav>
        <div className="mt-8">
          <form action={signOutAction}>
            <Pressable>
              <button className="secondary-button text-sm w-full">Deconnexion</button>
            </Pressable>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <Reveal>
          <header className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.06)] mb-6">
            <div className="bg-[linear-gradient(135deg,#f0fdf4,#ffffff_55%,#eff6ff)] px-6 py-7 sm:px-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-600">{role}</p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
                  <p className="mt-4 max-w-2xl text-slate-600">{subtitle}</p>
                </div>
                <div className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Compte connecte</p>
                  <p className="mt-2 font-medium text-slate-900">{userEmail}</p>
                </div>
              </div>
            </div>
          </header>
        </Reveal>
        <section>{children}</section>
      </main>
    </div>
  );
}
