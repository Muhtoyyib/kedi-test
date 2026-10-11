import {Play} from "lucide-react";
import type {Story} from "@/lib/catalog/types";
import {Card} from "@/components/ui/card";
import {ResponsiveImage} from "@/components/ui/responsive-image";

const QUOTE_MAX = 220;

function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).trimEnd()}…`;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function Avatar({story}: {story: Story}) {
  if (story.photo) {
    return <ResponsiveImage image={story.photo} sizes="48px" className="size-12 shrink-0 rounded-full object-cover" />;
  }
  return (
    <span
      aria-hidden="true"
      className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-soft font-bold text-brand-strong"
    >
      {initials(story.name)}
    </span>
  );
}

// One customer story (quote, name + area, optional photo/watch link).
// Text comes only from consented Sheet fields — never rewritten in code.
export function StoryCard({story}: {story: Story}) {
  return (
    <Card className="flex h-full flex-col bg-canvas p-6">
      <figure className="flex h-full flex-col">
        <span className="text-3xl leading-none text-sun" aria-hidden="true">
          “
        </span>
        <blockquote className="mt-2 text-lead text-ink">{truncateAtWord(story.quote, QUOTE_MAX)}</blockquote>
        <figcaption className="mt-auto flex items-center gap-3 pt-5">
          <Avatar story={story} />
          <span>
            <span className="block font-semibold text-ink">{story.name}</span>
            <span className="block text-sm text-text-muted">{story.area}</span>
          </span>
          {story.video ? (
            <a href={`/stories#${story.slug}`} className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-brand-strong">
              <Play className="size-4" aria-hidden="true" /> Watch
            </a>
          ) : null}
        </figcaption>
      </figure>
    </Card>
  );
}
