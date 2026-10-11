import {createFileRoute, notFound} from "@tanstack/react-router";
import {SiteLayout} from "@/components/layout/site/layout";
import {ArticleView} from "@/features/learn/components/article-view";
import type {Article} from "@/lib/catalog/types";
import {topicLabel} from "@/lib/content/topics";
import {buildMeta} from "@/lib/seo/meta";
import {articleLd, breadcrumbLd, jsonLdScripts} from "@/lib/seo/jsonld";
import {getPageTitle} from "@/lib/site-config";

// Catalog helpers are dynamic-imported so the generated catalog stays in
// lazy chunks (route options are bundled eagerly — see shop.index.tsx).
function ogImage(article: Article): string | undefined {
  return article.cover.variants.find((v) => v.width === 1200)?.webp ?? article.cover.variants.at(-1)?.webp;
}

function headFor(article: Article) {
  const meta = buildMeta({
    title: getPageTitle(article.title),
    description: article.description,
    path: `/learn/${article.slug}`,
    image: ogImage(article),
    type: "article",
    publishedTime: article.date,
  });
  return {
    ...meta,
    scripts: jsonLdScripts([
      articleLd(article),
      breadcrumbLd([
        {name: "Home", path: "/"},
        {name: "Learn", path: "/learn"},
        {name: topicLabel(article.topic), path: `/learn?topic=${article.topic}`},
        {name: article.title, path: `/learn/${article.slug}`},
      ]),
    ]),
  };
}

async function articleHead(slug: string) {
  const {getArticle} = await import("@/lib/catalog/articles");
  const article = getArticle(slug);
  return article ? headFor(article) : {};
}

export const Route = createFileRoute("/learn/$slug")({
  loader: async ({params}) => {
    const {getArticle} = await import("@/lib/catalog/articles");
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return {article};
  },
  head: ({params}) => articleHead(params.slug),
  component: ArticlePage,
});

function ArticlePage() {
  const {article} = Route.useLoaderData();
  return (
    <SiteLayout>
      <ArticleView article={article} />
    </SiteLayout>
  );
}
