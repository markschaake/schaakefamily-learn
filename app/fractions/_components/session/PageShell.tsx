import type { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center px-4 pb-12">
      <div className="w-full max-w-2xl">{children}</div>
    </main>
  );
}
