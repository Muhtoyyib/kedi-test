import {getArticles} from "@/lib/catalog/articles";
import {catalog} from "@/lib/catalog/data";
import {getFeaturedProducts} from "@/lib/catalog/products";
import {getStories} from "@/lib/catalog/stories";
import {FeaturedProducts} from "./components/featured-products";
import {FinalCta} from "./components/final-cta";
import {Hero} from "./components/hero";
import {NextSeminarBanner} from "./components/next-seminar-banner";
import {StoriesPreview} from "./components/stories-preview";
import {TrustBar} from "./components/trust-bar";
import {WellnessHubPreview} from "./components/wellness-hub-preview";
import {WhyBuyFromUs} from "./components/why-buy-from-us";

// Section order per the proposal table; stories/articles hide when empty.
// buildNow pins "next seminar" at prerender — banners re-check on hydration.
export function HomeView() {
  const buildNow = new Date(catalog.generatedAt);
  return (
    <>
      <Hero buildNow={buildNow} />
      <TrustBar />
      <WhyBuyFromUs photo={null} />
      <FeaturedProducts products={getFeaturedProducts(8)} />
      <NextSeminarBanner buildNow={buildNow} />
      <StoriesPreview stories={getStories().slice(0, 3)} />
      <WellnessHubPreview articles={getArticles().slice(0, 3)} />
      <FinalCta />
    </>
  );
}
