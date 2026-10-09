import {cn} from "cn";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}

const titleClasses = {
  h1: "text-h1 font-extrabold md:text-h1-md",
  h2: "text-h2 font-bold md:text-h2-md",
} as const;

export function SectionHeader({eyebrow, title, description, align = "left", as = "h2", className}: SectionHeaderProps) {
  const TitleTag = as;
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 text-eyebrow font-bold tracking-[0.12em] text-brand-strong uppercase">
          <span className="size-2 rounded-full bg-sun" aria-hidden="true" />
          {eyebrow}
        </span>
      ) : null}
      <TitleTag className={cn("mt-3 text-balance text-text-heading", titleClasses[as])}>{title}</TitleTag>
      {description ? <p className="mt-4 text-lead text-text-body md:text-lead-md">{description}</p> : null}
    </div>
  );
}
