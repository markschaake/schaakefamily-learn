import { MiniAppTile } from "@/components/MiniAppTile";

const apps = [
  {
    href: "/fractions",
    title: "Fractions Practice",
    description: "Visual fractions, number lines, and word problems.",
    emoji: "🍕",
    status: "ready" as const,
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12 sm:py-20">
      <div className="w-full max-w-5xl">
        <header className="mb-12 sm:mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Schaake Family Learning
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            Practice apps for homeschool.
          </p>
        </header>
        <section
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Mini apps"
        >
          {apps.map((app) => (
            <MiniAppTile key={app.href} {...app} />
          ))}
        </section>
      </div>
    </main>
  );
}
