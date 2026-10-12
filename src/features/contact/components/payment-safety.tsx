import {ShieldAlert} from "lucide-react";
import type {Settings} from "@/lib/catalog/types";
import {getSettings} from "@/lib/catalog/settings";
import {siteConfig} from "@/lib/site-config";
import {SiteSection} from "@/components/marketing/site-section";
import {useToast} from "@/components/ui/toast";

type Bank = NonNullable<Settings["bank"]>;

// The official account details, shown inside the safety notice (contact/
// payment-safety spec) and exported for reuse in legal MDX pages.
export function BankDetails({bank}: {bank: Bank}) {
  const toast = useToast();
  async function copy() {
    try {
      await navigator.clipboard.writeText(bank.accountNumber);
      toast.show({message: "Account number copied"});
    } catch {
      // clipboard unavailable — the number stays selectable
    }
  }
  const rows: [string, string][] = [
    ["Bank", bank.name],
    ["Account name", bank.accountName],
  ];
  return (
    <dl className="mt-4 space-y-2 text-sm">
      {rows.map(([term, value]) => (
        <div key={term} className="flex gap-2">
          <dt className="w-28 shrink-0 font-semibold">{term}</dt>
          <dd>{value}</dd>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <dt className="w-28 shrink-0 font-semibold">Account number</dt>
        <dd className="font-mono">{bank.accountNumber}</dd>
        <button
          type="button"
          onClick={copy}
          className="ml-1 rounded-field border border-sun-ink/30 px-3 py-1 text-xs font-semibold transition-colors hover:bg-sun-ink/10"
        >
          Copy
        </button>
      </div>
    </dl>
  );
}

// contact/payment-safety spec: official account + the impersonation warning.
// Without bank details only the warning shows, with the WhatsApp fallback.
export function PaymentSafety() {
  const bank = getSettings().bank;
  return (
    <SiteSection>
      <div className="rounded-panel bg-sun-soft p-6 text-sun-ink">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 size-6 shrink-0" aria-hidden="true" />
          <div>
            <h2 className="text-h3 font-bold">Pay only to our official account</h2>
            {bank ? <BankDetails bank={bank} /> : <p className="mt-3 text-sm font-semibold">Ask us on WhatsApp for our payment details.</p>}
            <p className="mt-4 text-sm leading-6">
              We only send payment details from our WhatsApp number {siteConfig.whatsapp.display}. If anyone asks you to pay into a
              different account, do not pay. Message us first.
            </p>
          </div>
        </div>
      </div>
    </SiteSection>
  );
}
