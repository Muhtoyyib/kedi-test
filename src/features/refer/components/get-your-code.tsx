import {useState, useSyncExternalStore} from "react";
import {track} from "@/lib/analytics/track";
import {getSettings} from "@/lib/catalog/settings";
import {normalizeNigerianPhone} from "@/lib/phone";
import {createReferralCode} from "@/lib/referral/code";
import {buildReferralLink} from "@/lib/referral/link";
import {clearMyReferral, MY_REFERRAL_KEY, parseMyReferral, saveMyReferral, type MyReferral} from "@/lib/referral/mine";
import {registerReferralCode} from "@/lib/referral/register";
import {SiteSection} from "@/components/marketing/site-section";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {ConsentField} from "@/components/ui/consent-field";
import {Field} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {PhoneInput} from "@/components/ui/phone-input";
import {VisuallyHidden} from "@/components/ui/visually-hidden";
import {SharePanel} from "./share-panel";

const NAME_RE = /^[\p{L}' -]{2,30}$/u;

type Register = typeof registerReferralCode;

interface GetYourCodeProps {
  /** Seam for tests — production uses the real helper. */
  register?: Register;
}

interface Errors {
  firstName?: string;
  phone?: string;
  consent?: string;
}

interface FormState {
  firstName: string;
  phone: string;
  consent: boolean;
  honeypot: string;
}

const EMPTY_FORM: FormState = {firstName: "", phone: "", consent: false, honeypot: ""};

// Snapshot is the raw stored string — stable across reads, so
// useSyncExternalStore doesn't loop on fresh objects.
const subscribe = () => () => {};
const readRaw = () => window.localStorage.getItem(MY_REFERRAL_KEY);
const readRawServer = () => null;

function useReferralCode(register: Register) {
  const raw = useSyncExternalStore(subscribe, readRaw, readRawServer);
  const stored = parseMyReferral(raw);
  const [created, setCreated] = useState<MyReferral | null>(null);
  const [cleared, setCleared] = useState(false);
  const mine = cleared ? null : (created ?? stored);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [saveFailed, setSaveFailed] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      track({event: "form_error", form_id: "referral_code", reason: "validation"});
      return;
    }
    const firstName = form.firstName.trim();
    const phone = normalizeNigerianPhone(form.phone)!;
    const code = createReferralCode(firstName, phone);
    const next = {firstName, code};
    setCreated(next);
    setCleared(false);
    if (!form.honeypot) {
      saveMyReferral(next);
      track({event: "referral_code_created"});
      track({event: "form_submit", form_id: "referral_code"});
      register({firstName, phone, code}, {onGiveUp: () => setSaveFailed(true)});
    }
  }

  function startAgain() {
    clearMyReferral();
    setCreated(null);
    setCleared(true);
    setSaveFailed(false);
    setForm(EMPTY_FORM);
  }

  return {mine, form, setForm, errors, saveFailed, onSubmit, startAgain};
}

// refer/get-your-code + share-panel — one client island. The code is shown
// instantly; registration is fire-and-forget and the failure note appears
// only if the POST and its retry both fail.
export function GetYourCode({register = registerReferralCode}: GetYourCodeProps) {
  const {mine, form, setForm, errors, saveFailed, onSubmit, startAgain} = useReferralCode(register);
  const friendReward = getSettings().referralFriendRewardText || "a welcome reward";
  return (
    <SiteSection tone="canvas" id="get-your-code" className="scroll-mt-28">
      <div className="mx-auto max-w-xl">
        <Card className="p-6 md:p-8">
          <h2 className="text-h2 text-text-heading">Get your personal link</h2>
          {mine ? (
            <SignedIn mine={mine} onStartAgain={startAgain} />
          ) : (
            <CodeForm form={form} errors={errors} onSubmit={onSubmit} set={(p) => setForm((f) => ({...f, ...p}))} />
          )}
          {mine ? <CodeResult mine={mine} saveFailed={saveFailed} friendReward={friendReward} /> : null}
        </Card>
      </div>
    </SiteSection>
  );
}

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!NAME_RE.test(form.firstName.trim())) errors.firstName = "Enter your first name (letters only)";
  if (!normalizeNigerianPhone(form.phone)) errors.phone = "Enter a Nigerian mobile number, e.g. 0803 123 4567";
  if (!form.consent) errors.consent = "Please tick to agree so we can send your link";
  return errors;
}

function SignedIn({mine, onStartAgain}: {mine: MyReferral; onStartAgain: () => void}) {
  return (
    <p className="mt-2 text-sm text-text-muted">
      Signed in as {mine.firstName} · {mine.code} —{" "}
      <button type="button" onClick={onStartAgain} className="font-semibold text-brand-strong underline underline-offset-2">
        Not you? Start again
      </button>
    </p>
  );
}

function CodeResult({mine, saveFailed, friendReward}: {mine: MyReferral; saveFailed: boolean; friendReward: string}) {
  const link = buildReferralLink(mine.code);
  return (
    <>
      <div className="mt-6 rounded-card bg-leaf-soft p-4">
        <p className="text-sm font-semibold text-text-muted">Your code</p>
        <p className="mt-1 text-h2 font-extrabold tracking-wide text-ink">{mine.code}</p>
        <p className="mt-1 text-sm break-all text-text-body">{link}</p>
      </div>
      {saveFailed ? (
        <p className="mt-3 text-sm text-text-muted">
          We couldn't save your code just now. It still works; we'll match it when your friend orders.
        </p>
      ) : null}
      <SharePanel code={mine.code} link={link} friendReward={friendReward} />
    </>
  );
}

interface CodeFormProps {
  form: FormState;
  errors: Errors;
  set: (p: Partial<FormState>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function CodeForm({form, errors, set, onSubmit}: CodeFormProps) {
  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
      <Field id="ref-name" label="First name" required error={errors.firstName}>
        <Input value={form.firstName} onChange={(e) => set({firstName: e.target.value})} autoComplete="given-name" maxLength={40} />
      </Field>
      <Field
        id="ref-phone"
        label="WhatsApp number"
        required
        error={errors.phone}
        hint="Your code uses your first name and the last 4 digits of your number, for example AMAKA-4821. We never show your full number."
      >
        <PhoneInput value={form.phone} onChange={(e) => set({phone: e.target.value})} autoComplete="tel-national" inputMode="tel" />
      </Field>
      <ConsentField id="ref-consent" checked={form.consent} error={errors.consent} onChange={(v) => set({consent: v})} />
      <VisuallyHidden>
        <label>
          Company
          <input name="company" value={form.honeypot} onChange={(e) => set({honeypot: e.target.value})} tabIndex={-1} autoComplete="off" />
        </label>
      </VisuallyHidden>
      <Button type="submit" variant="primary" size="lg" fullWidth>
        Get my link
      </Button>
    </form>
  );
}
