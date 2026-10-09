// Conditions that block a production deploy (see the platform/build-and-deploy
// spec). Pure function so every failing condition is unit-testable; the entry
// script in scripts/assert-production-ready.ts only gathers the inputs.

export interface ReadinessInput {
  catalogSource: string | null;
  siteConfigSource: string;
  siteUrl: string | undefined;
}

const PLACEHOLDER = /\[[A-Za-z0-9+][^\]]*\]/;

export function checkProductionReadiness(input: ReadinessInput): string[] {
  const failures: string[] = [];

  if (input.catalogSource !== "live") {
    failures.push(
      "src/generated/catalog.json is missing, unreadable, or built from the development fixture — run catalog:fetch against the live Sheet"
    );
  }

  const placeholder = input.siteConfigSource.match(PLACEHOLDER);
  if (placeholder) {
    failures.push(`src/lib/site-config.ts still contains a placeholder: ${placeholder[0]}`);
  }

  if (!input.siteUrl?.startsWith("https://")) {
    failures.push("VITE_SITE_URL is unset or is not an https:// URL");
  }

  return failures;
}
