import type {ReactNode} from "react";
import {cn} from "cn";

// Article typography; the styles live in the `.prose` layer in app.css.
export function Prose({children, className}: {children: ReactNode; className?: string}) {
  return <div className={cn("prose", className)}>{children}</div>;
}
