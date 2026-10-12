import {NotFoundView} from "@/features/not-found/view";

// Router default + /404 route entry point (system-pages design lives in
// features/not-found).
export function NotFound() {
  return <NotFoundView />;
}
