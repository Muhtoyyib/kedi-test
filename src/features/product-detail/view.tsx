import {ChevronLeft} from "lucide-react";
import {getCategory} from "@/lib/catalog/categories";
import type {Product} from "@/lib/catalog/types";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {Disclaimer} from "@/components/ui/disclaimer";
import {Notice} from "@/components/ui/notice";
import {SiteSection} from "@/components/marketing/site-section";
import {AboutProduct} from "./components/about-product";
import {AnchorNav} from "./components/anchor-nav";
import {HowToUse} from "./components/how-to-use";
import {ImageGallery} from "./components/image-gallery";
import {ProductFacts} from "./components/product-facts";
import {ProductFaqs} from "./components/product-faqs";
import {PurchasePanel} from "./components/purchase-panel";
import {RelatedProducts} from "./components/related-products";
import {StickyBuyBar} from "./components/sticky-buy-bar";

function ProductBreadcrumbs({product}: {product: Product}) {
  const category = getCategory(product.categorySlug);
  const items = [
    {label: "Home", href: "/"},
    {label: "Shop", href: "/shop"},
    ...(category ? [{label: category.name, href: `/shop/${category.slug}`}] : []),
    {label: product.name},
  ];
  return (
    <div className="pt-4 pb-2 text-sm">
      <Breadcrumbs items={items} className="max-md:hidden" />
      {category ? (
        <a href={`/shop/${category.slug}`} className="inline-flex items-center gap-1 font-semibold text-brand-strong md:hidden">
          <ChevronLeft className="size-4" aria-hidden="true" />
          {category.name}
        </a>
      ) : null}
    </div>
  );
}

// /products/{slug} — gallery + sticky purchase panel, then the long-form
// sections with an in-page nav on md+. Sticky buy bar covers phones.
export function ProductDetailView({product}: {product: Product}) {
  return (
    <>
      <SiteSection spacing="tight">
        <ProductBreadcrumbs product={product} />
        <div className="mt-2 grid gap-8 md:grid-cols-2 md:gap-10">
          <ImageGallery product={product} />
          <div className="md:sticky md:top-24 md:self-start">
            <PurchasePanel product={product} />
          </div>
        </div>
        <AnchorNav className="sticky top-[var(--header-h,72px)] z-20 -mx-4 bg-canvas px-4 md:top-20" />
        <div className="mt-8 max-w-3xl space-y-10">
          <AboutProduct product={product} />
          <HowToUse product={product} />
          <ProductFacts product={product} />
          <ProductFaqs product={product} />
        </div>
      </SiteSection>
      <RelatedProducts product={product} />
      <SiteSection spacing="tight" className="max-md:pb-24" aria-label="Health disclaimer">
        <Notice tone="info" title="Health disclaimer" className="max-w-3xl">
          <Disclaimer kind="health" />
          <a href="/health-disclaimer" className="mt-2 inline-block font-semibold text-brand-strong underline underline-offset-2">
            Read our full health disclaimer
          </a>
        </Notice>
      </SiteSection>
      <StickyBuyBar product={product} />
    </>
  );
}
