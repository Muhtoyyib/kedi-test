import {getAbout} from "@/lib/content/about";
import {siteConfig} from "@/lib/site-config";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";
import {SunArc} from "@/components/marketing/sun-arc";

// /about hero — photo left on md+, story paragraphs from content/about.ts
// (about/story spec). Years of experience only when the client supplied it.
export function AboutStory() {
  const {distributor} = getAbout();
  const years = distributor.yearsOfExperience;
  return (
    <SiteSection tone="brand-soft">
      <div className="grid items-start gap-8 md:grid-cols-2">
        <div className="relative max-w-md md:max-w-none">
          <SunArc size="none" className="absolute -bottom-6 left-1/2 w-[85%] -translate-x-1/2" />
          {distributor.photo ? (
            <img
              src={distributor.photo}
              alt={distributor.photoAlt}
              width={720}
              height={900}
              className="relative aspect-4/5 max-h-[60vh] w-full rounded-panel object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="relative flex aspect-4/5 max-h-[60vh] w-full items-center justify-center rounded-panel bg-surface"
            >
              <span className="text-4xl font-extrabold text-brand-strong">{distributor.name[0] ?? "K"}</span>
            </div>
          )}
        </div>
        <div>
          <SectionHeader as="h1" eyebrow="About us" title={`Hi, I'm ${distributor.firstName}`} />
          <p className="mt-4 font-semibold text-brand-strong">
            Independent KEDI Distributor in {siteConfig.city}
            {years ? ` · ${years} years' experience` : ""}
          </p>
          {distributor.story.map((paragraph, i) => (
            <p key={i} className={i === 0 ? "mt-6 text-lead text-text-body" : "mt-4 text-base text-text-body"}>
              {paragraph}
            </p>
          ))}
          <p className="mt-6 font-semibold text-ink">
            {distributor.name}, founder of {siteConfig.name}
          </p>
        </div>
      </div>
    </SiteSection>
  );
}
