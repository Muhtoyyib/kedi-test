import {useState} from "react";
import {track} from "@/lib/analytics/track";
import {submitForm} from "@/lib/forms/submit";
import {normalizeNigerianPhone} from "@/lib/phone";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {businessInterestMessage} from "@/lib/whatsapp/messages";
import {Button} from "@/components/ui/button";
import {ConsentField} from "@/components/ui/consent-field";
import {Disclaimer} from "@/components/ui/disclaimer";
import {Field} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Notice} from "@/components/ui/notice";
import {PhoneInput} from "@/components/ui/phone-input";
import {Select} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {VisuallyHidden} from "@/components/ui/visually-hidden";
import {SiteSection} from "@/components/marketing/site-section";

const OCCUPATIONS = ["Employed", "Self-employed / business owner", "Student", "Not currently working", "Retired", "Other"];

interface FormState {
  name: string;
  phone: string;
  location: string;
  occupation: string;
  message: string;
  consent: boolean;
  honeypot: string;
}

type Errors = Partial<Record<"name" | "phone" | "location" | "message" | "consent", string>>;

function validate(s: FormState): Errors {
  const errors: Errors = {};
  const name = s.name.trim();
  const location = s.location.trim();
  if (name.length < 2 || name.length > 60) errors.name = "Enter your name";
  if (!normalizeNigerianPhone(s.phone)) errors.phone = "Enter a Nigerian mobile number, e.g. 0803 123 4567";
  if (location.length < 2 || location.length > 60) errors.location = "Tell us where you're based";
  if (s.message.length > 500) errors.message = "Keep it under 500 characters";
  if (!s.consent) errors.consent = "Please tick to agree so we can message you";
  return errors;
}

function useInterestForm(onSuccess: () => void) {
  const [state, setState] = useState<FormState>({
    name: "",
    phone: "",
    location: "",
    occupation: "",
    message: "",
    consent: false,
    honeypot: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const set = (patch: Partial<FormState>) => setState((s) => ({...s, ...patch}));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(state);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      track({event: "form_error", form_id: "business_interest", reason: "validation"});
      return;
    }
    // Bots fill the hidden field — drop silently, show the success path.
    if (state.honeypot) return onSuccess();
    setSubmitting(true);
    void submitForm("business_interest", {
      name: state.name.trim(),
      phone: normalizeNigerianPhone(state.phone)!,
      location: state.location.trim(),
      occupation: state.occupation,
      message: state.message.trim(),
      consent: true,
    }).then((result) => {
      setSubmitting(false);
      if (!result.ok) {
        const reason = result.code === "rate_limited" ? "rate_limited" : result.code === "network" ? "network" : "server";
        track({event: "form_error", form_id: "business_interest", reason});
        return setFailure(reason);
      }
      track({event: "form_submit", form_id: "business_interest"});
      onSuccess();
    });
  };
  return {state, set, errors, submitting, failure, onSubmit};
}

function FailureNotice({failure}: {failure: string}) {
  const rateLimited = failure === "rate_limited";
  return (
    <Notice tone="danger">
      {rateLimited
        ? "You've sent this a few times already. We'll be in touch, or message us on WhatsApp."
        : "Something went wrong. Please try again, or"}{" "}
      {!rateLimited && (
        <a href={buildWhatsAppLink(businessInterestMessage())} target="_blank" rel="noopener" className="font-semibold underline">
          message us on WhatsApp
        </a>
      )}
      .
    </Notice>
  );
}

const defaultOnSuccess = () => window.location.assign("/thank-you/business");

function FormFields({state, set, errors}: {state: FormState; set: (p: Partial<FormState>) => void; errors: Errors}) {
  return (
    <>
      <Field id="bi-name" label="Full name" required error={errors.name}>
        <Input value={state.name} onChange={(e) => set({name: e.target.value})} autoComplete="name" maxLength={80} />
      </Field>
      <Field id="bi-phone" label="WhatsApp number" required error={errors.phone}>
        <PhoneInput value={state.phone} onChange={(e) => set({phone: e.target.value})} autoComplete="tel-national" inputMode="tel" />
      </Field>
      <Field id="bi-location" label="City / area" required error={errors.location}>
        <Input value={state.location} onChange={(e) => set({location: e.target.value})} autoComplete="address-level2" maxLength={80} />
      </Field>
      <Field id="bi-occupation" label="Current occupation">
        <Select value={state.occupation} onChange={(e) => set({occupation: e.target.value})}>
          <option value="">Choose one (optional)</option>
          {OCCUPATIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
      </Field>
      <Field id="bi-message" label="What would you like to know?" error={errors.message}>
        <Textarea value={state.message} onChange={(e) => set({message: e.target.value})} rows={3} maxLength={500} />
      </Field>
      <ConsentField id="bi-consent" checked={state.consent} error={errors.consent} onChange={(v) => set({consent: v})} />
      <VisuallyHidden>
        <label>
          Company
          <input name="company" value={state.honeypot} onChange={(e) => set({honeypot: e.target.value})} tabIndex={-1} autoComplete="off" />
        </label>
      </VisuallyHidden>
    </>
  );
}

// The business_interest lead form (business/interest-form spec). On success it
// goes to /thank-you/business — shipped with change 22, hence location.assign.
export function InterestForm({onSuccess = defaultOnSuccess}: {onSuccess?: () => void}) {
  const {state, set, errors, submitting, failure, onSubmit} = useInterestForm(onSuccess);
  return (
    <SiteSection tone="canvas" aria-labelledby="interest-heading">
      <div className="mx-auto max-w-xl scroll-mt-24 rounded-panel border border-line bg-surface p-6 md:p-8" id="interest">
        <h2 id="interest-heading" className="text-h2 text-text-heading">
          Register your interest
        </h2>
        <p className="mt-2 text-base text-text-muted">We'll message you on WhatsApp within one working day.</p>
        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
          <FormFields state={state} set={set} errors={errors} />
          {failure ? <FailureNotice failure={failure} /> : null}
          <Button type="submit" size="lg" fullWidth loading={submitting}>
            Register my interest
          </Button>
          <Disclaimer kind="earnings" />
        </form>
      </div>
    </SiteSection>
  );
}
