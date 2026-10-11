import {useHydrated} from "@/lib/use-hydrated";
import {getArticles, getTopicsWithCounts} from "@/lib/catalog/articles";
import {getVideos} from "@/lib/catalog/videos";
import {SiteSection} from "@/components/marketing/site-section";
import {ArticleGrid} from "./components/article-grid";
import {HubHeader} from "./components/hub-header";
import {TopicFilter} from "./components/topic-filter";
import {VideoLibrary} from "./components/video-library";
import {useLearnTopic} from "./use-learn-topic";

// /learn — articles newest first; ?topic= filters articles and videos after
// hydration. The prerendered HTML always shows all articles.
export function LearnHubView() {
  const hydrated = useHydrated();
  const {topic, setTopic} = useLearnTopic();
  const activeTopic = hydrated ? topic : null;
  const articles = getArticles(activeTopic ? {topic: activeTopic} : {});
  const videos = getVideos(activeTopic ? {topic: activeTopic} : {});
  return (
    <>
      <HubHeader featured={activeTopic ? undefined : getArticles()[0]} />
      <SiteSection tone="canvas" aria-labelledby="articles-heading">
        <h2 id="articles-heading" className="sr-only">
          Articles
        </h2>
        <TopicFilter counts={getTopicsWithCounts()} value={activeTopic} onChange={setTopic} />
        <div className="mt-8">
          <ArticleGrid articles={articles} />
        </div>
      </SiteSection>
      <VideoLibrary videos={videos} />
    </>
  );
}
