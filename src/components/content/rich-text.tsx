import {cn} from "cn";

// Story full-text paragraphs (story `fullStory`) — plain text only, no marks.
// The consumer wraps this in Prose when it wants article typography.
export function RichText({paragraphs, className}: {paragraphs: string[]; className?: string}) {
  return (
    <div className={cn("space-y-4", className)}>
      {paragraphs.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
}
