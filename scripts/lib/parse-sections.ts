// Section parsers for the Sheet-managed scalar tabs: Settings, Delivery and
// Seminar Schedule.

import {isRecord, type UntrustedRecord, type UntrustedValue} from "../../src/lib/untrusted.ts";
import type {DeliveryArea, Seminar, Settings} from "../../src/lib/catalog/types.ts";
import {at, type Collector, eachRow, isHttps, isIsoDate, list, optNum, str} from "./parse-utils.ts";

export function parseDelivery(rows: UntrustedValue, c: Collector): DeliveryArea[] {
  const zones = ["local", "interstate", "pickup"];
  const out: (DeliveryArea & {sortOrder: number})[] = [];
  eachRow(rows, (rec, i) => {
    const zone = str(rec, "zone");
    const fee = optNum(rec, "feeNgn") ?? optNum(rec, "fee_ngn");
    if (!str(rec, "area") || !zones.includes(zone) || fee === null) {
      c.error(at("Delivery", i, str(rec, "area")), `area, zone (${zones.join("/")}) and a numeric fee_ngn are required`);
      return;
    }
    out.push({
      area: str(rec, "area"),
      zone: zone as DeliveryArea["zone"],
      feeNgn: fee,
      timelineText: str(rec, "timelineText") || str(rec, "timeline_text"),
      sortOrder: optNum(rec, "sortOrder") ?? optNum(rec, "sort_order") ?? 999,
    });
  });
  return out.sort((a, b) => a.sortOrder - b.sortOrder).map(({sortOrder: _s, ...rest}) => rest);
}

function parseBank(bank: UntrustedRecord): Settings["bank"] {
  const name = str(bank, "name");
  const accountName = str(bank, "accountName");
  const accountNumber = str(bank, "accountNumber");
  return name && accountName && accountNumber ? {name, accountName, accountNumber} : null;
}

const ANNOUNCEMENT_MAX = 90;

// One line on every page, so the Sheet text is truncated at a word boundary
// rather than letting it wrap the announcement bar.
function parseAnnouncement(ann: UntrustedRecord): Settings["announcement"] {
  const raw = str(ann, "text");
  if (!raw) return null;
  let text = raw;
  if (raw.length > ANNOUNCEMENT_MAX) {
    text = raw.slice(0, ANNOUNCEMENT_MAX + 1).replace(/\s+\S*$/, "");
    console.warn(`catalog: announcement truncated to ${ANNOUNCEMENT_MAX} chars ("${raw.slice(0, 30)}…")`);
  }
  return {text, href: str(ann, "href") || null};
}

export function parseSettings(raw: UntrustedValue): Settings {
  const kv = isRecord(raw) ? raw : {};
  const get = (key: string) => str(kv, key);
  return {
    bank: isRecord(kv.bank) ? parseBank(kv.bank) : null,
    openingHours: get("openingHours"),
    pickupAddress: get("pickupAddress"),
    deliveryNote: get("deliveryNote"),
    announcement: isRecord(kv.announcement) ? parseAnnouncement(kv.announcement) : null,
    seminarOfferText: get("seminarOfferText") || null,
    referralRewardText: get("referralRewardText"),
    referralFriendRewardText: get("referralFriendRewardText"),
    loyaltyText: get("loyaltyText") || null,
    freeDeliveryThresholdNgn: optNum(kv, "freeDeliveryThresholdNgn"),
  };
}

/** ISO "startsAt" if present, else `date` + `HH:mm` combined as +01:00. */
function seminarIso(rec: UntrustedRecord, isoKey: string, timeKey: string): string | null {
  const iso = str(rec, isoKey);
  if (iso && !Number.isNaN(Date.parse(iso))) return iso;
  const date = str(rec, "date");
  const time = str(rec, timeKey) || str(rec, timeKey.replace(/_time$/, "Time"));
  if (isIsoDate(date) && /^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return `${date}T${time}:00+01:00`;
  return null;
}

function seminarProblem(rec: UntrustedRecord, id: string, startsAt: string | null): string | null {
  if (!id || !startsAt || !seminarIso(rec, "endsAt", "end_time")) return "seminar needs an ID and ISO start/end (or date + HH:mm times)";
  if (!isHttps(str(rec, "lumaUrl") || str(rec, "luma_url"))) return "luma_url must be an https:// link";
  if (!["physical", "online"].includes(str(rec, "format")) || !["scheduled", "cancelled", "done"].includes(str(rec, "status"))) {
    return "format must be physical/online and status scheduled/cancelled/done";
  }
  return null;
}

export function parseSeminars(rows: UntrustedValue, c: Collector): Seminar[] {
  const out: Seminar[] = [];
  eachRow(rows, (rec, i) => {
    const id = str(rec, "id") || str(rec, "seminar_id");
    const startsAt = seminarIso(rec, "startsAt", "start_time");
    const problem = seminarProblem(rec, id, startsAt);
    if (problem) {
      c.error(at("Seminar Schedule", i, id), problem);
      return;
    }
    out.push({
      id,
      startsAt: startsAt as string,
      endsAt: seminarIso(rec, "endsAt", "end_time") as string,
      topic: str(rec, "topic"),
      summary: str(rec, "summary"),
      learnPoints: list(rec, "learnPoints", "|"),
      audience: str(rec, "audience"),
      format: str(rec, "format") as Seminar["format"],
      venue: str(rec, "venue"),
      lumaUrl: str(rec, "lumaUrl") || str(rec, "luma_url"),
      lumaEventId: str(rec, "lumaEventId") || str(rec, "luma_event_id"),
      status: str(rec, "status") as Seminar["status"],
      recordingUrl: str(rec, "recordingUrl") || str(rec, "recording_url") || null,
    });
  });
  return out.sort((a, b) => (a.startsAt < b.startsAt ? -1 : 1));
}
