// Entry points. esbuild bundles everything into one IIFE, so each GAS entry
// point is assigned to globalThis at the bottom of this file.

import {settingsFrom} from "./catalog-tabs.ts";
import {checkContent, dispatchDeploy, issuesDialogText, publishRequested} from "./publish.ts";
import {sendTodoEmail} from "./followups.ts";
import {applyOrderStatus} from "./orders.ts";
import {routeGet, routePost} from "./router.ts";
import {newArticleFromTemplate, setupWorkbook} from "./setup.ts";
import {GasStore} from "./store.ts";
import {cacheBucket, json, prop, tokenMatches} from "./env.ts";
import {TABS} from "./schema.ts";
import {str, toDateStr} from "./table.ts";

function store(): GasStore {
  return new GasStore(SpreadsheetApp.getActive());
}

function deps() {
  return {
    store: store(),
    tokenOk: (token: string | undefined) => tokenMatches(token, prop("CATALOG_READ_TOKEN")),
    limiter: cacheBucket(CacheService.getScriptCache()),
    now: new Date(),
  };
}

function doGet(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.Content.TextOutput {
  return json(routeGet((e.parameter ?? {}) as Record<string, string>, deps()));
}

function doPost(e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput {
  const lock = LockService.getScriptLock();
  lock.waitLock(10_000);
  try {
    return json(routePost((e.parameter ?? {}) as Record<string, string>, e.postData?.contents ?? "", deps()));
  } finally {
    lock.releaseLock();
  }
}

// ── Menu ─────────────────────────────────────────────────────────────────────

function onOpen(): void {
  SpreadsheetApp.getUi()
    .createMenu("KEDI Website")
    .addItem("Publish website", "menuPublishWebsite")
    .addItem("Check content for errors", "menuCheckContent")
    .addItem("New article from template", "menuNewArticle")
    .addItem("Open last publish run", "menuOpenLastRun")
    .addItem("Send today's to-do email now", "menuSendTodo")
    .addItem("Setup workbook (run once)", "menuSetup")
    .addItem("Install daily triggers (run once)", "menuInstallTriggers")
    .addToUi();
}

function menuSetup(): void {
  setupWorkbook();
}

function menuCheckContent(): void {
  SpreadsheetApp.getUi().alert("Content check", issuesDialogText(checkContent(store()).issues), SpreadsheetApp.getUi().ButtonSet.OK);
}

function menuPublishWebsite(): void {
  const ui = SpreadsheetApp.getUi();
  const go = ui.alert("Publish website", "Publish your latest changes to the website? It takes about 3 minutes.", ui.ButtonSet.YES_NO);
  if (go !== ui.Button.YES) return;
  const check = checkContent(store());
  if (check.errors.length) {
    ui.alert("Fix these first", issuesDialogText(check.issues), ui.ButtonSet.OK);
    return;
  }
  if (check.warnings.length) {
    const anyway = ui.alert("A few things to check", `${issuesDialogText(check.issues)}\n\nPublish anyway?`, ui.ButtonSet.YES_NO);
    if (anyway !== ui.Button.YES) return;
  }
  const result = dispatchDeploy(`sheet-publish by ${Session.getActiveUser().getEmail()}`);
  if (!result.ok) {
    ui.alert("Publish didn't start", result.message, ui.ButtonSet.OK);
    return;
  }
  publishRequested(store(), Session.getActiveUser().getEmail(), new Date());
  ui.alert("Publishing…", "Your site updates in about 3 minutes. Check the Publish Log tab for the result.", ui.ButtonSet.OK);
}

function menuNewArticle(): void {
  const url = newArticleFromTemplate(store());
  const html = HtmlService.createHtmlOutput(
    `<p>Your new article is ready:</p><p><a href="${url}" target="_blank">Open "Untitled article"</a></p><p>An Articles row was added with ready = No — fill it in, set ready = Yes, then publish.</p>`
  )
    .setWidth(360)
    .setHeight(160);
  SpreadsheetApp.getUi().showModalDialog(html, "New article");
}

function menuOpenLastRun(): void {
  const log = store().table(TABS.publishLog);
  const last = log.rows[log.rows.length - 1];
  const url = last ? str(last.rec.run_url) : "";
  SpreadsheetApp.getUi().alert("Last publish run", url || "No publish runs yet.", SpreadsheetApp.getUi().ButtonSet.OK);
}

function menuSendTodo(): void {
  const s = store();
  sendTodoEmail(s, prop("DISTRIBUTOR_EMAIL"), {brand: prop("BRAND_NAME") || "KEDI", rewardText: settingsFrom(s).referralRewardText});
  SpreadsheetApp.getActive().toast("To-do email sent.", "KEDI Website");
}

// ── Triggers ─────────────────────────────────────────────────────────────────

function sendTodoEmailTrigger(): void {
  const s = store();
  sendTodoEmail(s, prop("DISTRIBUTOR_EMAIL"), {brand: prop("BRAND_NAME") || "KEDI", rewardText: settingsFrom(s).referralRewardText});
}

function onOrdersEdit(e: GoogleAppsScript.Events.SheetsOnEdit): void {
  const range = e.range;
  if (range.getSheet().getName() !== TABS.orders) return;
  const statusCol = store().table(TABS.orders).headers.indexOf("status") + 1;
  if (statusCol === 0 || range.getColumn() !== statusCol || range.getRow() === 1) return;
  applyOrderStatus(store(), range.getRow(), str(range.getValue()), toDateStr(new Date()));
}

function installTriggers(): void {
  const existing = ScriptApp.getProjectTriggers().map((t) => t.getHandlerFunction());
  if (!existing.includes("sendTodoEmailTrigger")) {
    ScriptApp.newTrigger("sendTodoEmailTrigger").timeBased().everyDays(1).atHour(7).inTimezone("Africa/Lagos").create();
  }
  if (!existing.includes("onOrdersEdit")) {
    ScriptApp.newTrigger("onOrdersEdit").forSpreadsheet(SpreadsheetApp.getActive()).onEdit().create();
  }
}

// Bundle wiring — GAS entry points must be properties of the global object.
Object.assign(globalThis, {
  doGet,
  doPost,
  onOpen,
  setupWorkbook,
  installTriggers,
  sendTodoEmailTrigger,
  onOrdersEdit,
  menuSetup,
  menuCheckContent,
  menuPublishWebsite,
  menuNewArticle,
  menuOpenLastRun,
  menuSendTodo,
  menuInstallTriggers: installTriggers,
});
