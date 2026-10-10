// Component map for legal-page MDX bodies. Custom components pull live
// Sheet values so legal pages stay accurate when the client edits Settings.

import type {MDXComponents} from "mdx/types";
import type {ReactNode} from "react";
import {formatNaira} from "@/lib/format/naira";
import {getDeliveryAreas, getSettings} from "@/lib/catalog/settings";
import {Disclaimer, type DisclaimerKind} from "@/components/ui/disclaimer";
import {Notice, type NoticeTone} from "@/components/ui/notice";

export function DeliveryTable() {
  const zones = [
    {zone: "local", label: "Local delivery"},
    {zone: "interstate", label: "Interstate courier"},
    {zone: "pickup", label: "Pickup"},
  ] as const;
  return (
    <>
      {zones.map(({zone, label}) => {
        const rows = getDeliveryAreas().filter((area) => area.zone === zone);
        if (rows.length === 0) return null;
        return (
          <table key={zone}>
            <caption className="pb-2 text-left font-semibold">{label}</caption>
            <thead>
              <tr>
                <th>Area</th>
                <th>Fee</th>
                <th>Delivery time</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.area}>
                  <td>{row.area}</td>
                  <td>{formatNaira(row.feeNgn)}</td>
                  <td>{row.timelineText}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      })}
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

/** Components available inside content/legal/*.mdx. */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    DeliveryTable,
    BankDetails,
    Disclaimer: LegalDisclaimer,
    Callout,
    ...components,
  };
}
