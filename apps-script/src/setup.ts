// setupWorkbook() creates every tab with its headers, dropdowns, frozen and
// warning-protected header rows, the Dashboard formulas, the Drive folders and
// the article template Doc. Client runs it once from the Sheet menu.

import {HEADERS, LIST_COLUMNS, TABS, YES_NO_COLUMNS, type TabKey, type TabName} from "./schema.ts";
import type {Cell} from "./table.ts";

export const FOLDER_NAMES = ["Product photos", "Seminar photos", "Story photos", "Website Articles"] as const;
const DOC_PROPS = {folders: "KEDI_FOLDER_IDS", template: "KEDI_ARTICLE_TEMPLATE_ID"};

/** 1-based column index → letter (1→A, 27→AA). */
export function colLetter(index1: number): string {
  let s = "";
  let n = index1;
  while (n > 0) {
    s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

export function setupWorkbook(): void {
  const ss = SpreadsheetApp.getActive();
  for (const key of Object.keys(TABS) as TabKey[]) ensureTab(ss, key);
  buildDashboard(ss);
  const folders = ensureDriveFolders();
  ensureArticleTemplate(folders["Website Articles"]);
  SpreadsheetApp.getUi().alert(
    "Workbook is ready. The Drive folders (Product photos, Seminar photos, Story photos, Website Articles) were created — upload product photos there and paste their file IDs into the Products tab."
  );
}

function ensureTab(ss: GoogleAppsScript.Spreadsheet.Spreadsheet, key: TabKey): void {
  const name = TABS[key];
  const sheet = ss.getSheetByName(name) ?? ss.insertSheet(name);
  const headers = HEADERS[key];
  if (
    sheet
      .getRange(1, 1, 1, headers.length)
      .getValues()[0]
      .every((c) => c === "")
  ) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#E8F1FA");
  applyValidations(sheet, key, headers);
  const protection = sheet.getRange(1, 1, 1, headers.length).protect();
  protection.setDescription("Header row — the website reads columns by name").setWarningOnly(true);
}

function applyValidations(sheet: GoogleAppsScript.Spreadsheet.Sheet, key: TabKey, headers: string[]): void {
  const yesNo = YES_NO_COLUMNS[key] ?? [];
  const lists = LIST_COLUMNS[key] ?? {};
  const rules = new Map<string, string[]>([...yesNo.map((c) => [c, ["Yes", "No"]] as [string, string[]]), ...Object.entries(lists)]);
  for (const [column, list] of rules) {
    const col = headers.indexOf(column);
    if (col === -1) continue;
    const rule = SpreadsheetApp.newDataValidation().requireValueInList(list, true).setAllowInvalid(false).build();
    sheet.getRange(2, col + 1, 1000, 1).setDataValidation(rule);
  }
}

function buildDashboard(ss: GoogleAppsScript.Spreadsheet.Spreadsheet): void {
  const sheet = ss.getSheetByName(TABS.dashboard) ?? ss.insertSheet(TABS.dashboard);
  const L = HEADERS.leads;
  const O = HEADERS.orders;
  const R = HEADERS.referrals;
  const leads = `'${TABS.leads}'`;
  const orders = `'${TABS.orders}'`;
  const referrals = `'${TABS.referrals}'`;
  const leadsStatus = `${leads}!${colLetter(L.indexOf("status") + 1)}2:${colLetter(L.indexOf("status") + 1)}`;
  const leadsAdded = `${leads}!${colLetter(L.indexOf("date_added") + 1)}2:${colLetter(L.indexOf("date_added") + 1)}`;
  const ordersStatus = `${orders}!${colLetter(O.indexOf("status") + 1)}2:${colLetter(O.indexOf("status") + 1)}`;
  const ordersCreated = `${orders}!${colLetter(O.indexOf("created_at") + 1)}2:${colLetter(O.indexOf("created_at") + 1)}`;
  const ordersSubtotal = `${orders}!${colLetter(O.indexOf("computed_subtotal_ngn") + 1)}2:${colLetter(O.indexOf("computed_subtotal_ngn") + 1)}`;
  const refCode = `${referrals}!${colLetter(R.indexOf("code") + 1)}2:${colLetter(R.indexOf("code") + 1)}`;

  const paidStatuses = ',"Paid")+COUNTIF(' + ordersStatus + ',"Dispatched")+COUNTIF(' + ordersStatus + ',"Delivered")';
  const rows: [string, string, string][] = [
    ["Leads this week", `=COUNTIFS(${leadsAdded},">="&(TODAY()-6))`, "Leads & Customers added in the last 7 days"],
    ["Orders started this week", `=COUNTIFS(${ordersCreated},">="&(TODAY()-6))`, "Orders tab rows created this week"],
    ["Orders paid or delivered", `=COUNTIF(${ordersStatus}${paidStatuses}`, "Order status is Paid, Dispatched or Delivered"],
    [
      "Revenue (₦)",
      `=SUMIFS(${ordersSubtotal},${ordersStatus},"Paid")+SUMIFS(${ordersSubtotal},${ordersStatus},"Dispatched")+SUMIFS(${ordersSubtotal},${ordersStatus},"Delivered")`,
      "Computed subtotal of completed orders",
    ],
    ["Repeat customers", `=COUNTIF(${leadsStatus},"Repeat Customer")`, "People with 2+ paid orders"],
    ["Referrers", `=COUNTIF(${leadsStatus},"Referrer")`, "Customers whose referral produced an order"],
    ["Referral codes issued", `=COUNTA(${refCode})`, "Rows in Referrals"],
    ["Order → paid rate", `=IFERROR(B4/B3,"—")`, "Paid-or-delivered ÷ started, all time"],
    ["New leads waiting", `=COUNTIF(${leadsStatus},"New Lead")`, "Status still New Lead"],
  ];
  sheet.getRange(1, 1, rows.length, 3).setValues([HEADERS.dashboard, ...rows]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#E8F1FA");
}

// ── Drive folders + article template ─────────────────────────────────────────

export function ensureDriveFolders(): Record<(typeof FOLDER_NAMES)[number], string> {
  const props = PropertiesService.getDocumentProperties();
  const saved: Record<string, string> = JSON.parse(props.getProperty(DOC_PROPS.folders) ?? "{}") as Record<string, string>;
  const ids = {} as Record<(typeof FOLDER_NAMES)[number], string>;
  for (const name of FOLDER_NAMES) {
    if (saved[name]) {
      ids[name] = saved[name];
      continue;
    }
    ids[name] = DriveApp.createFolder(name).getId();
  }
  props.setProperty(DOC_PROPS.folders, JSON.stringify(ids));
  return ids;
}

function ensureArticleTemplate(articlesFolderId: string): string {
  const props = PropertiesService.getDocumentProperties();
  const existing = props.getProperty(DOC_PROPS.template);
  if (existing) return existing;
  const doc = DocumentApp.create("Article template — how articles become website pages");
  const body = doc.getBody();
  body.appendParagraph("Article title goes here").setHeading(DocumentApp.ParagraphHeading.TITLE);
  body.appendParagraph("A short intro paragraph. This becomes the first paragraph on the page.").editAsText().setForegroundColor("#5D6B78");
  body.appendParagraph("Write your opening paragraph here — one idea per sentence.");
  body.appendParagraph("First section heading").setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph("A paragraph under the section heading. Bold and links are kept.");
  body.appendListItem("First point").setGlyphType(DocumentApp.GlyphType.BULLET);
  body.appendListItem("Second point").setGlyphType(DocumentApp.GlyphType.BULLET);
  body
    .appendParagraph("Paste a YouTube or TikTok link alone on its own line to embed a video: https://youtu.be/example")
    .editAsText()
    .setForegroundColor("#5D6B78");
  body.appendParagraph("When to see a doctor").setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body
    .appendParagraph("Everything under this heading goes in the highlighted 'see a doctor' box — until the next Heading 2.")
    .editAsText()
    .setForegroundColor("#5D6B78");
  const file = DriveApp.getFileById(doc.getId());
  DriveApp.getFolderById(articlesFolderId).addFile(file);
  DriveApp.getRootFolder().removeFile(file);
  props.setProperty(DOC_PROPS.template, doc.getId());
  return doc.getId();
}

/** Menu action: copy the template into Website Articles, add a Ready=No row. */
export function newArticleFromTemplate(store: {append: (tab: TabName, rec: Record<string, Cell>) => number}): string {
  const props = PropertiesService.getDocumentProperties();
  const folders = ensureDriveFolders();
  const templateId = props.getProperty(DOC_PROPS.template) ?? ensureArticleTemplate(folders["Website Articles"]);
  const copy = DriveApp.getFileById(templateId).makeCopy("Untitled article", DriveApp.getFolderById(folders["Website Articles"]));
  const articles = SpreadsheetApp.getActive().getSheetByName(TABS.articles);
  let next = 1;
  if (articles) {
    const ids = articles
      .getDataRange()
      .getValues()
      .map((r) => String(r[0] ?? ""));
    for (const id of ids) {
      const n = Number(id.match(/^ART-(\d+)$/)?.[1]);
      if (n >= next) next = n + 1;
    }
  }
  const articleId = `ART-${String(next).padStart(3, "0")}`;
  store.append(TABS.articles, {
    article_id: articleId,
    ready: "No",
    doc_url: copy.getUrl(),
    date: Utilities.formatDate(new Date(), "Africa/Lagos", "yyyy-MM-dd"),
  });
  return copy.getUrl();
}
