import Link from 'next/link';
import { SoundToggle } from './_components/session/SoundToggle';

export default function FractionsPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl text-center flex flex-col items-center gap-6">
        <div className="text-7xl" aria-hidden="true">
          🍕
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 dark:text-slate-100">
          Fractions Practice
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          A short, predictable 10-problem session.
        </p>
        <div className="flex flex-col items-center gap-4 mt-4">
          <Link
            href="/fractions/session"
            className="min-h-[44px] inline-flex items-center justify-center px-6 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium active:scale-[0.98] transition text-base"
          >
            Start
          </Link>
          <SoundToggle />
          <Link
            href="/"
            className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition text-sm"
          >
            ← Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
