import type {Highlight} from "@/lib/catalog/types";
import {formatSeminarDate} from "@/lib/format/seminar-date";
import {siteConfig} from "@/lib/site-config";
import {Button} from "@/components/ui/button";
import {ResponsiveImage} from "@/components/ui/responsive-image";
import {VideoEmbed} from "@/components/ui/video-embed";
import {SiteSection} from "@/components/marketing/site-section";

function posterUrl(h: Highlight): string | undefined {
  return h.video?.poster.variants.find((v) => v.width === 768)?.webp ?? h.video?.poster.variants.at(-1)?.webp;
}

function PhotoGrid({h}: {h: Highlight}) {
  if (h.photos.length === 0) return null;
  return (
    <ul className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto no-scrollbar md:grid md:snap-none md:grid-cols-3 md:overflow-visible">
      {h.photos.map((photo, i) => (
        <li
          key={photo.key}
          className={i === 0 ? "w-[80%] shrink-0 snap-start md:w-auto md:row-span-2" : "w-[80%] shrink-0 snap-start md:w-auto"}
        >
          <ResponsiveImage image={photo} sizes="(min-width: 768px) 33vw, 80vw" className="aspect-4/3 w-full rounded-card md:h-full" />
        </li>
      ))}
    </ul>
  );
}

function Comment({comment}: {comment: NonNullable<Highlight["comment"]>}) {
  return (
    <figure className="mt-4 max-w-prose rounded-card border border-line bg-surface p-4">
      <blockquote className="text-base text-ink">“{comment.text}”</blockquote>
      <figcaption className="mt-2 text-sm font-semibold text-text-muted">— {comment.name}</figcaption>
    </figure>
  );
}

function HighlightCard({h}: {h: Highlight}) {
  return (
    <article>
      <h3 className="text-lg font-bold text-text-heading">{h.topic}</h3>
      <p className="mt-1 text-sm text-text-muted">{formatSeminarDate(h.date)}</p>
      <PhotoGrid h={h} />
      {h.video ? (
        <VideoEmbed
          provider={h.video.provider}
          id={h.video.id}
          title={`Clip: ${h.topic}`}
          poster={posterUrl(h)}
          location="seminar_highlights"
          className="mt-4"
        />
      ) : null}
      {h.comment ? <Comment comment={h.comment} /> : null}
    </article>
  );
}

// "Past seminar highlights" — proof the sessions are real. Hidden when the
// Sheet has no Highlights rows.
export function PastHighlights({highlights}: {highlights: Highlight[]}) {
  if (highlights.length === 0) return null;
  const instagram = siteConfig.socials.instagram;
  return (
    <SiteSection tone="canvas" aria-labelledby="highlights-heading">
      <h2 id="highlights-heading" className="text-h2 text-text-heading">
        Past seminar highlights
      </h2>
      <p className="mt-2 text-base text-text-muted">A look at recent sessions.</p>
      <div className="mt-8 space-y-10">
        {highlights.map((h) => (
          <HighlightCard key={h.id} h={h} />
        ))}
      </div>
      {typeof instagram === "string" && instagram.startsWith("http") ? (
        <Button variant="secondary" href={instagram} target="_blank" rel="noopener" className="mt-8">
          See more on Instagram
        </Button>
      ) : null}
    </SiteSection>
  );
}
