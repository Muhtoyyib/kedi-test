import type {Article} from "@/lib/catalog/types";
import {topicLabel} from "@/lib/content/topics";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {ResponsiveImage} from "@/components/ui/responsive-image";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";

const dateFmt = new Intl.DateTimeFormat("en-GB", {day: "numeric", month: "long", year: "numeric"});

// Featured newest article — only shown when no topic filter is active.
function FeaturedCard({article}: {article: Article}) {
  return (
    <Card interactive className="overflow-hidden md:grid md:grid-cols-2">
      <a href={`/learn/${article.slug}`} className="block md:contents">
        <ResponsiveImage image={article.cover} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-video w-full object-cover" />
      </a>
      <div className="flex flex-col p-6">
        <a href={`/learn/${article.slug}`} className="block">
          <Badge variant="brand">{topicLabel(article.topic)}</Badge>
          <h2 className="mt-3 text-h2 text-ink">{article.title}</h2>
          <p className="mt-2 text-text-muted">{article.description}</p>
          <span className="mt-3 block text-sm text-text-muted">
            {article.readingMinutes} min read · {dateFmt.format(new Date(article.date))}
          </span>
        </a>
        <Button variant="secondary" href={`/learn/${article.slug}`} className="mt-4 self-start">
          Read article
        </Button>
      </div>
    </Card>
  );
}

// /learn intro + featured card (learn/hub-header spec).
export function HubHeader({featured}: {featured?: Article}) {
  return (
    <SiteSection tone="brand-soft" spacing="tight">
      <SectionHeader
        as="h1"
        eyebrow="Wellness Hub"
        title="Practical wellness, in plain language"
        description="Short reads and videos on everyday habits: food, water, sleep, movement and using your products correctly. General information only, not medical advice."
      />
      {featured ? (
        <div className="mt-8">
          <FeaturedCard article={featured} />
        </div>
      ) : null}
    </SiteSection>
  );
}
