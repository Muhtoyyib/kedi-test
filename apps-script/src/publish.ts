// One-click publish (design §5): the menu item runs the same validation as the
// catalog endpoint, then dispatches the GitHub deploy workflow. The workflow
// calls back through ?action=publish_result which updates the Publish Log.

import {buildCatalog, type StoreLike} from "./catalog.ts";
import {prop} from "./env.ts";
import {TABS} from "./schema.ts";
import type {Store} from "./store.ts";
import {str, type Cell} from "./table.ts";
import {Issues, type Issue} from "./validate.ts";

export type Result<T> = {ok: true; value: T} | {ok: false; code: string};

export function publishRequested(store: Store, by: string, now: Date): void {
  store.append(TABS.publishLog, {requested_at: now.toISOString(), requested_by: by, status: "Requested"});
}

export interface PublishResult {
  status: string;
  runUrl: string;
  commit: string;
  message: string;
}

export function parsePublishResult(raw: unknown): PublishResult | null {
  if (typeof raw !== "object" || raw === null) return null;
  const p = raw as Record<string, unknown>;
  const status = str(p.status as Cell);
  if (!["success", "failure", "cancelled"].includes(status)) return null;
  return {
    status,
    runUrl: str(p.runUrl as Cell).slice(0, 500),
    commit: str(p.commit as Cell).slice(0, 40),
    message: str(p.message as Cell).slice(0, 500),
  };
}

/** Update the most recent "Requested" log row with the outcome. */
export function handlePublishResult(store: Store, result: PublishResult, now: Date): {ok: true} {
  const log = store.table(TABS.publishLog);
  const open = [...log.rows].reverse().find((r) => str(r.rec.status) === "Requested" || str(r.rec.status) === "In progress");
  if (!open) return {ok: true};
  store.patch(TABS.publishLog, open.row, {
    status: result.status === "success" ? "Live" : "Failed",
    run_url: result.runUrl,
    finished_at: now.toISOString(),
    commit: result.commit,
    message: result.message,
  });
  return {ok: true};
}

/** Validation shared by the catalog endpoint and the publish menu. */
export function checkContent(store: StoreLike): {issues: Issue[]; errors: Issue[]; warnings: Issue[]} {
  const issues = new Issues();
  buildCatalog(store, issues);
  return {issues: issues.list, errors: issues.errors, warnings: issues.warnings};
}

export function issuesDialogText(issues: Issue[]): string {
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const lines = (list: Issue[]) => list.map((i) => `• ${i.tab} row ${i.row}${i.id ? ` (${i.id})` : ""}: ${i.message}`);
  const parts: string[] = [];
  if (errors.length)
    parts.push(`${errors.length} problem${errors.length === 1 ? "" : "s"} must be fixed before publishing:\n${lines(errors).join("\n")}`);
  if (warnings.length) parts.push(`${warnings.length} thing${warnings.length === 1 ? "" : "s"} to check:\n${lines(warnings).join("\n")}`);
  return parts.join("\n\n") || "Everything looks good — nothing to fix.";
}

// ── GAS-facing ──────────────────────────────────────────────────────────────

const GITHUB_DISPATCH = (repo: string) => `https://api.github.com/repos/${repo}/actions/workflows/deploy.yml/dispatches`;

export function deployErrorMessage(code: number): string {
  if (code === 401) return "GitHub token expired — contact the developer to renew it.";
  if (code === 404) return "GitHub repo or workflow not found — check GITHUB_REPO in Script Properties.";
  return `GitHub returned ${code}.`;
}

export function dispatchDeploy(reason: string): {ok: boolean; message: string} {
  const token = prop("GITHUB_TOKEN");
  const repo = prop("GITHUB_REPO");
  if (!token || !repo) return {ok: false, message: "GITHUB_TOKEN or GITHUB_REPO is missing from Script Properties."};
  const res = UrlFetchApp.fetch(GITHUB_DISPATCH(repo), {
    method: "post",
    contentType: "application/json",
    headers: {Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json"},
    payload: JSON.stringify({ref: "main", inputs: {reason}}),
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() === 204) return {ok: true, message: ""};
  return {ok: false, message: `${deployErrorMessage(res.getResponseCode())} ${res.getContentText().slice(0, 200)}`};
}
