import {Check, Copy} from "lucide-react";
import {useState} from "react";
import {getCategory} from "@/lib/catalog/categories";
import type {Product} from "@/lib/catalog/types";
import {formatPackDuration} from "@/lib/format/pack-duration";
import {useToast} from "@/components/ui/toast";

function FactsRow({term, children}: {term: string; children: React.ReactNode}) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-b border-line py-3 last:border-b-0">
      <dt className="text-sm font-semibold text-text-muted">{term}</dt>
      <dd className="text-sm text-ink">{children}</dd>
    </div>
  );
}

function CopyCode({code}: {code: string}) {
  const {show} = useToast();
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      show({message: "Product code copied"});
      window.setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <span className="inline-flex items-center gap-2">
      <span className="font-mono tabular-nums">{code}</span>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1 rounded-field px-2 py-1 text-xs font-semibold text-brand-strong"
      >
        {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  );
}

// "Product facts" — NAFDAC no. (when provided), pack, duration, category
// and a copyable product code for quoting on WhatsApp.
export function ProductFacts({product}: {product: Product}) {
  const category = getCategory(product.categorySlug);
  return (
    <section id="facts" className="scroll-mt-28">
      <h2 className="text-h2 text-ink">Product facts</h2>
      <dl className="mt-4 border-t border-line">
        {product.nafdacNo ? <FactsRow term="NAFDAC reg. no.">{product.nafdacNo}</FactsRow> : null}
        <FactsRow term="Pack size">{product.packSize}</FactsRow>
        <FactsRow term="Lasts about">{formatPackDuration(product.packDays, "fragment")}</FactsRow>
        {category ? (
          <FactsRow term="Category">
            <a href={`/shop/${category.slug}`} className="font-semibold text-brand-strong">
              {category.name}
            </a>
          </FactsRow>
        ) : null}
        <FactsRow term="Product code">
          <CopyCode code={product.id} />
        </FactsRow>
      </dl>
      {product.nafdacNo ? (
        <p className="mt-3 text-sm text-text-muted">
          You can verify NAFDAC registration on the{" "}
          <a
            href="https://www.nafdac.gov.ng"
            target="_blank"
            rel="noopener"
            className="font-semibold text-brand-strong underline underline-offset-2"
          >
            NAFDAC website
          </a>
          .
        </p>
      ) : null}
    </section>
  );
}
