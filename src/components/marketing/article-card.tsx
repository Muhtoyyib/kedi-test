import {PlayCircle} from "lucide-react";
import type {Article} from "@/lib/catalog/types";
import {topicLabel} from "@/lib/content/topics";
import {Badge} from "@/components/ui/badge";
import {Card} from "@/components/ui/card";
import {ResponsiveImage} from "@/components/ui/responsive-image";

const dateFmt = new Intl.DateTimeFormat("en-GB", {day: "numeric", month: "short", year: "numeric"});

function hasVideo(article: Article): boolean {
  return article.body.some((b) => b.type === "video");
}

function Meta({article}: {article: Article}) {
  return (
    <span className="mt-3 flex items-center gap-1.5 text-sm text-text-muted">
      {hasVideo(article) ? <PlayCircle className="size-4 text-brand-strong" aria-label="Has video" /> : null}
      {article.readingMinutes} min read · {dateFmt.format(new Date(article.date))}
    </span>
  );
}

// One Wellness Hub article — the whole card is the link, so the heading is
// the accessible name. "compact" is the 96px-thumb row used on mobile.
export function ArticleCard({article, density = "full"}: {article: Article; density?: "full" | "compact"}) {
  if (density === "compact") {
    return (
      <Card interactive className="overflow-hidden">
        <a href={`/learn/${article.slug}`} className="flex gap-4 p-3">
          <ResponsiveImage image={article.cover} sizes="96px" className="size-24 shrink-0 rounded-field" />
          <span className="min-w-0">
            <Badge variant="brand">{topicLabel(article.topic)}</Badge>
            <h3 className="mt-2 line-clamp-2 font-bold text-ink">{article.title}</h3>
            <Meta article={article} />
          </span>
        </a>
      </Card>
    );
  }
  return (
    <Card interactive className="overflow-hidden">
      <a href={`/learn/${article.slug}`} className="block">
        <ResponsiveImage image={article.cover} sizes="(min-width:768px) 30vw, 100vw" className="aspect-video" />
        <span className="block p-5">
          <Badge variant="brand">{topicLabel(article.topic)}</Badge>
          <h3 className="mt-3 line-clamp-2 text-h3 text-ink">{article.title}</h3>
          <p className="mt-2 line-clamp-2 text-text-body">{article.description}</p>
          <Meta article={article} />
        </span>
      </a>
    </Card>
  );
}
