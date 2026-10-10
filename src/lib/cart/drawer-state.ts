// Cart-drawer open state — shared by the header button, toast "View cart",
// ?cart=open on load and "Edit order" in the return banner. External store
// so non-React callers (toast action) can open it too.

let open = false;
let everOpened = false;
const listeners = new Set<() => void>();

function set(next: boolean): void {
  if (next) everOpened = true;
  if (open === next) return;
  open = next;
  for (const listener of listeners) listener();
}

export const cartDrawer = {
  open: () => set(true),
  close: () => set(false),
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => open,
  getServerSnapshot: () => false,
  /** Stays true after the first open so the lazy chunk is fetched once. */
  getEverOpened: () => everOpened,
};
