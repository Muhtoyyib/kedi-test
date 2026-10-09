// Request routing for the web app. Both routes are pure functions over
// injected dependencies — the GAS bindings (ContentService, CacheService,
// LockService) live in main.ts, so honeypot/size/rate-limit/dispatch are all
// testable in Node.

import {buildCatalog, type CatalogDeps} from "./catalog.ts";
import type {Bucket} from "./env.ts";
import {recordForm, parseFormPayload, type FormKind} from "./forms.ts";
import {docImage, driveImage} from "./images.ts";
import {parseOrderPayload, recordOrder} from "./orders.ts";
import {parsePublishResult, handlePublishResult} from "./publish.ts";
import {parseReferralPayload, registerReferralCode} from "./referrals.ts";
import type {Store} from "./store.ts";
import {Issues} from "./validate.ts";

export interface RouterDeps extends CatalogDeps {
  store: Store;
  tokenOk: (provided: string | undefined) => boolean;
  limiter: Bucket;
  now: Date;
}

const MAX_BODY = 10 * 1024;
const PER_PHONE_LIMIT = 5;
const PER_PHONE_WINDOW = 600; // 10 min
const GLOBAL_LIMIT = 60;
const GLOBAL_WINDOW = 60;

export function routeGet(params: Record<string, string>, deps: RouterDeps): Record<string, unknown> {
  switch (params.action) {
    case "catalog": {
      if (!deps.tokenOk(params.token)) return {ok: false, code: "unauthorized"};
      const issues = new Issues();
      const catalog = buildCatalog(deps.store, issues, deps);
      if (!catalog) return {ok: false, code: "invalid_catalog", issues: issues.list};
      return {ok: true, catalog, warnings: issues.warnings};
    }
    case "image": {
      if (!deps.tokenOk(params.token)) return {ok: false, code: "unauthorized"};
      const result = driveImage(params.id ?? "");
      return "error" in result ? {ok: false, code: "not_found", message: result.error} : {ok: true, ...result};
    }
    case "doc_image": {
      if (!deps.tokenOk(params.token)) return {ok: false, code: "unauthorized"};
      const result = docImage(params.doc ?? "", Number(params.n ?? -1));
      return "error" in result ? {ok: false, code: "not_found", message: result.error} : {ok: true, ...result};
    }
    default:
      return {ok: false, code: "not_found"};
  }
}

interface PostBody {
  type?: string;
  token?: string;
  payload?: unknown;
  hp?: string;
}

export function routePost(params: Record<string, string>, body: string, deps: RouterDeps): Record<string, unknown> {
  if (body.length > MAX_BODY) return {ok: false, code: "invalid_payload"};
  let parsed: PostBody;
  try {
    parsed = JSON.parse(body) as PostBody;
  } catch {
    return {ok: false, code: "invalid_payload"};
  }
  if (typeof parsed.hp === "string" ? parsed.hp.trim() !== "" : parsed.hp != null) return {ok: true};
  if (deps.limiter.incr("rl:all", GLOBAL_WINDOW) > GLOBAL_LIMIT) return {ok: false, code: "rate_limited"};
  if (params.action === "publish_result") return publishResultRoute(parsed, deps);
  return intakeRoute(parsed, deps);
}

function publishResultRoute(parsed: PostBody, deps: RouterDeps): Record<string, unknown> {
  if (!deps.tokenOk(parsed.token)) return {ok: false, code: "unauthorized"};
  const result = parsePublishResult(parsed.payload ?? parsed);
  if (!result) return {ok: false, code: "invalid_payload"};
  handlePublishResult(deps.store, result, deps.now);
  return {ok: true};
}

function intakeRoute(parsed: PostBody, deps: RouterDeps): Record<string, unknown> {
  if (parsed.type === "order") {
    const payload = parseOrderPayload(parsed.payload);
    if (!payload) return {ok: false, code: "invalid_payload"};
    if (deps.limiter.incr(`rl:${payload.phone}`, PER_PHONE_WINDOW) > PER_PHONE_LIMIT) return {ok: false, code: "rate_limited"};
    return recordOrder(deps.store, payload, deps.now);
  }
  if (parsed.type === "referral_code") {
    const payload = parseReferralPayload(parsed.payload);
    if (!payload) return {ok: false, code: "invalid_payload"};
    if (deps.limiter.incr(`rl:${payload.phone}`, PER_PHONE_WINDOW) > PER_PHONE_LIMIT) return {ok: false, code: "rate_limited"};
    return registerReferralCode(deps.store, payload, deps.now);
  }
  if (parsed.type === "contact" || parsed.type === "business_interest" || parsed.type === "seminar_interest") {
    const payload = parseFormPayload(parsed.type as FormKind, parsed.payload);
    if (!payload) return {ok: false, code: "invalid_payload"};
    if (deps.limiter.incr(`rl:${payload.phone}`, PER_PHONE_WINDOW) > PER_PHONE_LIMIT) return {ok: false, code: "rate_limited"};
    return recordForm(deps.store, payload, deps.now);
  }
  return {ok: false, code: "invalid_payload"};
}
