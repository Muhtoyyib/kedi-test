import {useSyncExternalStore} from "react";

// True after hydration; the prerendered HTML and the first client render
// both see false, so nothing that depends on localStorage can flash.
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
