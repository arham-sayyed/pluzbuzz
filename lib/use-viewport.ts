import { useSyncExternalStore } from 'react';

const subscribe = (cb: () => void) => {
  addEventListener('resize', cb);
  return () => removeEventListener('resize', cb);
};

/** True while the viewport is narrower than `px`. Always false during SSR (desktop first). */
export function useNarrowerThan(px: number) {
  return useSyncExternalStore(
    subscribe,
    () => innerWidth < px,
    () => false
  );
}

/** The design's single layout breakpoint: below this the nav collapses and pinned sections unpin. */
export const MOBILE_BP = 900;
