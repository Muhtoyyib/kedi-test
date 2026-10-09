// Header-indexed table model over a sheet's cell values. Pure — no GAS calls —
// so every domain module is testable in Node against MemoryStore.

export type Cell = string | number | boolean | Date | null;

export interface TableRow {
  /** 1-based sheet row number (header is row 1, first data row is 2). */
  row: number;
  rec: Record<string, Cell>;
}

export interface Table {
  headers: string[];
  rows: TableRow[];
}

/** Row 1 is the header row; header names are trimmed and must match exactly. */
export function readTable(values: Cell[][]): Table {
  const headers = (values[0] ?? []).map((cell) => String(cell ?? "").trim());
  const rows: TableRow[] = [];
  for (let r = 1; r < values.length; r++) {
    const line = values[r];
    const rec: Record<string, Cell> = {};
    for (let c = 0; c < headers.length; c++) rec[headers[c]] = line[c] ?? null;
    if (headers.some((h) => h && String(rec[h] ?? "").trim() !== "")) {
      rows.push({row: r + 1, rec});
    }
  }
  return {headers, rows};
}

/** Record → ordered cell array matching the header row. */
export function cellsFor(headers: string[], rec: Record<string, Cell>): Cell[] {
  return headers.map((h) => rec[h] ?? "");
}

export function findRow(table: Table, column: string, value: Cell): TableRow | undefined {
  return table.rows.find((r) => String(r.rec[column] ?? "").trim() === String(value ?? "").trim());
}

export function str(cell: Cell): string {
  if (cell === null || cell === undefined) return "";
  if (cell instanceof Date) return dateOnly(cell) ?? "";
  return String(cell).trim();
}

export function num(cell: Cell): number | null {
  if (typeof cell === "number" && Number.isFinite(cell)) return cell;
  const n = Number(str(cell));
  return Number.isFinite(n) && str(cell) !== "" ? n : null;
}

/** Yes/No columns accept "Yes", "yes", true, "TRUE". */
export function yn(cell: Cell): boolean {
  return cell === true || str(cell).toLowerCase() === "yes" || str(cell).toLowerCase() === "true";
}

/** "YYYY-MM-DD" — accepts a Date cell, an ISO date or an ISO datetime string. */
export function dateOnly(cell: Cell): string | null {
  if (cell instanceof Date && !Number.isNaN(cell.getTime())) return toDateStr(cell);
  const s = str(cell);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:/.test(s)) return s.slice(0, 10);
  return null;
}

export function toDateStr(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return toDateStr(new Date(y, m - 1, d + days));
}

export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86_400_000);
}

export function splitList(cell: Cell, separator: string | RegExp = ","): string[] {
  return str(cell)
    .split(separator)
    .map((s) => s.trim())
    .filter(Boolean);
}
