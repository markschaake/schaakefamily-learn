'use client';
import { readSettings } from '../../_lib/storage/progress';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;
  const Ctx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) return null;
  ctx = new Ctx();
  return ctx;
}

/** Plays a short, soft sine-wave chime IFF soundEnabled. No-op otherwise. */
export function playChime(): void {
  if (typeof window === 'undefined') return;
  if (!readSettings().soundEnabled) return;
  try {
    const audio = getCtx();
    if (!audio) return;
    if (audio.state === 'suspended') { void audio.resume(); }
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880; // A5 — soft, not shrill
    gain.gain.setValueAtTime(0.12, audio.currentTime);
    gain.gain.linearRampToValueAtTime(0, audio.currentTime + 0.16);
    osc.connect(gain).connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + 0.16);
  } catch {
    // Audio failure must not interrupt a session.
  }
}
