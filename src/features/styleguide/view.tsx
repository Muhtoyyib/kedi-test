import {Accordion} from "@/components/ui/accordion";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Disclaimer} from "@/components/ui/disclaimer";
import {Field} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Notice} from "@/components/ui/notice";
import {PhoneInput} from "@/components/ui/phone-input";
import {Price} from "@/components/ui/price";
import {Select} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {ToastProvider} from "@/components/ui/toast";
import {VideoEmbed} from "@/components/ui/video-embed";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";
import {SunArc} from "@/components/marketing/sun-arc";
import {ChipDemo, DrawerDemo, ToastDemo} from "./demos";

// Class names are listed literally so Tailwind can see them.
const swatches = [
  ["brand", "bg-brand", "#317ABE"],
  ["brand-hover", "bg-brand-hover", "#2A68A3"],
  ["brand-strong", "bg-brand-strong", "#245C91"],
  ["brand-soft", "bg-brand-soft", "#E8F1FA"],
  ["brand-muted", "bg-brand-muted", "#8FC1EE"],
  ["sun", "bg-sun", "#F4E028"],
  ["sun-hover", "bg-sun-hover", "#E3CF14"],
  ["sun-soft", "bg-sun-soft", "#FDF8D6"],
  ["sun-ink", "bg-sun-ink", "#7A5C00"],
  ["ink", "bg-ink", "#0F2A47"],
  ["leaf", "bg-leaf", "#6FC73B"],
  ["leaf-strong", "bg-leaf-strong", "#2F6F14"],
  ["leaf-soft", "bg-leaf-soft", "#EEF7E6"],
  ["danger", "bg-danger", "#B42318"],
  ["danger-soft", "bg-danger-soft", "#FEF3F2"],
  ["whatsapp", "bg-whatsapp", "#25D366"],
  ["whatsapp-hover", "bg-whatsapp-hover", "#1EBE5A"],
  ["whatsapp-ink", "bg-whatsapp-ink", "#0B2E1A"],
  ["canvas", "bg-canvas", "#FFFFFF"],
  ["surface", "bg-surface", "#F7F9FC"],
  ["line", "bg-line", "#E3E8EF"],
  ["line-strong", "bg-line-strong", "#CBD5E1"],
  ["text-heading", "bg-text-heading", "#0F2A47"],
  ["text-body", "bg-text-body", "#4A5A6A"],
  ["text-muted", "bg-text-muted", "#5D6B78"],
] as const;

const steps = [
  ["display", "text-display md:text-display-md"],
  ["h1", "text-h1 md:text-h1-md"],
  ["h2", "text-h2 md:text-h2-md"],
  ["h3", "text-h3 md:text-h3-md"],
  ["lead", "text-lead md:text-lead-md"],
  ["base", "text-base"],
  ["sm", "text-sm"],
  ["eyebrow", "text-eyebrow"],
  ["price", "text-price md:text-price-md"],
] as const;

export function StyleguidePage() {
  return (
    <ToastProvider>
      <SiteSection spacing="tight">
        <SectionHeader
          as="h1"
          eyebrow="Reference"
          title="Design system style guide"
          description="Tokens and primitives — development only."
        />
      </SiteSection>
      <ColourSection />
      <TypeSection />
      <ButtonsSection />
      <FieldsSection />
      <BadgesSection />
      <InteractiveSection />
      <DisclaimersSection />
    </ToastProvider>
  );
}

function ColourSection() {
  return (
    <SiteSection spacing="tight">
      <SectionHeader title="Colours" />
      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {swatches.map(([name, swatchClass, hex]) => (
          <li key={name} className="text-sm">
            <span className={`block h-14 rounded-field border border-line ${swatchClass}`} />
            <span className="mt-1 block font-semibold text-ink">{name}</span>
            <span className="text-text-muted">{hex}</span>
          </li>
        ))}
      </ul>
    </SiteSection>
  );
}

function TypeSection() {
  return (
    <SiteSection spacing="tight" tone="surface">
      <SectionHeader title="Type scale" />
      <div className="mt-8 flex flex-col gap-4">
        {steps.map(([step, stepClass]) => (
          <p key={step} className={`${stepClass} text-ink`}>
            text-{step} — Wellness made simple
          </p>
        ))}
      </div>
    </SiteSection>
  );
}

function ButtonsSection() {
  return (
    <SiteSection spacing="tight">
      <SectionHeader title="Buttons" />
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="whatsapp">Chat on WhatsApp</Button>
        <Button variant="sun">Sun</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button loading>Sending</Button>
        <Button disabled>Disabled</Button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    </SiteSection>
  );
}

function FieldsSection() {
  return (
    <SiteSection spacing="tight" tone="surface">
      <SectionHeader title="Form fields" />
      <div className="mt-8 grid max-w-xl gap-6">
        <Field id="sg-name" label="Full name" required hint="As it appears on WhatsApp">
          <Input placeholder="e.g. Amaka Obi" />
        </Field>
        <Field id="sg-phone" label="Phone number" error="Enter a Nigerian mobile number, e.g. 0803 123 4567">
          <PhoneInput defaultValue="12345" />
        </Field>
        <Field id="sg-area" label="Delivery area">
          <Select>
            <option>Ikeja</option>
            <option>Lekki</option>
          </Select>
        </Field>
        <Field id="sg-note" label="Note">
          <Textarea placeholder="Anything we should know?" />
        </Field>
        <Checkbox id="sg-consent" label="I agree that we can contact you on WhatsApp about your request." />
      </div>
    </SiteSection>
  );
}

function BadgesSection() {
  return (
    <SiteSection spacing="tight">
      <SectionHeader title="Badges, prices and notices" />
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Badge>Neutral</Badge>
        <Badge variant="brand">Brand</Badge>
        <Badge variant="stock">In stock</Badge>
        <Badge variant="out">Out of stock</Badge>
        <Badge variant="offer">Seminar offer</Badge>
        <Price amountNgn={18500} />
        <Price amountNgn={null} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Notice tone="info" title="Info">
          General information panel.
        </Notice>
        <Notice tone="sun" title="Payment safety">
          Pay only to our official account.
        </Notice>
        <Notice tone="success" title="Success">
          Your order was sent.
        </Notice>
        <Notice tone="danger" title="Error">
          Something needs your attention.
        </Notice>
      </div>
    </SiteSection>
  );
}

function InteractiveSection() {
  return (
    <SiteSection spacing="tight" tone="surface">
      <SectionHeader title="Interactive" />
      <div className="mt-8 flex flex-col gap-8">
        <ChipDemo />
        <Accordion
          group="sg"
          items={[
            {question: "Are your products genuine?", answer: "Sourced through KEDI's official channel."},
            {question: "How do I order?", answer: "Add to cart and send the order on WhatsApp."},
          ]}
        />
        <div className="flex gap-3">
          <DrawerDemo />
          <ToastDemo />
        </div>
        <VideoEmbed provider="youtube" id="dQw4w9WgXcQ" title="Fixture seminar clip" location="styleguide" />
      </div>
    </SiteSection>
  );
}

function DisclaimersSection() {
  return (
    <SiteSection spacing="tight">
      <SectionHeader title="Disclaimers" />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Disclaimer kind="health" />
        <Disclaimer kind="earnings" />
      </div>
      <SunArc className="mt-10" />
    </SiteSection>
  );
}
