import type {Story} from "@/lib/catalog/types";
import {RichText} from "@/components/content/rich-text";
import {Prose} from "@/components/ui/prose";
import {SiteSection} from "@/components/marketing/site-section";
import {StoryCard} from "@/components/marketing/story-card";

// Longer Sheet text: the beginning is always visible (clamped to 4 lines) and
// the full text expands via details/summary — no JS needed.
function FullStory({paragraphs}: {paragraphs: string[]}) {
  return (
    <Prose className="mt-4">
      <p className="line-clamp-4">{paragraphs.join(" ")}</p>
      <details className="mt-2">
        <summary className="cursor-pointer font-semibold text-brand-strong">Read full story</summary>
        <RichText paragraphs={paragraphs} className="mt-2" />
      </details>
    </Prose>
  );
}

// Every written story, featured first then newest, each deep-linkable by slug
// (stories/written-stories spec).
export function WrittenStories({stories}: {stories: Story[]}) {
  if (stories.length === 0) return null;
  return (
    <SiteSection tone="canvas" aria-labelledby="written-stories-heading">
      <h2 id="written-stories-heading" className="sr-only">
        Written stories
      </h2>
      <div className="gap-6 md:columns-2 lg:columns-3">
        {stories.map((story) => (
          <article key={story.id} id={story.slug} className="mb-6 scroll-mt-24 break-inside-avoid">
            <StoryCard story={story} />
            {story.fullStory.length > 0 ? <FullStory paragraphs={story.fullStory} /> : null}
          </article>
        ))}
      </div>
    </SiteSection>
  );
}
