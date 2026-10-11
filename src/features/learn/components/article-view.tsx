import {useEffect, useRef} from "react";
import {ArrowRight} from "lucide-react";
import {getRelatedArticles} from "@/lib/catalog/articles";
import {getCategory} from "@/lib/catalog/categories";
import {getNextSeminar} from "@/lib/catalog/seminars";
import {catalog} from "@/lib/catalog/data";
import type {Article} from "@/lib/catalog/types";
import {topicLabel} from "@/lib/content/topics";
import {siteConfig} from "@/lib/site-config";
import {track} from "@/lib/analytics/track";
import {ArticleCard} from "@/components/marketing/article-card";
import {ArticleBody} from "@/components/content/article-body";
import {ArticleCta} from "./article-cta";
import {Badge} from "@/components/ui/badge";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {Card} from "@/components/ui/card";
import {Disclaimer} from "@/components/ui/disclaimer";
import {ResponsiveImage} from "@/components/ui/responsive-image";
import {SiteSection} from "@/components/marketing/site-section";

const dateFmt = new Intl.DateTimeFormat("en-GB", {day: "numeric", month: "long", year: "numeric"});

function TocList({article}: {article: Article}) {
  return (
    <ul className="mt-3 space-y-2">
      {article.toc.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className="text-base text-brand-strong hover:underline">
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

// "On this page" — a collapsible <details> on mobile, an always-visible nav on
// md+ (learn/article-page spec). Shown when the Doc produced 3+ h2 headings.
function Toc({article}: {article: Article}) {
  if (article.toc.length < 3) return null;
  return (
    <>
      <details className="mt-8 rounded-card border border-line p-4 md:hidden">
        <summary className="cursor-pointer font-semibold text-ink">On this page</summary>
        <nav aria-label="On this page">
          <TocList article={article} />
        </nav>
      </details>
      <nav aria-label="On this page" className="mt-8 rounded-card border border-line p-4 max-md:hidden">
        <p className="font-semibold text-ink">On this page</p>
        <TocList article={article} />
      </nav>
    </>
  );
}

// Fires article_read once when the sentinel at 75% of the body scrolls into view.
function useArticleRead(article: Article) {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver !== "function") return;
    const observer = new IntersectionObserver((entries) => {
      if (!fired.current && entries.some((e) => e.isIntersecting)) {
        fired.current = true;
        track({event: "article_read", slug: article.slug, topic: article.topic});
        observer.disconnect();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [article.slug, article.topic]);
  return ref;
}

function RelatedCategoryLink({slug}: {slug: string}) {
  const category = getCategory(slug);
  if (!category) return null;
  return (
    <Card interactive className="mt-8">
      <a href={`/shop/${category.slug}`} className="flex items-center justify-between gap-4 p-5">
        <span className="font-semibold text-ink">Explore our {category.name} range</span>
        <ArrowRight className="size-5 shrink-0 text-brand-strong" aria-hidden="true" />
      </a>
    </Card>
  );
}

function MoreOnTopic({article}: {article: Article}) {
  const related = getRelatedArticles(article, 3);
  if (related.length === 0) return null;
  return (
    <div className="mt-10">
      <h2 className="text-h3 text-text-heading">More on {topicLabel(article.topic)}</h2>
      <ul className="mt-4 space-y-4">
        {related.map((item) => (
          <li key={item.id}>
            <ArticleCard article={item} density="compact" />
          </li>
        ))}
      </ul>
    </div>
  );
}

// /learn/{slug} — client-written article rendered verbatim from the Doc
// (learn/article-page spec). buildNow pins "next seminar" at prerender.
export function ArticleView({article}: {article: Article}) {
  const sentinelRef = useArticleRead(article);
  const category = article.relatedCategory ? getCategory(article.relatedCategory) : undefined;
  return (
    <SiteSection spacing="tight">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            {label: "Home", href: "/"},
            {label: "Learn", href: "/learn"},
            {label: topicLabel(article.topic), href: `/learn?topic=${article.topic}`},
          ]}
        />
        <Badge variant="brand" className="mt-6">
          {topicLabel(article.topic)}
        </Badge>
        <h1 className="mt-3 text-h1 text-text-heading">{article.title}</h1>
        <p className="mt-4 text-lead text-text-body">{article.description}</p>
        <p className="mt-4 text-sm text-text-muted">
          By the {siteConfig.name} team · {dateFmt.format(new Date(article.date))} · {article.readingMinutes} min read
        </p>
        <Toc article={article} />
      </div>
      <ResponsiveImage
        image={article.cover}
        priority
        sizes="(min-width: 1024px) 64rem, 100vw"
        className="mx-auto mt-8 aspect-video w-full max-w-5xl rounded-panel object-cover"
      />
      <div className="relative mx-auto mt-10 max-w-3xl">
        <div ref={sentinelRef} className="absolute top-3/4" aria-hidden="true" />
        <ArticleBody blocks={article.body} />
      </div>
      <div className="mx-auto max-w-3xl">
        <ArticleCta article={article} nextSeminar={getNextSeminar(new Date(catalog.generatedAt))} category={category} />
        <Disclaimer kind="health" className="mt-8" />
        {article.relatedCategory ? <RelatedCategoryLink slug={article.relatedCategory} /> : null}
        <MoreOnTopic article={article} />
      </div>
    </SiteSection>
  );
}
