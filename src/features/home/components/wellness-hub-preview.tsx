import type {Article} from "@/lib/catalog/types";
import {Button} from "@/components/ui/button";
import {ArticleCard} from "@/components/marketing/article-card";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";

// Three latest articles — compact rows on phones, full cards on md+.
// Hidden entirely when no articles are published.
export function WellnessHubPreview({articles}: {articles: Article[]}) {
  if (articles.length === 0) return null;
  return (
    <SiteSection>
      <SectionHeader
        eyebrow="Wellness Hub"
        title="Learn something useful today"
        description="Short, practical reads on everyday wellness habits."
      />
      <ul className="mt-8 flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6">
        {articles.map((a) => (
          <li key={a.id}>
            <div className="md:hidden">
              <ArticleCard article={a} density="compact" />
            </div>
            <div className="max-md:hidden">
              <ArticleCard article={a} />
            </div>
          </li>
        ))}
      </ul>
      <Button variant="secondary" href="/learn" fullWidth className="mt-6 md:hidden">
        Visit the Wellness Hub
      </Button>
      <div className="mt-6 max-md:hidden">
        <Button variant="secondary" href="/learn">
          Visit the Wellness Hub
        </Button>
      </div>
    </SiteSection>
  );
}
