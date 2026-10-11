import {useEffect} from "react";
import {createFileRoute, notFound} from "@tanstack/react-router";
import {SiteLayout} from "@/components/layout/site/layout";
import {ProductDetailView} from "@/features/product-detail/view";
import {track} from "@/lib/analytics/track";
import type {Category, Product} from "@/lib/catalog/types";
import {buildMeta} from "@/lib/seo/meta";
import {breadcrumbLd, faqPageLd, jsonLdScripts, productLd} from "@/lib/seo/jsonld";
import {siteConfig} from "@/lib/site-config";

// Catalog helpers are dynamic-imported so the generated catalog stays in
// lazy chunks (route options are bundled eagerly — see shop.index.tsx).
function defaultSeoTitle(name: string, packSize: string): string {
  return `${name} — ${packSize} | ${siteConfig.name}`;
}

function crumbsFor(product: Product, category: Category | undefined): {name: string; path: string}[] {
  const base = [
    {name: "Home", path: "/"},
    {name: "Shop", path: "/shop"},
  ];
  const cat = category ? [{name: category.name, path: `/shop/${category.slug}`}] : [];
  return [...base, ...cat, {name: product.name, path: `/products/${product.slug}`}];
}

function ogImage(product: Product): string | undefined {
  return product.images[0]?.variants.find((v) => v.width === 1200)?.webp ?? product.images[0]?.variants.at(-1)?.webp;
}

function headFor(product: Product, category: Category | undefined) {
  const faqLd = faqPageLd(product.faqs);
  const meta = buildMeta({
    title: product.seo.title || defaultSeoTitle(product.name, product.packSize),
    description: product.seo.description || product.shortBenefit,
    path: `/products/${product.slug}`,
    image: ogImage(product),
  });
  return {
    ...meta,
    scripts: jsonLdScripts([
      productLd(product, category?.name ?? ""),
      breadcrumbLd(crumbsFor(product, category)),
      ...(faqLd ? [faqLd] : []),
    ]),
  };
}

async function productHead(slug: string) {
  const [{getProduct}, {getCategory}] = await Promise.all([import("@/lib/catalog/products"), import("@/lib/catalog/categories")]);
  const product = getProduct(slug);
  return product ? headFor(product, getCategory(product.categorySlug)) : {};
}

export const Route = createFileRoute("/products/$slug")({
  loader: async ({params}) => {
    const {getProduct} = await import("@/lib/catalog/products");
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return {product};
  },
  head: ({params}) => productHead(params.slug),
  component: ProductPage,
});

function ProductPage() {
  const {product} = Route.useLoaderData();
  useEffect(() => {
    track({
      event: "view_item",
      item_id: product.id,
      item_category: product.categorySlug,
      ...(product.priceNgn !== null ? {price: product.priceNgn} : {}),
    });
  }, [product]);
  return (
    <SiteLayout hideFloatingWhatsApp="mobile">
      <ProductDetailView product={product} />
    </SiteLayout>
  );
}
