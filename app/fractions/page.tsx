import Link from "next/link";

export default function FractionsPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl text-center">
        <div className="text-7xl">🍕</div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
          Fractions Practice
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Coming soon.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center rounded-full bg-slate-900 px-6 py-3 text-base font-medium text-white shadow-sm transition active:scale-[0.98] hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          ← Back home
        </Link>
      </div>
    </main>
  );
}
