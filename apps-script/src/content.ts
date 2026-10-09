// Client-written content tabs — Highlights, Videos, Stories (design §7).
// Articles live in docs.ts. All functions are pure over the Store so the
// consent and wording rules are testable without GAS.

import {CONSENT_CHANNELS, TABS, TOPICS, type Topic} from "./schema.ts";
import {dateOnly, splitList, str, yn, type TableRow} from "./table.ts";
import {bannedWordsIn, isIsoDate, type Issues} from "./validate.ts";

export interface VideoLink {
  provider: "youtube" | "tiktok";
  id: string;
  url: string;
}

/** Accepts youtube.com/watch?v=, youtu.be/, /shorts/, /live/ and tiktok.com/@u/video/. */
export function parseVideoUrl(raw: string): VideoLink | null {
  const url = str(raw);
  const yt =
    url.match(/^https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=|shorts\/|live\/)([\w-]{6,})/) ??
    url.match(/^https?:\/\/youtu\.be\/([\w-]{6,})/);
  if (yt) return {provider: "youtube", id: yt[1], url};
  const tt = url.match(/^https?:\/\/(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
  if (tt) return {provider: "tiktok", id: tt[1], url};
  return null;
}

export interface VideoItem {
  id: string;
  title: string;
  topic: Topic;
  durationText: string | null;
  date: string;
  video: VideoLink;
}

export function videosFrom(store: {table: (t: string) => {rows: TableRow[]}}, issues: Issues): VideoItem[] {
  const out: VideoItem[] = [];
  for (const {row, rec} of store.table(TABS.videos).rows) {
    const id = str(rec.video_id);
    if (!yn(rec.active)) continue;
    const video = parseVideoUrl(str(rec.url));
    if (!video) {
      issues.error(TABS.videos, row, id, `Videos row ${row}: this link isn't a YouTube or TikTok video link`);
      continue;
    }
    if (!(TOPICS as readonly string[]).includes(str(rec.topic))) {
      issues.error(TABS.videos, row, id, `topic must be one of: ${TOPICS.join(", ")}`);
      continue;
    }
    if (!str(rec.title) || !isIsoDate(dateOnly(rec.date) ?? "")) {
      issues.error(TABS.videos, row, id, "title and a valid date (YYYY-MM-DD) are required");
      continue;
    }
    out.push({
      id,
      title: str(rec.title),
      topic: str(rec.topic) as Topic,
      durationText: str(rec.duration_text) || null,
      date: dateOnly(rec.date)!,
      video,
    });
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

const STORY_NAME = /^[A-Z][a-zA-Z'-]+ [A-Z]\.$/;

export interface StoryItem {
  id: string;
  slug: string;
  name: string;
  area: string;
  quote: string;
  fullStory: string[];
  photoId: string | null;
  video: VideoLink | null;
  kind: "written" | "video";
  consent: {date: string; channel: string};
  featured: boolean;
  date: string;
}

export function storiesFrom(store: {table: (t: string) => {rows: TableRow[]}}, issues: Issues): StoryItem[] {
  const out: StoryItem[] = [];
  const seen = new Set<string>();
  for (const {row, rec} of store.table(TABS.stories).rows) {
    const id = str(rec.story_id);
    if (!yn(rec.active)) continue;
    if (seen.has(id)) {
      issues.error(TABS.stories, row, id, `duplicate story_id ${id}`);
      continue;
    }
    seen.add(id);
    if (!consentOk(rec, row, id, issues)) continue;
    out.push(storyItem(rec, row, id, issues));
  }
  return capFeatured(
    out.sort((a, b) => (a.date < b.date ? 1 : -1)),
    issues
  );
}

function consentOk(rec: Record<string, unknown>, row: number, id: string, issues: Issues): boolean {
  if (!STORY_NAME.test(str(rec.name as string))) {
    issues.error(TABS.stories, row, id, "Use first name and initial only, e.g. Ngozi A.");
    return false;
  }
  const consentDate = dateOnly(rec.consent_date as never);
  if (!consentDate) {
    issues.warn(TABS.stories, row, id, `Story ${id} is not published because there's no consent date`);
    return false;
  }
  if (!CONSENT_CHANNELS.includes(str(rec.consent_channel as string))) {
    issues.error(TABS.stories, row, id, "consent_channel must be WhatsApp, Written or Email");
    return false;
  }
  if (!str(rec.quote as string) || !str(rec.area as string) || !dateOnly(rec.date as never)) {
    issues.error(TABS.stories, row, id, "quote, area and a valid date are required");
    return false;
  }
  return true;
}

function storyItem(rec: Record<string, unknown>, row: number, id: string, issues: Issues): StoryItem {
  const name = str(rec.name as string);
  const text = `${str(rec.quote as string)}\n${str(rec.full_story as string)}`;
  for (const word of bannedWordsIn(text)) {
    issues.error(TABS.stories, row, id, `Story ${id}: '${word}' — health claims aren't allowed in customer stories`);
  }
  let photoId = str(rec.photo_id as string) || null;
  let video = str(rec.video_url as string) ? parseVideoUrl(str(rec.video_url as string)) : null;
  if (photoId && !yn(rec.consent_photo as never)) {
    issues.warn(TABS.stories, row, id, `Story ${id}: photo dropped — consent_photo is not Yes`);
    photoId = null;
  }
  if (video && !yn(rec.consent_video as never)) {
    issues.warn(TABS.stories, row, id, `Story ${id}: video dropped — consent_video is not Yes`);
    video = null;
  }
  if (str(rec.video_url as string) && yn(rec.consent_video as never) && !video) {
    issues.error(TABS.stories, row, id, "video_url isn't a YouTube or TikTok link");
  }
  return {
    id,
    slug: id.toLowerCase(),
    name,
    area: str(rec.area as string),
    quote: str(rec.quote as string),
    fullStory: str(rec.full_story as string)
      .split(/\n\s*\n/)
      .filter(Boolean),
    photoId,
    video,
    kind: video ? "video" : "written",
    consent: {date: dateOnly(rec.consent_date as never)!, channel: str(rec.consent_channel as string).toLowerCase()},
    featured: yn(rec.featured as never),
    date: dateOnly(rec.date as never)!,
  };
}

function capFeatured(stories: StoryItem[], issues: Issues): StoryItem[] {
  const featured = stories.filter((s) => s.featured);
  if (featured.length <= 3) return stories;
  for (const s of featured.slice(3)) {
    issues.warn(TABS.stories, 0, s.id, `Story ${s.id}: more than 3 featured stories — only the newest 3 are used`);
    s.featured = false;
  }
  return stories;
}

export interface HighlightItem {
  id: string;
  date: string;
  topic: string;
  seminarId: string | null;
  photoIds: string[];
  photoAlts: string[];
  video: VideoLink | null;
  comment: {text: string; name: string} | null;
}

export function highlightsFrom(store: {table: (t: string) => {rows: TableRow[]}}, issues: Issues): HighlightItem[] {
  const out: HighlightItem[] = [];
  for (const {row, rec} of store.table(TABS.highlights).rows) {
    const id = str(rec.highlight_id);
    if (!yn(rec.active)) continue;
    const photos = splitList(rec.photo_ids);
    if (photos.length === 0) {
      issues.error(TABS.highlights, row, id, `Highlight ${id}: at least one photo is required`);
      continue;
    }
    if (photos.length > 8) issues.error(TABS.highlights, row, id, `Highlight ${id}: at most 8 photos`);
    let comment: HighlightItem["comment"] = null;
    if (str(rec.comment_text)) {
      if (dateOnly(rec.comment_consent_date)) {
        comment = {text: str(rec.comment_text), name: str(rec.comment_name) || "An attendee"};
        for (const word of bannedWordsIn(comment.text)) {
          issues.error(TABS.highlights, row, id, `Highlight ${id} comment: '${word}' — health claims aren't allowed`);
        }
      } else {
        issues.warn(TABS.highlights, row, id, `Highlight ${id}: comment dropped — no comment_consent_date`);
      }
    }
    const videoUrl = str(rec.video_url);
    const video = videoUrl ? parseVideoUrl(videoUrl) : null;
    if (videoUrl && !video) issues.error(TABS.highlights, row, id, `Highlight ${id}: video link isn't YouTube or TikTok`);
    out.push({
      id,
      date: dateOnly(rec.date) ?? "",
      topic: str(rec.topic),
      seminarId: str(rec.seminar_id) || null,
      photoIds: photos,
      photoAlts: splitList(rec.photo_alts, "|"),
      video,
      comment,
    });
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}
