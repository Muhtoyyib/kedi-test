import {useState} from "react";
import {track} from "@/lib/analytics/track";
import {submitForm} from "@/lib/forms/submit";
import {normalizeNigerianPhone} from "@/lib/phone";
import {siteConfig} from "@/lib/site-config";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {seminarQuestionMessage} from "@/lib/whatsapp/messages";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Field} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Notice} from "@/components/ui/notice";
import {PhoneInput} from "@/components/ui/phone-input";
import {VisuallyHidden} from "@/components/ui/visually-hidden";

interface InterestFormProps {
  /** The seminar being registered for, or null for a general interest. */
  seminarId: string | null;
  /** Success destination — /thank-you/seminar ships with change 22. */
  onSuccess?: () => void;
}

const defaultOnSuccess = () => window.location.assign("/thank-you/seminar");

interface FormState {
  name: string;
  phone: string;
  consent: boolean;
  honeypot: string;
}

interface Errors {
  name?: string;
  phone?: string;
  consent?: string;
}

function validate(s: FormState): Errors {
  const errors: Errors = {};
  if (!s.name.trim()) errors.name = "Enter your name";
  if (!normalizeNigerianPhone(s.phone)) errors.phone = "Enter a Nigerian mobile number, e.g. 0803 123 4567";
  if (!s.consent) errors.consent = "Please tick to agree so we can message you";
  return errors;
}

function useInterestForm(seminarId: string | null, onSuccess: () => void) {
  const [state, setState] = useState<FormState>({name: "", phone: "", consent: false, honeypot: ""});
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);
  const set = (patch: Partial<FormState>) => setState((s) => ({...s, ...patch}));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(state);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    // Bots fill the hidden field — drop silently, show the success path.
    if (state.honeypot) return onSuccess();
    setSubmitting(true);
    void submitForm("seminar_interest", {
      name: state.name.trim(),
      phone: normalizeNigerianPhone(state.phone)!,
      seminarId: seminarId ?? "",
      consent: true,
    }).then((result) => {
      setSubmitting(false);
      if (!result.ok) return setFailed(true);
      track({event: "form_submit", form_id: "seminar_interest"});
      onSuccess();
    });
  };
  return {state, set, errors, submitting, failed, onSubmit};
}

function ConsentField({checked, error, onChange}: {checked: boolean; error?: string; onChange: (v: boolean) => void}) {
  return (
    <div>
      <Checkbox
        id="interest-consent"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-invalid={error ? true : undefined}
        label={
          <>
            I agree that {siteConfig.name} can contact me on WhatsApp or by phone about my request. I can opt out at any time by replying
            STOP.{" "}
            <a href="/privacy" className="font-semibold underline underline-offset-2">
              Privacy policy
            </a>
          </>
        }
      />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}

// Fallback when Luma has no event ID or the embed fails: records the
// visitor's interest in the Sheet, then sends them to the thank-you page.
export function SeminarInterestForm({seminarId, onSuccess = defaultOnSuccess}: InterestFormProps) {
  const {state, set, errors, submitting, failed, onSubmit} = useInterestForm(seminarId, onSuccess);
  return (
    <form onSubmit={onSubmit} noValidate className="rounded-panel border border-line bg-surface p-6">
      <h3 className="text-h3 text-text-heading">Leave your details and we'll register you</h3>
      <div className="mt-5 space-y-4">
        <Field id="interest-name" label="Name" required error={errors.name}>
          <Input value={state.name} onChange={(e) => set({name: e.target.value})} autoComplete="name" />
        </Field>
        <Field id="interest-phone" label="WhatsApp number" required error={errors.phone}>
          <PhoneInput value={state.phone} onChange={(e) => set({phone: e.target.value})} autoComplete="tel-national" inputMode="tel" />
        </Field>
        <ConsentField checked={state.consent} error={errors.consent} onChange={(v) => set({consent: v})} />
        <VisuallyHidden>
          <label>
            Company website
            <input
              name="company_website"
              value={state.honeypot}
              onChange={(e) => set({honeypot: e.target.value})}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </VisuallyHidden>
        {failed ? (
          <Notice tone="danger">
            Something went wrong. Please try again or{" "}
            <a href={buildWhatsAppLink(seminarQuestionMessage())} target="_blank" rel="noopener" className="font-semibold underline">
              message us on WhatsApp
            </a>
            .
          </Notice>
        ) : null}
        <Button variant="primary" type="submit" disabled={submitting} fullWidth>
          {submitting ? "Sending…" : "Send my details"}
        </Button>
      </div>
    </form>
  );
}
