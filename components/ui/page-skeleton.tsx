export function PageSkeleton({ title = "Chargement de l'interface" }: { title?: string }) {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <section className="glass-card rounded-[2.2rem] p-6 sm:p-8">
          <div className="flex items-center gap-3 text-slate-200">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-300 border-t-slate-100 animate-spin" />
            <p className="text-sm font-semibold">{title}</p>
          </div>
          <div className="mt-6 skeleton h-4 w-32" />
          <div className="mt-4 skeleton h-12 w-full max-w-xl" />
          <div className="mt-4 skeleton h-5 w-full max-w-2xl" />
          <div className="mt-8 grid gap-3 md:grid-cols-4">
            <div className="skeleton h-12 rounded-full" />
            <div className="skeleton h-12 rounded-full" />
            <div className="skeleton h-12 rounded-full" />
            <div className="skeleton h-12 rounded-full" />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="skeleton h-36 rounded-[1.8rem]" />
          <div className="skeleton h-36 rounded-[1.8rem]" />
          <div className="skeleton h-36 rounded-[1.8rem]" />
        </section>

        <section className="soft-panel rounded-[2rem] border border-white/20 bg-white/10 p-6">
          <p className="text-sm text-slate-200">{title}</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="skeleton h-44 rounded-[1.6rem]" />
            <div className="skeleton h-44 rounded-[1.6rem]" />
          </div>
        </section>
      </div>
    </main>
  );
}
