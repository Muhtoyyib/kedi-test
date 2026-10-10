// Custom client entry (configured via tanstackStart `client.entry`).
//
// This site is fully static — no server functions, no route loaders, no
// dehydrated data — so it hydrates the router directly instead of going
// through StartClient's seroval deserialization path. That keeps ~15 KB
// (gzip) of serialization code out of the entry bundle.

import {StrictMode, startTransition} from "react";
import {hydrateRoot} from "react-dom/client";
import {RouterProvider} from "@tanstack/react-router";
import {getRouter} from "./router";

const router = getRouter();

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
  // Signal hydration done so the prerender's $_TSR bootstrap cleans itself up.
  (window as {$_TSR?: {h?: () => void}}).$_TSR?.h?.();
});
