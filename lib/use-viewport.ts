import { useCallback, useEffect, useRef, useSyncExternalStore, type RefObject } from 'react';

const subscribe = (cb: () => void) => {
  addEventListener('resize', cb);
  return () => removeEventListener('resize', cb);
};

/**
 * A value derived from the viewport width. Re-renders only when the derived value changes,
 * and returns `fallback` during SSR and hydration (desktop first). `select` must return a primitive.
 */
export function useViewport<T extends string | number | boolean>(select: (width: number) => T, fallback: T) {
  return useSyncExternalStore(
    subscribe,
    () => select(innerWidth),
    () => fallback
  );
}

const noSubscribe = () => () => {};

/** False in the server HTML and during hydration, true once the client has taken over. */
export function useHydrated() {
  return useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false
  );
}

/** True while the viewport is narrower than `px`. Always false during SSR (desktop first). */
export function useNarrowerThan(px: number) {
  return useViewport(w => w < px, false);
}

/** The design's single layout breakpoint: below this the nav collapses to the menu button. */
export const MOBILE_BP = 900;

/** Phones tall enough to pin a step-through section to one screen (landscape phones scroll normally). Mirrored in globals.css. */
export const PIN_STEPS_QUERY = '(max-width: 899.98px) and (min-height: 600px)';

/** Whether a CSS media query matches; `fallback` during SSR and hydration. */
export function useMediaQuery(query: string, fallback = false) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mql = matchMedia(query);
      mql.addEventListener('change', cb);
      return () => mql.removeEventListener('change', cb);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => matchMedia(query).matches,
    () => fallback
  );
}

/**
 * Pinned step-through: while `enabled`, maps scroll progress through `trackRef` (a tall wrapper whose child is
 * sticky) to a step index 0…count-1 and reports each change to `onStep`.
 */
export function usePinnedStep(trackRef: RefObject<HTMLElement | null>, count: number, enabled: boolean, onStep: (index: number) => void) {
  const onStepRef = useRef(onStep);
  useEffect(() => {
    onStepRef.current = onStep;
  });

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let last = -1;
    const tick = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      const i = Math.min(count - 1, Math.floor(p * count));
      if (i !== last) {
        last = i;
        onStepRef.current(i);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  }, [trackRef, count, enabled]);
}
