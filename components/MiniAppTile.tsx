import Link from "next/link";

type Props = {
  href: string;
  title: string;
  description: string;
  emoji: string;
  status?: "ready" | "coming-soon";
};

export function MiniAppTile({
  href,
  title,
  description,
  emoji,
  status = "ready",
}: Props) {
  const isComingSoon = status === "coming-soon";

  const className =
    "group relative flex h-full flex-col gap-4 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition active:scale-[0.98] dark:bg-slate-900 dark:ring-slate-800 " +
    (isComingSoon
      ? "opacity-60 cursor-not-allowed"
      : "hover:shadow-md hover:ring-slate-300 dark:hover:ring-slate-700");

  const inner = (
    <>
      <div className="text-6xl">{emoji}</div>
      <div className="flex flex-1 flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-base text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>
      {isComingSoon ? (
        <span className="inline-flex w-fit items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
          Coming soon
        </span>
      ) : (
        <span className="inline-flex w-fit items-center text-base font-medium text-blue-600 dark:text-blue-400">
          Open →
        </span>
      )}
    </>
  );

  if (isComingSoon) {
    return (
      <div className={className} aria-disabled="true">
        {inner}
      </div>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
