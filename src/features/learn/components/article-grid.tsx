import {useState} from "react";
import {cn} from "cn";
import type {Article} from "@/lib/catalog/types";
import {useHydrated} from "@/lib/use-hydrated";
import {ArticleCard} from "@/components/marketing/article-card";
import {Button} from "@/components/ui/button";

const PAGE = 12;

// Newest-first article cards, 12 at a time. All cards are in the HTML for SEO;
// extra cards are only `hidden` after hydration, so no-JS visitors see the
// full list (learn/article-grid spec).
export function ArticleGrid({articles}: {articles: Article[]}) {
  const hydrated = useHydrated();
  const [shown, setShown] = useState(PAGE);
  if (articles.length === 0) {
    return (
      <p className="text-text-muted">
        Articles are coming soon. In the meantime,{" "}
        <a href="/seminars" className="font-semibold text-brand-strong underline">
          join our free seminar
        </a>
        .
      </p>
    );
  }
  const hasMore = hydrated && shown < articles.length;
  return (
    <>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <li key={article.id} className={cn(hydrated && index >= shown && "hidden")}>
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>
      {hasMore ? (
        <div className="mt-8 text-center">
          <Button variant="secondary" onClick={() => setShown((n) => n + PAGE)}>
            Show more articles
          </Button>
        </div>
      ) : null}
    </>
  );
}
