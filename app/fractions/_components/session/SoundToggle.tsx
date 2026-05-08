'use client';

import { useEffect, useState } from 'react';
import { readSettings, writeSettings } from '../../_lib/storage/progress';

export function SoundToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(readSettings().soundEnabled);
  }, []);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    writeSettings({ soundEnabled: next });
  }

  return (
    <button
      onClick={toggle}
      className="min-h-[44px] px-4 rounded-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium active:scale-[0.98] transition flex items-center gap-2"
      aria-label={enabled ? 'Disable sound' : 'Enable sound'}
      aria-pressed={enabled}
    >
      <span aria-hidden="true">{enabled ? '🔊' : '🔇'}</span>
      <span>{enabled ? 'Sound on' : 'Sound off'}</span>
    </button>
  );
}
