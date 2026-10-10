import {lazy, Suspense, useEffect, useSyncExternalStore} from "react";
import {cartDrawer} from "@/lib/cart/drawer-state";

// Drawer code only loads on first open (design: keep the drawer chunk out of
// the initial bundle). ?cart=open triggers the load on hydration.
const LazyCartDrawer = lazy(() => import("./cart-drawer").then((m) => ({default: m.CartDrawer})));

export function CartDrawerMount() {
  const open = useSyncExternalStore(cartDrawer.subscribe, cartDrawer.getSnapshot, cartDrawer.getServerSnapshot);
  const everOpened = useSyncExternalStore(cartDrawer.subscribe, cartDrawer.getEverOpened, () => false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("cart") === "open") cartDrawer.open();
  }, []);

  if (!everOpened) return null;
  return (
    <Suspense fallback={null}>
      <LazyCartDrawer open={open} />
    </Suspense>
  );
}
