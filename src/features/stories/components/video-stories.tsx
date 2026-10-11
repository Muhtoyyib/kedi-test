import type {Story} from "@/lib/catalog/types";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";
import {VideoEmbed} from "@/components/ui/video-embed";

// Consented video testimonials — facades only, one iframe per tap
// (stories/video-stories spec). Hidden when the Sheet has none.
export function VideoStories({stories}: {stories: Story[]}) {
  const videos = stories.filter((s) => s.video !== null);
  if (videos.length === 0) return null;
  return (
    <SiteSection tone="surface" aria-labelledby="video-stories-heading">
      <SectionHeader title="Watch their stories" />
      <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((story) => (
          <li key={story.id} id={story.slug} className="scroll-mt-24">
            <VideoEmbed
              provider={story.video!.provider}
              id={story.video!.id}
              title={`${story.name} — customer story`}
              poster={story.video!.poster.variants.at(-1)?.webp}
              location="stories"
              aspect={story.video!.provider === "tiktok" ? "9/16" : "16/9"}
            />
            <p className="mt-2 font-semibold text-ink">
              {story.name} · {story.area}
            </p>
            <p className="text-sm text-text-muted">{story.quote}</p>
          </li>
        ))}
      </ul>
    </SiteSection>
  );
}
