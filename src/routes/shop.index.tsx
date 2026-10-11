import {createFileRoute} from "@tanstack/react-router";
import {SiteLayout} from "@/components/layout/site/layout";
import {ShopView} from "@/features/shop/view";
import {buildMeta} from "@/lib/seo/meta";
import {itemListLd, jsonLdScripts} from "@/lib/seo/jsonld";
import {getPageTitle, siteConfig} from "@/lib/site-config";
import {validateShopSearch} from "@/features/shop/use-shop-query";

export const Route = createFileRoute("/shop/")({
  validateSearch: validateShopSearch,
  // head() runs inside the eager route-options bundle — the full catalog is
  // dynamic-imported so it stays in lazy chunks.
  head: async () => {
    const {getProducts} = await import("@/lib/catalog/products");
    return {
      ...buildMeta({
        title: getPageTitle("Shop KEDI products"),
        description: `Browse genuine KEDI wellness products with prices. Add to cart and send your order on WhatsApp for delivery in ${siteConfig.city}.`,
        path: "/shop",
      }),
      scripts: jsonLdScripts([itemListLd(getProducts().map((p) => `/products/${p.slug}`))]),
    };
  },
  component: () => (
    <SiteLayout>
      <ShopView category={null} />
    </SiteLayout>
  ),
});
