// Component map for legal-page MDX bodies. Custom components pull live
// Sheet values so legal pages stay accurate when the client edits Settings.

import type {MDXComponents} from "mdx/types";
import type {ComponentPropsWithoutRef, ReactNode} from "react";
import {formatNaira} from "@/lib/format/naira";
import {getDeliveryAreas, getSettings} from "@/lib/catalog/settings";
import {Disclaimer, type DisclaimerKind} from "@/components/ui/disclaimer";
import {Notice, type NoticeTone} from "@/components/ui/notice";

const ZONES = [
  {zone: "local", label: "Local delivery"},
  {zone: "interstate", label: "Interstate courier"},
  {zone: "pickup", label: "Pickup"},
] as const;

export function DeliveryTable({areas}: {areas?: ReturnType<typeof getDeliveryAreas>}) {
  const all = areas ?? getDeliveryAreas();
  if (all.length === 0) {
    return (
      <p>
        <a href="https://wa.me/?text=Hello! What are your delivery fees?">Ask us on WhatsApp for delivery fees</a>
      </p>
    );
  }
  return (
    <>
      {ZONES.map(({zone, label}) => {
        const rows = all.filter((area) => area.zone === zone);
        if (rows.length === 0) return null;
        return (
          <div key={zone} className="not-prose mt-6">
            <p className="text-sm font-semibold text-text-heading">{label}</p>
            <ZoneCards rows={rows} />
            <ZoneTable rows={rows} />
          </div>
        );
      })}
    </>
  );
}

// Mobile: one small card per row.
function ZoneCards({rows}: {rows: ReturnType<typeof getDeliveryAreas>}) {
  return (
    <ul className="mt-2 space-y-2 md:hidden">
      {rows.map((row) => (
        <li key={row.area} className="rounded-card border border-line bg-canvas p-3 text-sm">
          <p className="font-semibold text-ink">{row.area}</p>
          <p className="mt-0.5 text-text-body">
            {formatNaira(row.feeNgn)} · {row.timelineText}
          </p>
        </li>
      ))}
    </ul>
  );
}

// md+: a real table.
function ZoneTable({rows}: {rows: ReturnType<typeof getDeliveryAreas>}) {
  return (
    <table className="mt-2 w-full text-sm max-md:hidden">
      <thead>
        <tr className="border-b border-line text-left text-text-muted">
          <th className="py-2 pr-4 font-semibold">Area</th>
          <th className="py-2 pr-4 font-semibold">Fee</th>
          <th className="py-2 font-semibold">Delivery time</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.area} className="border-b border-line last:border-0">
            <td className="py-2 pr-4 font-medium text-ink">{row.area}</td>
            <td className="py-2 pr-4 text-text-body">{formatNaira(row.feeNgn)}</td>
            <td className="py-2 text-text-body">{row.timelineText}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** The Sheet's delivery note, rendered inline. */
export function DeliveryNote() {
  const note = getSettings().deliveryNote;
  return note ? <>{note}</> : null;
}

/** Pickup address + opening hours from Settings, rendered inline. */
export function PickupInfo() {
  const settings = getSettings();
  if (!settings.pickupAddress && !settings.openingHours) return null;
  return (
    <>
      {settings.pickupAddress}
      {settings.pickupAddress && settings.openingHours ? " during our opening hours: " : ""}
      {settings.openingHours}
    </>
  );
}

export function BankDetails() {
  const bank = getSettings().bank;
  if (!bank) return <p>Payment details are shared on WhatsApp when you order.</p>;
  return (
    <ul>
      <li>Bank: {bank.name}</li>
      <li>Account name: {bank.accountName}</li>
      <li>Account number: {bank.accountNumber}</li>
    </ul>
  );
}

export function LegalDisclaimer({kind}: {kind: DisclaimerKind}) {
  return <Disclaimer kind={kind} />;
}

export function Callout({tone = "info", title, children}: {tone?: NoticeTone; title?: string; children: ReactNode}) {
  return (
    <Notice tone={tone} title={title}>
      {children}
    </Notice>
  );
}

// Legal h2s get a hover/focus "#" anchor so a section can be linked
// directly (legal/layout design).
function AnchorH2({id, children, ...rest}: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2 id={id} {...rest} className="group scroll-mt-24">
      {children}
      {id ? (
        <a
          href={`#${id}`}
          aria-label="Link to this section"
          className="ml-2 text-text-muted no-underline opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
        >
          #
        </a>
      ) : null}
    </h2>
  );
}

/** Components available inside content/legal/*.mdx. */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    DeliveryTable,
    DeliveryNote,
    PickupInfo,
    BankDetails,
    Disclaimer: LegalDisclaimer,
    Callout,
    h2: AnchorH2,
    ...components,
  };
}
