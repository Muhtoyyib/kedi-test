import {useEffect, useRef} from "react";
import {CheckCircle2} from "lucide-react";
import {StepList} from "@/components/marketing/step-list";
import {Button, type ButtonVariant} from "@/components/ui/button";
import {SocialIcon} from "@/components/ui/social-icons";
import {WhatsAppIcon} from "@/components/ui/whatsapp-icon";
import {siteConfig} from "@/lib/site-config";
import {getSocialLinks} from "@/lib/socials";

export interface ThankYouAction {
  label: string;
  href: string;
  variant: ButtonVariant;
}

export interface ThankYouLayoutProps {
  title: string;
  message: string;
  steps: {title: string}[];
  primary: ThankYouAction;
}

// Shared confirmation page (system-pages design): success icon, title focused
// on load for screen readers, "what happens next" steps, a next action, home
// link and a social follow row.
export function ThankYouLayout({title, message, steps, primary}: ThankYouLayoutProps) {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => h1Ref.current?.focus(), []);
  return (
    <section className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="mx-auto flex size-18 items-center justify-center rounded-full bg-leaf-soft">
        <CheckCircle2 className="size-9 text-leaf-strong" aria-hidden="true" />
      </div>
      <h1 ref={h1Ref} tabIndex={-1} className="text-h1 mt-6 text-text-heading">
        {title}
      </h1>
      <p className="text-lead mt-3 text-text-body">{message}</p>
      <div className="mt-10 text-left">
        <h2 className="text-lg font-semibold text-text-heading">What happens next</h2>
        <StepList steps={steps} className="mt-5" />
      </div>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button href={primary.href} variant={primary.variant}>
          {primary.label}
        </Button>
        <Button href="/" variant="secondary">
          Back to home
        </Button>
      </div>
      <FollowRow />
    </section>
  );
}

// Social icons + the WhatsApp Channel link — hidden until real profiles are
// configured (same guard as contact/footer).
function FollowRow() {
  const channel = siteConfig.socials.whatsappChannel;
  const links = channel.startsWith("http")
    ? [...getSocialLinks(), {network: "whatsapp-channel" as const, href: channel, label: `${siteConfig.name} WhatsApp Channel`}]
    : getSocialLinks();
  if (links.length === 0) return null;
  return (
    <div className="mt-12">
      <p className="text-sm font-semibold tracking-wide text-text-muted uppercase">Follow us for wellness tips</p>
      <ul className="mt-3 flex justify-center gap-2">
        {links.map((s) => (
          <li key={s.network}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener"
              aria-label={s.label}
              className="flex size-11 items-center justify-center rounded-full bg-surface text-text-body transition-colors hover:bg-brand-soft hover:text-brand-strong"
            >
              {s.network === "whatsapp-channel" ? <WhatsAppIcon size={20} /> : <SocialIcon network={s.network} />}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
