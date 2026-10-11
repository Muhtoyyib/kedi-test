import {siteConfig} from "@/lib/site-config";
import {Checkbox} from "./checkbox";

// The §5 consent checkbox — exact wording from docs/copy-and-compliance.md,
// shared by every lead form (contact, business interest, referral, seminar).
export function ConsentField({
  id,
  checked,
  error,
  onChange,
}: {
  id: string;
  checked: boolean;
  error?: string;
  onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <Checkbox
        id={id}
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
