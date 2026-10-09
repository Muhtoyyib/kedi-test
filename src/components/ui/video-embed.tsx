import {useState} from "react";
import {cn} from "cn";
import {Play} from "lucide-react";
import {track} from "@/lib/analytics/track";

interface VideoEmbedProps {
  provider: "youtube" | "tiktok";
  id: string;
  title: string;
  poster?: string;
  location: string;
  className?: string;
}

function embedSrc(provider: "youtube" | "tiktok", id: string) {
  return provider === "youtube" ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` : `https://www.tiktok.com/embed/${id}`;
}

// Click-to-load facade: no iframe is requested until the visitor taps play.
export function VideoEmbed({provider, id, title, poster, location, className}: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const thumbnail = poster ?? (provider === "youtube" ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined);

  if (playing) {
    return (
      <iframe
        src={embedSrc(provider, id)}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className={cn("aspect-video w-full rounded-card border-0", className)}
      />
    );
  }

  return (
    <button
      type="button"
      aria-label={`Play video: ${title}`}
      onClick={() => {
        setPlaying(true);
        track({event: "video_play", provider, location});
      }}
      className={cn("relative block aspect-video w-full overflow-hidden rounded-card bg-ink text-canvas", className)}
    >
      {thumbnail ? (
        <img src={thumbnail} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover opacity-80" />
      ) : null}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-sun text-ink shadow-overlay">
          <Play className="size-7 fill-current" aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}
