import type {Story} from "@/lib/catalog/types";
import {Button} from "@/components/ui/button";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";
import {StoryCard} from "@/components/marketing/story-card";

// Up to three consented stories — featured first, then newest (getStories
// already orders that way). Hidden entirely when none are published.
export function StoriesPreview({stories}: {stories: Story[]}) {
  if (stories.length === 0) return null;
  return (
    <SiteSection tone="surface">
      <div className="md:flex md:items-end md:justify-between">
        <SectionHeader eyebrow="Customer stories" title="What our customers say about the service" />
        <Button variant="secondary" href="/stories" className="max-md:hidden">
          Read more stories
        </Button>
      </div>
      <ul className="no-scrollbar mt-8 flex snap-x gap-4 overflow-x-auto md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
        {stories.map((s) => (
          <li key={s.id} className="w-[85%] shrink-0 snap-start md:w-auto">
            <StoryCard story={s} />
          </li>
        ))}
      </ul>
      <Button variant="secondary" href="/stories" fullWidth className="mt-6 md:hidden">
        Read more stories
      </Button>
    </SiteSection>
  );
}
