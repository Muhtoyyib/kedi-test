import type {Video} from "@/lib/catalog/types";
import {siteConfig} from "@/lib/site-config";
import {SectionHeader} from "@/components/marketing/section-header";
import {SiteSection} from "@/components/marketing/site-section";
import {VideoEmbed} from "@/components/ui/video-embed";

function videoAspect(video: Video): "16/9" | "9/16" {
  return video.video.provider === "tiktok" ? "9/16" : "16/9";
}

function VideoCard({video}: {video: Video}) {
  return (
    <li className="w-[70%] shrink-0 snap-start md:w-auto">
      <VideoEmbed
        provider={video.video.provider}
        id={video.video.id}
        title={video.title}
        poster={video.video.poster.variants.at(-1)?.webp}
        location="learn_hub"
        aspect={videoAspect(video)}
      />
      <p className="mt-2 font-semibold text-ink">{video.title}</p>
      {video.durationText ? <p className="text-sm text-text-muted">{video.durationText}</p> : null}
    </li>
  );
}

function SocialLinks() {
  const {youtube, tiktok} = siteConfig.socials;
  return (
    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
      {youtube.startsWith("http") ? (
        <a href={youtube} target="_blank" rel="noopener" className="font-semibold text-brand-strong hover:underline">
          More videos on YouTube
        </a>
      ) : null}
      {tiktok.startsWith("http") ? (
        <a href={tiktok} target="_blank" rel="noopener" className="font-semibold text-brand-strong hover:underline">
          Follow us on TikTok
        </a>
      ) : null}
    </div>
  );
}

// Facades only — no iframes load until a visitor taps play (learn/video-library
// spec). Hidden entirely when the Videos tab is empty.
export function VideoLibrary({videos}: {videos: Video[]}) {
  if (videos.length === 0) return null;
  const portrait = videos.every((v) => videoAspect(v) === "9/16");
  return (
    <SiteSection tone="surface" aria-labelledby="videos-heading">
      <SectionHeader title="Watch and learn" />
      <ul
        className={`-mx-4 mt-8 flex snap-x gap-6 overflow-x-auto px-4 no-scrollbar md:mx-0 md:grid md:snap-none md:overflow-visible md:px-0 ${portrait ? "md:grid-cols-4" : "md:grid-cols-3"}`}
      >
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </ul>
      <SocialLinks />
    </SiteSection>
  );
}
