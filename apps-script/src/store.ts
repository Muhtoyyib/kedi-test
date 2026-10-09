// The Store interface is the seam between domain logic (pure, tested in Node
// against MemoryStore) and Google Sheets. GasStore is deliberately thin and
// always writes against the sheet's real header row, so the client may move
// columns around safely.

import {cellsFor, readTable, type Cell, type Table} from "./table.ts";
import type {TabName} from "./schema.ts";

export interface Store {
  table(tab: string): Table;
  /** Appends a record; returns the 1-based sheet row number written. */
  append(tab: TabName, record: Record<string, Cell>): number;
  patch(tab: TabName, rowNumber: number, patch: Record<string, Cell>): void;
  removeRows(tab: TabName, rowNumbers: number[]): void;
}

export class GasStore implements Store {
  constructor(private ss: GoogleAppsScript.Spreadsheet.Spreadsheet) {}

  private sheet(tab: TabName): GoogleAppsScript.Spreadsheet.Sheet {
    const sheet = this.ss.getSheetByName(tab);
    if (!sheet) throw new Error(`Missing tab: ${tab}. Run setupWorkbook first.`);
    return sheet;
  }

  table(tab: string): Table {
    return readTable(
      this.sheet(tab as TabName)
        .getDataRange()
        .getValues() as Cell[][]
    );
  }

  private headerRow(tab: TabName): string[] {
    const sheet = this.sheet(tab);
    return (sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] as Cell[]).map((c) => String(c ?? "").trim());
  }

  append(tab: TabName, record: Record<string, Cell>): number {
    const sheet = this.sheet(tab);
    sheet.appendRow(cellsFor(this.headerRow(tab), record));
    return sheet.getLastRow();
  }

  patch(tab: TabName, rowNumber: number, patch: Record<string, Cell>): void {
    const sheet = this.sheet(tab);
    const headers = this.headerRow(tab);
    for (const [key, value] of Object.entries(patch)) {
      const col = headers.indexOf(key);
      if (col === -1) throw new Error(`Unknown column ${key} on ${tab}`);
      sheet.getRange(rowNumber, col + 1).setValue(value);
    }
  }

  removeRows(tab: TabName, rowNumbers: number[]): void {
    const sheet = this.sheet(tab);
    for (const row of [...rowNumbers].sort((a, b) => b - a)) sheet.deleteRow(row);
  }
}
