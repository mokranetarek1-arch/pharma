"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="max-w-lg rounded-[2rem] border border-white/20 bg-white/10 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-red-200">Erreur</p>
        <h1 className="mt-4 text-3xl font-semibold">Une erreur est survenue.</h1>
        <p className="mt-4 text-sm leading-6 text-slate-100">{error.message}</p>
        <button onClick={reset} className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
          Reessayer
        </button>
      </div>
    </div>
  );
}
