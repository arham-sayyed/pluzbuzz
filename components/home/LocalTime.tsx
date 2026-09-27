'use client';

import { useSyncExternalStore } from 'react';

const TICK_MS = 20000;

const subscribe = (cb: () => void) => {
  const clock = setInterval(cb, TICK_MS);
  return () => clearInterval(clock);
};
// Stable within each 20s window, so React only re-renders when the bucket changes.
const getTick = () => Math.floor(Date.now() / TICK_MS);
const getServerTick = () => null;

/** The current time in ms, refreshed every 20s; null on the server and during hydration. */
export function useClock() {
  const tick = useSyncExternalStore(subscribe, getTick, getServerTick);
  return tick === null ? null : tick * TICK_MS;
}

/** HH:MM in the given IANA zone, or '' before the clock is available. */
export function formatTime(now: number | null, timeZone: string) {
  if (now === null) return '';
  try {
    return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone }).format(now);
  } catch {
    return '';
  }
}

/** Live HH:MM in the given IANA zone. Renders empty on the server so the markup never mismatches. */
export default function LocalTime({ timeZone, color }: { timeZone: string; color: string }) {
  const time = formatTime(useClock(), timeZone);

  return <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "13px", color }}>{time}</span>;
}
