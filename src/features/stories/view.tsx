import {getStories} from "@/lib/catalog/stories";
import type {Story} from "@/lib/catalog/types";
import {ShareYourStory} from "./components/share-your-story";
import {StoriesIntro} from "./components/stories-intro";
import {VideoStories} from "./components/video-stories";
import {WrittenStories} from "./components/written-stories";

// /stories — written + video testimonials from the Sheet (consented rows only
// reach the catalog). With zero stories the page still renders intro + CTA.
export function StoriesView({stories = getStories()}: {stories?: Story[]}) {
  const written = stories.filter((s) => s.kind === "written");
  return (
    <>
      <StoriesIntro empty={stories.length === 0} />
      <WrittenStories stories={written} />
      <VideoStories stories={stories} />
      <ShareYourStory />
    </>
  );
}
