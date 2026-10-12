import type {ReactNode} from "react";
import {Mail, Phone} from "lucide-react";
import {cn} from "cn";
import {track} from "@/lib/analytics/track";
import {getSocialLinks} from "@/lib/socials";
import {siteConfig} from "@/lib/site-config";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {SocialIcon} from "@/components/ui/social-icons";
import {WhatsAppIcon} from "@/components/ui/whatsapp-icon";

interface ChannelCardProps {
  icon: ReactNode;
  title: string;
  line: string;
  note?: string;
  action: ReactNode;
  whatsapp?: boolean;
}

function ChannelCard({icon, title, line, note, action, whatsapp}: ChannelCardProps) {
  return (
    <Card className={cn("p-6", whatsapp && "border-2 border-whatsapp")}>
      <span
        className={cn(
          "flex size-11 items-center justify-center rounded-full",
          whatsapp ? "bg-whatsapp text-whatsapp-ink" : "bg-brand-soft text-brand-strong"
        )}
      >
        {icon}
      </span>
      <h2 className="mt-4 text-h3 text-text-heading">{title}</h2>
      <p className="mt-1 text-base text-text-body">{line}</p>
      {note ? <p className="mt-1 text-sm text-text-muted">{note}</p> : null}
      <div className="mt-4">{action}</div>
    </Card>
  );
}

function SocialsRow() {
  const socials = getSocialLinks();
  const channel = siteConfig.socials.whatsappChannel;
  const links = channel.startsWith("http")
    ? [...socials, {network: "whatsapp-channel" as const, href: channel, label: `${siteConfig.name} WhatsApp Channel`}]
    : socials;
  if (links.length === 0) return null;
  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold tracking-wide text-text-muted uppercase">Follow us</h2>
      <ul className="mt-3 flex gap-2">
        {links.map((s) => (
          <li key={s.network}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener"
              aria-label={s.label}
              className="flex size-11 items-center justify-center rounded-full bg-canvas text-text-body transition-colors hover:bg-brand-soft hover:text-brand-strong"
            >
              {s.network === "whatsapp-channel" ? <WhatsAppIcon size={20} /> : <SocialIcon network={s.network} />}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WhatsAppAction() {
  return (
    <Button
      variant="whatsapp"
      fullWidth
      href={buildWhatsAppLink(generalChatMessage())}
      target="_blank"
      rel="noopener"
      onClick={() => track({event: "whatsapp_chat_click", location: "contact"})}
    >
      Start a chat
    </Button>
  );
}

function CallAction() {
  return (
    <Button
      variant="secondary"
      fullWidth
      href={`tel:${siteConfig.phone.number}`}
      onClick={() => track({event: "phone_click", location: "contact"})}
    >
      Call now
    </Button>
  );
}

// contact/contact-methods design: WhatsApp first, then call and email, then
// socials. Unconfigured social links are filtered by getSocialLinks().
export function ContactMethods() {
  return (
    <SiteSection tone="brand-soft" spacing="tight">
      <SectionHeader
        as="h1"
        eyebrow="Contact"
        title="We're here to help"
        description="The fastest way to reach us is WhatsApp. We usually reply within 1 hour during opening hours."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <ChannelCard
          whatsapp
          icon={<WhatsAppIcon size={22} />}
          title="Chat on WhatsApp"
          line={siteConfig.whatsapp.display}
          action={<WhatsAppAction />}
        />
        <ChannelCard
          icon={<Phone className="size-5" aria-hidden="true" />}
          title="Call us"
          line={siteConfig.phone.display}
          action={<CallAction />}
        />
        <ChannelCard
          icon={<Mail className="size-5" aria-hidden="true" />}
          title="Email us"
          line={siteConfig.email}
          note="We reply within one working day."
          action={
            <Button variant="secondary" fullWidth href={`mailto:${siteConfig.email}`}>
              Send an email
            </Button>
          }
        />
      </div>
      <SocialsRow />
    </SiteSection>
  );
}
