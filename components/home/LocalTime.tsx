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

/** Live HH:MM in the given IANA zone. Renders empty on the server so the markup never mismatches. */
export default function LocalTime({ timeZone, color }: { timeZone: string; color: string }) {
  const tick = useSyncExternalStore(subscribe, getTick, getServerTick);

  let time = '';
  if (tick !== null) {
    try {
      time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone }).format(tick * TICK_MS);
    } catch {}
  }

  return <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: "13px", color }}>{time}</span>;
}
