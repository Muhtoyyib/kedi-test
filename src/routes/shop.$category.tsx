import {createFileRoute, notFound} from "@tanstack/react-router";
import {SiteLayout} from "@/components/layout/site/layout";
import {ShopView} from "@/features/shop/view";
import {getCategory} from "@/lib/catalog/categories";
import {buildMeta} from "@/lib/seo/meta";
import {breadcrumbLd, itemListLd, jsonLdScripts} from "@/lib/seo/jsonld";
import {siteConfig} from "@/lib/site-config";
import {validateShopSearch} from "@/features/shop/use-shop-query";

function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).trimEnd() + "…";
}

export const Route = createFileRoute("/shop/$category")({
  validateSearch: validateShopSearch,
  loader: ({params}) => {
    const category = getCategory(params.category);
    if (!category) throw notFound();
    return {category};
  },
  // head() runs inside the eager route-options bundle — the full catalog is
  // dynamic-imported so it stays in lazy chunks.
  head: async ({loaderData}) => {
    const category = loaderData?.category;
    if (!category) return {};
    const {getProductsByCategory} = await import("@/lib/catalog/products");
    const products = getProductsByCategory(category.slug);
    return {
      ...buildMeta({
        title: `${category.name} — KEDI products | ${siteConfig.name}`,
        description: truncateAtWord(category.description, 155),
        path: `/shop/${category.slug}`,
      }),
      scripts: jsonLdScripts([
        breadcrumbLd([
          {name: "Home", path: "/"},
          {name: "Shop", path: "/shop"},
          {name: category.name, path: `/shop/${category.slug}`},
        ]),
        itemListLd(products.map((p) => `/products/${p.slug}`)),
      ]),
    };
  },
  component: () => {
    const {category} = Route.useLoaderData();
    return (
      <SiteLayout>
        <ShopView category={category} />
      </SiteLayout>
    );
  },
});
