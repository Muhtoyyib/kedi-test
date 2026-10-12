import {Clock, MapPin} from "lucide-react";
import {getSettings} from "@/lib/catalog/settings";
import {siteConfig} from "@/lib/site-config";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

// Address, hours and service areas (about/location-and-service-areas spec).
// No map embed here — Contact owns that.
export function AboutLocation() {
  const settings = getSettings();
  const {address, serviceAreas} = siteConfig;
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.mapsQuery)}`;
  return (
    <SiteSection tone="surface" aria-labelledby="location-heading">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <SectionHeader title="Where to find us" />
          <ul className="mt-6 space-y-3 text-base text-text-body">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-brand-strong" aria-hidden="true" />
              {settings.pickupAddress || `${address.street}, ${address.city}`}
            </li>
            {settings.openingHours ? (
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-brand-strong" aria-hidden="true" />
                {settings.openingHours}
              </li>
            ) : null}
          </ul>
          <p className="mt-4 text-base text-text-body">Pick up your order from us or have it delivered.</p>
          <Button variant="secondary" size="sm" href={directions} target="_blank" rel="noopener" className="mt-5">
            Get directions
          </Button>
        </div>
        <div>
          <h3 className="text-h3 text-text-heading">We deliver to</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {serviceAreas.map((area) => (
              <li key={area}>
                <Badge variant="neutral">{area}</Badge>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-base text-text-body">Interstate delivery by courier across Nigeria.</p>
          <Button variant="link" href="/delivery-and-returns" className="mt-2 px-0">
            See delivery fees and times
          </Button>
        </div>
      </div>
    </SiteSection>
  );
}
