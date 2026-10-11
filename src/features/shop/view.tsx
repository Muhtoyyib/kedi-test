import {useHydrated} from "@/lib/use-hydrated";
import {getCategories} from "@/lib/catalog/categories";
import {getProducts, getProductsByCategory} from "@/lib/catalog/products";
import type {Category, Product} from "@/lib/catalog/types";
import {searchProducts, sortProducts} from "@/lib/shop/filter";
import {useShopQuery} from "@/features/shop/use-shop-query";
import {CategoryFilter} from "./components/category-filter";
import {CategoryHeader} from "./components/category-header";
import {EmptyState} from "./components/empty-state";
import {ShopHelpCta} from "./components/help-cta";
import {ProductGrid} from "./components/product-grid";
import {SearchAndSort} from "./components/search-and-sort";
import {ShopHeader} from "./components/shop-header";

interface ListingProps {
  visible: Product[];
  listId: string;
  category: Category | null;
  hydrated: boolean;
  q: string;
  onClear: () => void;
}

function Listing({visible, listId, category, hydrated, q, onClear}: ListingProps) {
  if (visible.length > 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-4 md:px-6 lg:px-8">
        <ProductGrid items={visible} listId={listId} />
      </div>
    );
  }
  if (hydrated && q !== "") return <EmptyState kind="no-results" term={q} onClear={onClear} />;
  return <EmptyState kind="empty-category" category={category?.name ?? "this category"} />;
}

// Shared composition for /shop and /shop/{category}. The prerendered HTML
// always shows the full listing in default order — the client's q/sort filter
// applies after hydration, so there's no mismatch and no-JS browsing works.
export function ShopView({category}: {category: Category | null}) {
  const {query, setQuery} = useShopQuery();
  const hydrated = useHydrated();

  const base = category ? getProductsByCategory(category.slug) : getProducts();
  const visible = hydrated ? sortProducts(searchProducts(base, query.q), query.sort) : base;

  const categories = getCategories();
  const counts = new Map(categories.map((c) => [c.slug, getProductsByCategory(c.slug).length]));
  const search = {q: query.q || undefined, sort: query.sort === "recommended" ? undefined : query.sort};

  return (
    <>
      {category ? <CategoryHeader category={category} count={base.length} /> : <ShopHeader />}
      {category ? <ShopHeader intro={false} /> : null}
      <CategoryFilter
        categories={categories}
        counts={counts}
        total={getProducts().length}
        activeSlug={category?.slug ?? null}
        search={search}
      />
      <SearchAndSort total={base.length} shown={visible.length} />
      <Listing
        visible={visible}
        listId={category ? `shop:${category.slug}` : "shop"}
        category={category}
        hydrated={hydrated}
        q={query.q.trim()}
        onClear={() => setQuery({q: ""})}
      />
      <ShopHelpCta />
    </>
  );
}
