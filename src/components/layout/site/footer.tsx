import {Clock, Mail, MapPin, Phone} from "lucide-react";
import {track} from "@/lib/analytics/track";
import {getCategories} from "@/lib/catalog/categories";
import {getSettings} from "@/lib/catalog/settings";
import {clearConsent} from "@/lib/consent";
import {footerColumns} from "@/lib/site-nav";
import {siteConfig} from "@/lib/site-config";
import {markShellActivity} from "@/lib/shell-activity";
import {getSocialLinks} from "@/lib/socials";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {Button} from "@/components/ui/button";
import {SocialIcon} from "@/components/ui/social-icons";
import {BrandLockup} from "./brand-lockup";

const linkClass = "inline-block py-1 text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline";
const colTitle = "text-eyebrow font-bold tracking-[0.12em] text-sun uppercase";

function TopBlock() {
  return (
    <div className="flex flex-col gap-4 lg:col-span-4">
      <BrandLockup inverse />
      <p className="max-w-xs text-white/80">
        Genuine KEDI products, real guidance and follow-up you can count on — in {siteConfig.city} and beyond.
      </p>
      <div>
        <Button
          href={buildWhatsAppLink(generalChatMessage())}
          variant="whatsapp"
          onClick={() => {
            markShellActivity();
            track({event: "whatsapp_chat_click", location: "footer"});
          }}
        >
          Chat on WhatsApp
        </Button>
      </div>
    </div>
  );
}

function LinkColumns() {
  const categories = getCategories();
  return (
    <>
      <div>
        <h3 className={colTitle}>Shop</h3>
        <ul className="mt-3 space-y-1">
          {categories.map((c) => (
            <li key={c.slug}>
              <a className={linkClass} href={`/shop/${c.slug}`}>
                {c.name}
              </a>
            </li>
          ))}
          <li>
            <a className={linkClass} href="/shop">
              All products
            </a>
          </li>
        </ul>
      </div>
      {footerColumns.map((col) => (
        <div key={col.title}>
          <h3 className={colTitle}>{col.title}</h3>
          <ul className="mt-3 space-y-1">
            {col.links.map((link) => (
              <li key={link.href}>
                <a className={linkClass} href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
            {col.title === "Legal" ? (
              <li>
                <button type="button" className={linkClass} onClick={() => clearConsent(window.localStorage)}>
                  Cookie settings
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      ))}
    </>
  );
}

function ContactBlock() {
  const {openingHours} = getSettings();
  const {address} = siteConfig;
  const item = "flex items-center gap-3 text-white/85";
  return (
    <div className="mt-10 grid gap-3 text-sm">
      <p className={item}>
        <MapPin className="size-4 shrink-0 text-sun" aria-hidden="true" />
        {[address.street, address.city, address.state].filter(Boolean).join(", ")}
      </p>
      {openingHours ? (
        <p className={item}>
          <Clock className="size-4 shrink-0 text-sun" aria-hidden="true" />
          {openingHours}
        </p>
      ) : null}
      <p className={item}>
        <Phone className="size-4 shrink-0 text-sun" aria-hidden="true" />
        <a
          href={`tel:${siteConfig.phone.number}`}
          className="underline-offset-4 hover:underline"
          onClick={() => track({event: "phone_click", location: "footer"})}
        >
          {siteConfig.phone.display}
        </a>
      </p>
      <p className={item}>
        <Mail className="size-4 shrink-0 text-sun" aria-hidden="true" />
        <a href={`mailto:${siteConfig.email}`} className="underline-offset-4 hover:underline">
          {siteConfig.email}
        </a>
      </p>
      <div className="mt-1 flex gap-1">
        {getSocialLinks().map((s) => (
          <a
            key={s.network}
            href={s.href}
            target="_blank"
            rel="noopener"
            aria-label={s.label}
            onClick={() => track({event: "outbound_social", network: s.network})}
            className="flex size-11 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            <SocialIcon network={s.network} />
          </a>
        ))}
      </div>
    </div>
  );
}

// Legitimacy + legal footer on every page (sections/04-footer). The exact
// independent-distributor statement and short disclaimer are compliance
// copy — do not paraphrase.
export function SiteFooter() {
  return (
    <footer className="bg-ink pt-14 pb-28 text-white/90 md:pb-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-12">
          <TopBlock />
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-8">
            <LinkColumns />
          </nav>
        </div>
        <ContactBlock />
        <div className="mt-10 space-y-2 border-t border-white/15 pt-6 text-sm text-white/70">
          <p>{siteConfig.name} is an independent distributor of KEDI Healthcare products and is not the official KEDI company.</p>
          <p>
            Food supplements are not medicines. Not intended to diagnose, treat, cure or prevent any disease.{" "}
            <a href="/health-disclaimer" className="underline underline-offset-4 hover:text-white">
              Full disclaimer
            </a>
          </p>
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
