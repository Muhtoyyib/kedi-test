import {Link as LinkIcon} from "lucide-react";
import type {ReactNode} from "react";
import {Inlines} from "@/components/content/inlines";
import {Notice} from "@/components/ui/notice";
import {Prose} from "@/components/ui/prose";
import {ResponsiveImage} from "@/components/ui/responsive-image";
import {VideoEmbed} from "@/components/ui/video-embed";
import type {ArticleBlock, GeneratedImage, Inline} from "@/lib/catalog/types";

// Renders client-written article blocks (docs/content-model.md §2). Pure
// switch over the union — unknown types fail typecheck and are skipped at
// runtime. Text is always a text node, never HTML.

export function ArticleBody({blocks}: {blocks: ArticleBlock[]}) {
  return (
    <Prose>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </Prose>
  );
}

function Block({block}: {block: ArticleBlock}): ReactNode {
  switch (block.type) {
    case "h2":
      return (
        <h2 id={block.id} className="group scroll-mt-24">
          {block.text}
          <Anchor id={block.id} text={block.text} />
        </h2>
      );
    case "h3":
      return (
        <h3 id={block.id} className="scroll-mt-24">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p>
          <Inlines items={block.inlines} />
        </p>
      );
    case "ul":
    case "ol":
      return <ListBlock ordered={block.type === "ol"} items={block.items} />;
    case "image":
      return <FigureBlock image={block.image} alt={block.alt} />;
    case "video":
      return (
        <VideoEmbed
          provider={block.video.provider}
          id={block.video.id}
          title={block.video.url}
          poster={block.video.poster.variants.at(-1)?.webp}
          location="article"
        />
      );
    case "doctor-callout":
      return (
        <Notice tone="info" title="When to see a doctor">
          <div className="mt-1 space-y-2">
            {block.blocks.map((child, i) => (
              <Block key={i} block={child} />
            ))}
          </div>
        </Notice>
      );
    default:
      return null;
  }
}

function Anchor({id, text}: {id: string; text: string}) {
  return (
    <a
      href={`#${id}`}
      aria-label={`Link to ${text}`}
      className="ml-2 inline-flex align-middle text-text-muted opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
    >
      <LinkIcon className="size-4" aria-hidden="true" />
    </a>
  );
}

function ListBlock({ordered, items}: {ordered: boolean; items: Inline[][]}) {
  const children = items.map((item, i) => (
    <li key={i}>
      <Inlines items={item} />
    </li>
  ));
  return ordered ? <ol>{children}</ol> : <ul>{children}</ul>;
}

function FigureBlock({image, alt}: {image: GeneratedImage; alt: string}) {
  return (
    <figure>
      <ResponsiveImage image={image} sizes="(min-width: 768px) 720px, 100vw" className="rounded-card" />
      {alt.length > 40 ? <figcaption className="mt-2 text-sm text-text-muted">{alt}</figcaption> : null}
    </figure>
  );
}
