// Client-content section parsers: Videos, Stories and Highlights. These tabs
// hold client-written copy — the compliance re-check (compliance.ts) runs on
// top of what this produces.

import {isRecord, type UntrustedRecord, type UntrustedValue} from "../../src/lib/untrusted.ts";

import {TOPICS, type Topic} from "../../src/lib/catalog/types.ts";
import type {ParsedHighlight, ParsedStory, ParsedVideo} from "./parsed-types.ts";
import {at, bool, type Collector, eachRow, isIsoDate, list, paragraphs, parseVideoRef, str} from "./parse-utils.ts";

export function parseVideos(rows: UntrustedValue, c: Collector): ParsedVideo[] {
  const out: ParsedVideo[] = [];
  const seen = new Set<string>();
  eachRow(rows, (rec, i) => {
    const id = str(rec, "id") || str(rec, "video_id");
    const loc = at("Videos", i, id);
    if (seen.has(id)) {
      c.error(loc, `duplicate video_id "${id}"`);
      return;
    }
    seen.add(id);
    const video = parseVideoRef(rec.video);
    const topic = str(rec, "topic") as Topic;
    if (!id || !video || !TOPICS.includes(topic) || !str(rec, "title") || !isIsoDate(str(rec, "date"))) {
      c.error(loc, "video needs an id, a YouTube/TikTok link, a valid topic, a title and a date");
      return;
    }
    out.push({id, title: str(rec, "title"), topic, durationText: str(rec, "durationText") || null, date: str(rec, "date"), video});
  });
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

const STORY_NAME = /^[A-Z][a-zA-Z'-]+ [A-Z]\.$/;

function consentProblem(consent: UntrustedValue): string | null {
  const rec = isRecord(consent) ? consent : {};
  if (!isIsoDate(str(rec, "date")) || !["whatsapp", "written", "email"].includes(str(rec, "channel"))) {
    return "story needs a consent date and channel (whatsapp/written/email)";
  }
  return null;
}

function storyProblem(rec: UntrustedRecord, id: string): string | null {
  if (!id || !STORY_NAME.test(str(rec, "name")) || !str(rec, "area") || !str(rec, "quote") || !isIsoDate(str(rec, "date"))) {
    return "story needs an id, name (first name + initial), area, quote and a date";
  }
  const consent = consentProblem(rec.consent);
  if (consent) return consent;
  if (rec.video != null && !parseVideoRef(rec.video)) return "video_url isn't a YouTube or TikTok link";
  return null;
}

export function parseStories(rows: UntrustedValue, c: Collector): ParsedStory[] {
  const out: ParsedStory[] = [];
  const seen = new Set<string>();
  eachRow(rows, (rec, i) => {
    const id = str(rec, "id") || str(rec, "story_id");
    const loc = at("Stories", i, id);
    if (seen.has(id)) {
      c.error(loc, `duplicate story_id "${id}"`);
      return;
    }
    seen.add(id);
    const problem = storyProblem(rec, id);
    if (problem) {
      c.error(loc, problem);
      return;
    }
    const consent = rec.consent as UntrustedRecord;
    const video = parseVideoRef(rec.video);
    out.push({
      id,
      slug: str(rec, "slug") || id.toLowerCase(),
      name: str(rec, "name"),
      area: str(rec, "area"),
      quote: str(rec, "quote"),
      fullStory: paragraphs(rec, "fullStory"),
      photoId: str(rec, "photoId") || null,
      video,
      kind: video ? "video" : "written",
      consent: {date: str(consent, "date"), channel: str(consent, "channel") as ParsedStory["consent"]["channel"]},
      featured: bool(rec, "featured"),
      date: str(rec, "date"),
    });
  });
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

function highlightProblem(rec: UntrustedRecord, id: string): string | null {
  if (!id || !list(rec, "photoIds").length) return "highlight needs an id and at least one photo";
  if (rec.video != null && !parseVideoRef(rec.video)) return "video link isn't YouTube or TikTok";
  return null;
}

export function parseHighlights(rows: UntrustedValue, c: Collector): ParsedHighlight[] {
  const out: ParsedHighlight[] = [];
  const seen = new Set<string>();
  eachRow(rows, (rec, i) => {
    const id = str(rec, "id") || str(rec, "highlight_id");
    const loc = at("Highlights", i, id);
    if (seen.has(id)) {
      c.error(loc, `duplicate highlight_id "${id}"`);
      return;
    }
    seen.add(id);
    const problem = highlightProblem(rec, id);
    if (problem) {
      c.error(loc, problem);
      return;
    }
    const comment =
      isRecord(rec.comment) && str(rec.comment, "text")
        ? {text: str(rec.comment, "text"), name: str(rec.comment, "name") || "An attendee"}
        : null;
    out.push({
      id,
      date: str(rec, "date"),
      topic: str(rec, "topic"),
      seminarId: str(rec, "seminarId") || null,
      photoIds: list(rec, "photoIds").slice(0, 8),
      photoAlts: list(rec, "photoAlts", "|"),
      video: parseVideoRef(rec.video),
      comment,
    });
  });
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}
