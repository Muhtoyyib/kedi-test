import {useState} from "react";
import {track} from "@/lib/analytics/track";
import {submitForm} from "@/lib/forms/submit";
import {normalizeNigerianPhone} from "@/lib/phone";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {SiteSection} from "@/components/marketing/site-section";
import {Button} from "@/components/ui/button";
import {ConsentField} from "@/components/ui/consent-field";
import {Field} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Notice} from "@/components/ui/notice";
import {PhoneInput} from "@/components/ui/phone-input";
import {Select} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {VisuallyHidden} from "@/components/ui/visually-hidden";

const TOPICS = ["Product question", "Order or delivery", "Seminars", "Becoming a distributor", "Something else"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  name: string;
  phone: string;
  email: string;
  topic: string;
  message: string;
  consent: boolean;
  honeypot: string;
}

type Errors = Partial<Record<"name" | "phone" | "email" | "message" | "consent", string>>;

function validate(s: FormState): Errors {
  const errors: Errors = {};
  const name = s.name.trim();
  if (name.length < 2 || name.length > 60) errors.name = "Enter your name";
  if (!normalizeNigerianPhone(s.phone)) errors.phone = "Enter a Nigerian mobile number, e.g. 0803 123 4567";
  if (s.email.trim() && !EMAIL_RE.test(s.email.trim())) errors.email = "Enter a valid email or leave it empty";
  const message = s.message.trim();
  if (message.length < 5 || message.length > 1000) errors.message = "Tell us a little more (at least 5 characters)";
  if (!s.consent) errors.consent = "Please tick to agree so we can reply";
  return errors;
}

function useContactForm(onSuccess: () => void) {
  const [state, setState] = useState<FormState>({name: "", phone: "", email: "", topic: "", message: "", consent: false, honeypot: ""});
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const set = (patch: Partial<FormState>) => setState((s) => ({...s, ...patch}));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(state);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      track({event: "form_error", form_id: "contact", reason: "validation"});
      return;
    }
    // Bots fill the hidden field — drop silently, show the success path.
    if (state.honeypot) return onSuccess();
    setSubmitting(true);
    void submitForm("contact", {
      name: state.name.trim(),
      phone: normalizeNigerianPhone(state.phone)!,
      email: state.email.trim(),
      location: state.topic,
      message: state.message.trim(),
      consent: true,
    }).then((result) => {
      setSubmitting(false);
      if (!result.ok) {
        const reason = result.code === "rate_limited" ? "rate_limited" : result.code === "network" ? "network" : "server";
        track({event: "form_error", form_id: "contact", reason});
        return setFailure(reason);
      }
      track({event: "form_submit", form_id: "contact"});
      onSuccess();
    });
  };
  return {state, set, errors, submitting, failure, onSubmit};
}

const defaultOnSuccess = () => window.location.assign("/thank-you/contact");

function FormFields({state, set, errors}: {state: FormState; set: (p: Partial<FormState>) => void; errors: Errors}) {
  return (
    <>
      <Field id="cf-name" label="Full name" required error={errors.name}>
        <Input value={state.name} onChange={(e) => set({name: e.target.value})} autoComplete="name" maxLength={80} />
      </Field>
      <Field id="cf-phone" label="WhatsApp number" required error={errors.phone}>
        <PhoneInput value={state.phone} onChange={(e) => set({phone: e.target.value})} autoComplete="tel-national" inputMode="tel" />
      </Field>
      <Field id="cf-email" label="Email" error={errors.email}>
        <Input type="email" value={state.email} onChange={(e) => set({email: e.target.value})} autoComplete="email" />
      </Field>
      <Field id="cf-topic" label="What's it about?">
        <Select value={state.topic} onChange={(e) => set({topic: e.target.value})}>
          <option value="">Choose one (optional)</option>
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </Field>
      <Field id="cf-message" label="Message" required error={errors.message}>
        <Textarea value={state.message} onChange={(e) => set({message: e.target.value})} rows={4} maxLength={1000} />
      </Field>
      <ConsentField id="cf-consent" checked={state.consent} error={errors.consent} onChange={(v) => set({consent: v})} />
      <VisuallyHidden>
        <label>
          Company
          <input name="company" value={state.honeypot} onChange={(e) => set({honeypot: e.target.value})} tabIndex={-1} autoComplete="off" />
        </label>
      </VisuallyHidden>
    </>
  );
}

// contact/contact-form design. On success → /thank-you/contact (shipped with
// change 22, hence location.assign).
export function ContactForm({onSuccess = defaultOnSuccess}: {onSuccess?: () => void}) {
  const {state, set, errors, submitting, failure, onSubmit} = useContactForm(onSuccess);
  return (
    <SiteSection tone="canvas" aria-labelledby="contact-form-heading">
      <div className="mx-auto max-w-xl rounded-panel border border-line bg-surface p-6 md:p-8">
        <h2 id="contact-form-heading" className="text-h2 text-text-heading">
          Send us a message
        </h2>
        <p className="mt-2 text-base text-text-muted">
          Prefer WhatsApp? It's faster:{" "}
          <a
            href={buildWhatsAppLink(generalChatMessage())}
            target="_blank"
            rel="noopener"
            className="font-semibold text-brand-strong underline underline-offset-2"
            onClick={() => track({event: "whatsapp_chat_click", location: "contact"})}
          >
            Chat now
          </a>
        </p>
        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
          <FormFields state={state} set={set} errors={errors} />
          {failure ? <FailureNotice failure={failure} /> : null}
          <Button type="submit" size="lg" fullWidth loading={submitting}>
            Send message
          </Button>
          <p className="text-sm text-text-muted">Please don't include medical details. For health concerns, speak to a doctor.</p>
        </form>
      </div>
    </SiteSection>
  );
}

function FailureNotice({failure}: {failure: string}) {
  const rateLimited = failure === "rate_limited";
  return (
    <Notice tone="danger">
      {rateLimited
        ? "You've sent this a few times already. We'll be in touch, or message us on WhatsApp."
        : "Something went wrong. Please try again, or"}{" "}
      {!rateLimited && (
        <a href={buildWhatsAppLink(generalChatMessage())} target="_blank" rel="noopener" className="font-semibold underline">
          message us on WhatsApp
        </a>
      )}
      .
    </Notice>
  );
}
