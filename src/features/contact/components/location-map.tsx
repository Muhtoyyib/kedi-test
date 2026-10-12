import {useState} from "react";
import {Clock, MapPin} from "lucide-react";
import {getSettings} from "@/lib/catalog/settings";
import {siteConfig} from "@/lib/site-config";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";
import {Button} from "@/components/ui/button";

// contact/location-hours-map design: details left, map right. The map is a
// click-to-load facade — no Google request until "Show map" is tapped.
export function LocationMap() {
  const [showMap, setShowMap] = useState(false);
  const settings = getSettings();
  const {address} = siteConfig;
  const encoded = encodeURIComponent(address.mapsQuery);
  return (
    <SiteSection aria-labelledby="visit-heading">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <SectionHeader title="Visit us" />
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
          <p className="mt-4 text-base text-text-body">Pick up your order or come to an in-person seminar.</p>
          <Button
            variant="secondary"
            className="mt-5"
            href={`https://www.google.com/maps/search/?api=1&query=${encoded}`}
            target="_blank"
            rel="noopener"
          >
            Get directions
          </Button>
        </div>
        <div className="rounded-panel bg-brand-soft aspect-[4/3] overflow-hidden">
          {showMap ? (
            <iframe
              src={`https://www.google.com/maps?q=${encoded}&output=embed`}
              title={`Map showing ${siteConfig.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="size-full border-0"
            />
          ) : (
            <MapFacade onShow={() => setShowMap(true)} />
          )}
        </div>
      </div>
    </SiteSection>
  );
}

function MapFacade({onShow}: {onShow: () => void}) {
  const settings = getSettings();
  const {address} = siteConfig;
  return (
    <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center">
      <MapPin className="size-8 text-brand-strong" aria-hidden="true" />
      <p className="max-w-xs text-base text-text-body">{settings.pickupAddress || `${address.street}, ${address.city}`}</p>
      <Button variant="primary" size="sm" onClick={onShow}>
        Show map
      </Button>
    </div>
  );
}
