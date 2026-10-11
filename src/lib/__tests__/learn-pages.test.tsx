import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {act, render, screen} from "@testing-library/react";
import {createMemoryHistory, createRootRoute, createRoute, createRouter, notFound, Outlet, RouterProvider} from "@tanstack/react-router";
import {markAnalyticsReady, resetAnalytics} from "@/lib/analytics/track";
import {getArticle, getArticles} from "@/lib/catalog/articles";
import {ToastProvider} from "@/components/ui/toast";
import {ArticleView} from "@/features/learn/components/article-view";
import {validateLearnSearch} from "@/features/learn/use-learn-topic";
import {LearnHubView} from "@/features/learn/view";

const articles = getArticles();
const gutGuide = getArticle("fixture-everyday-gut-guide")!;

// Minimal route tree mirroring learn.index + learn.$slug (same validateSearch
// and loader semantics as the real routes).
const rootRoute = createRootRoute({
  component: () => (
    <ToastProvider>
      <Outlet />
    </ToastProvider>
  ),
  notFoundComponent: () => <p>Page not found</p>,
});
const learnIndex = createRoute({
  getParentRoute: () => rootRoute,
  path: "/learn",
  validateSearch: validateLearnSearch,
  component: LearnHubView,
});
const learnSlug = createRoute({
  getParentRoute: () => rootRoute,
  path: "/learn/$slug",
  loader: ({params}) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return {article};
  },
  component: function ArticlePage() {
    const {article} = learnSlug.useLoaderData();
    return <ArticleView article={article} />;
  },
});
const routeTree = rootRoute.addChildren([learnIndex, learnSlug]);

function renderLearn(path: string) {
  const router = createRouter({routeTree, history: createMemoryHistory({initialEntries: [path]})});
  return render(<RouterProvider router={router} />);
}

beforeEach(() => {
  resetAnalytics();
  markAnalyticsReady();
  window.gtag = vi.fn();
  window.localStorage.clear();
});

describe("/learn pages", () => {
  it("lists articles newest first on the hub", async () => {
    renderLearn("/learn");
    await screen.findByRole("heading", {level: 1, name: "Practical wellness, in plain language"});
    const cards = screen.getAllByRole("heading", {level: 3}).map((h) => h.textContent);
    expect(cards.indexOf(articles[0].title)).toBeLessThan(cards.indexOf(articles[1].title));
  });

  it("filters articles and videos by ?topic= after hydration", async () => {
    renderLearn("/learn?topic=digestion");
    await screen.findByRole("button", {name: "Digestion (1)"});
    await act(async () => {});
    expect(screen.queryByText(articles.find((a) => a.topic === "energy")!.title)).not.toBeInTheDocument();
    expect(screen.getByText(articles.find((a) => a.topic === "digestion")!.title)).toBeInTheDocument();
    expect(screen.queryByText("Fixture — 60-second wellness tip")).not.toBeInTheDocument(); // energy video
    expect(screen.getByText("Fixture — Pack walkthrough")).toBeInTheDocument(); // digestion video
  });

  it("shows all articles for an unknown ?topic=", async () => {
    renderLearn("/learn?topic=unknown");
    await screen.findByRole("heading", {level: 1});
    await act(async () => {});
    // Featured card + grid both show the newest article — count all mentions.
    expect(screen.getAllByText(articles[0].title).length).toBeGreaterThan(0);
    expect(screen.getAllByText(articles[1].title).length).toBeGreaterThan(0);
  });

  it("renders an article page and 404s unknown slugs", async () => {
    renderLearn(`/learn/${gutGuide.slug}`);
    expect(await screen.findByRole("heading", {level: 1, name: gutGuide.title})).toBeInTheDocument();
    renderLearn("/learn/no-such-article");
    expect(await screen.findByText("Page not found")).toBeInTheDocument();
  });
});
