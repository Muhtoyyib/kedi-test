import {Link} from "@tanstack/react-router";
import {Fragment, type ReactNode} from "react";
import type {Inline} from "@/lib/catalog/types";

// Renders ArticleBlock inline runs. Text is always a React text node — never
// HTML. External links get a new tab without opener access; internal /…
// links go through the router.
export function Inlines({items}: {items: Inline[]}) {
  return (
    <>
      {items.map((inline, i) => (
        <Fragment key={i}>{renderInline(inline)}</Fragment>
      ))}
    </>
  );
}

function renderInline(inline: Inline): ReactNode {
  const text = mark(inline);
  if (!inline.href) return text;
  if (inline.href.startsWith("/")) {
    return <Link to={inline.href}>{text}</Link>;
  }
  return (
    <a href={inline.href} target="_blank" rel="noopener">
      {text}
    </a>
  );
}

function mark(inline: Inline): ReactNode {
  let node: ReactNode = inline.text;
  if (inline.italic) node = <em>{node}</em>;
  if (inline.bold) node = <strong>{node}</strong>;
  return node;
}
