import {getAbout} from "@/lib/content/about";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";
import {SunArc} from "@/components/marketing/sun-arc";
import {Button} from "@/components/ui/button";
import {Disclaimer} from "@/components/ui/disclaimer";

function HeroPhoto() {
  const {host} = getAbout();
  return (
    <div className="relative mx-auto mt-8 w-full max-w-md md:mt-0 lg:max-w-xl">
      <SunArc size="none" className="absolute -bottom-6 left-1/2 w-[85%] -translate-x-1/2" />
      {host.photo ? (
        <img
          src={host.photo}
          alt={host.photoAlt}
          width={720}
          height={720}
          className="relative aspect-square w-full rounded-panel object-cover"
        />
      ) : (
        <div aria-hidden="true" className="relative flex aspect-square w-full items-center justify-center rounded-panel bg-surface">
          <span className="text-4xl font-extrabold text-brand-strong">{host.name[0] ?? "K"}</span>
        </div>
      )}
    </div>
  );
}

// /business-opportunity hero — honest framing, earnings disclaimer straight
// under the CTAs (business/hero spec). The photo slot takes the seminar host's
// photo when supplied; a branded placeholder otherwise.
export function BusinessHero() {
  return (
    <SiteSection tone="brand-soft">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <SectionHeader
            as="h1"
            eyebrow="Business opportunity"
            title="Build a wellness business with KEDI, with support"
            description="Interested in becoming an independent KEDI distributor? Learn how the programme works and how we support new distributors in our team: training, product knowledge and weekly seminars."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" href="#interest">
              Register your interest
            </Button>
            <Button variant="secondary" size="lg" href="/seminars">
              Attend the business session
            </Button>
          </div>
          <Disclaimer kind="earnings" className="mt-6" />
        </div>
        <HeroPhoto />
      </div>
    </SiteSection>
  );
}
