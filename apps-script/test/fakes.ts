// In-memory Store for Node tests — same header-indexed semantics as GasStore.

import {HEADERS, TABS, type TabKey, type TabName} from "../src/schema.ts";
import type {Store} from "../src/store.ts";
import {cellsFor, readTable, type Cell, type Table} from "../src/table.ts";
import type {Bucket} from "../src/env.ts";
import type {DocConversion} from "../src/docs.ts";
import type {RouterDeps} from "../src/router.ts";

export class MemoryStore implements Store {
  private grids = new Map<TabName, Cell[][]>();

  constructor(seed: Partial<Record<TabKey, Record<string, Cell>[]>> = {}) {
    for (const key of Object.keys(HEADERS) as TabKey[]) {
      const headers = HEADERS[key];
      const rows = (seed[key] ?? []).map((rec) => cellsFor(headers, rec));
      this.grids.set(TABS[key], [[...headers], ...rows]);
    }
  }

  table(tab: string): Table {
    return readTable(this.grids.get(tab as TabName) ?? [[]]);
  }

  append(tab: TabName, record: Record<string, Cell>): number {
    const grid = this.grids.get(tab)!;
    grid.push(cellsFor(HEADERS_FOR[tab], record));
    return grid.length;
  }

  patch(tab: TabName, rowNumber: number, patch: Record<string, Cell>): void {
    const grid = this.grids.get(tab)!;
    const headers = HEADERS_FOR[tab];
    for (const [key, value] of Object.entries(patch)) {
      const col = headers.indexOf(key);
      if (col === -1) throw new Error(`unknown column ${key}`);
      grid[rowNumber - 1][col] = value;
    }
  }

  removeRows(tab: TabName, rowNumbers: number[]): void {
    const grid = this.grids.get(tab)!;
    for (const row of [...rowNumbers].sort((a, b) => b - a)) grid.splice(row - 1, 1);
  }

  /** Convenience for tests: a column's values for a tab, header-free. */
  column(tab: TabName, column: string): Cell[] {
    return this.table(tab).rows.map((r) => r.rec[column]);
  }
}

const HEADERS_FOR = Object.fromEntries(Object.keys(HEADERS).map((k) => [TABS[k as TabKey], HEADERS[k as TabKey]])) as Record<
  TabName,
  string[]
>;

/** Map-backed rate limiter with the same interface as the CacheService one. */
export function fakeBucket(): Bucket {
  const counts = new Map<string, number>();
  return {
    incr(key) {
      const n = (counts.get(key) ?? 0) + 1;
      counts.set(key, n);
      return n;
    },
  };
}

/** A complete valid workbook: one category, one product, one seminar. */
export function seedCatalog(): Partial<Record<TabKey, Record<string, Cell>[]>> {
  return {
    categories: [
      {
        slug: "digestive-health",
        name: "Digestive Health",
        description: "Gentle support for everyday digestion.",
        sort_order: 1,
        image_id: "",
        active: "Yes",
      },
    ],
    products: [
      {
        product_id: "KD-P001",
        active: "Yes",
        name: "Product A",
        slug: "product-a",
        category: "digestive-health",
        price_ngn: 18500,
        pack_size: "60 capsules",
        pack_days: 30,
        in_stock: "Yes",
        featured: "Yes",
        sort_order: 1,
        short_benefit: "Supports everyday digestive wellness.",
        description: "Approved description paragraph.",
        ingredients: "Ingredient one",
        how_to_use: "Take as directed on the pack.",
        nafdac_no: "A7-1234",
        image_ids: "img1",
        related_ids: "",
        seo_title: "",
        seo_description: "",
      },
    ],
    seminars: [
      {
        seminar_id: "SEM-2026-10-12",
        date: "2026-10-12",
        start_time: "16:00",
        end_time: "17:30",
        topic: "Better digestion, better days",
        summary: "A friendly intro.",
        learn_points: "Habits|Foods|Labels",
        audience: "Anyone",
        format: "physical",
        venue: "Fixture Hall",
        luma_url: "https://lu.ma/abc",
        luma_event_id: "evt-abc",
        status: "scheduled",
        recording_url: "",
      },
    ],
  };
}

/** Router deps wired to a MemoryStore — tests override what they need. */
export function routerDeps(store: MemoryStore, extra: Partial<RouterDeps> = {}): RouterDeps {
  return {store, tokenOk: (t) => t === "good-token", limiter: fakeBucket(), now: new Date("2026-10-12T12:00:00+01:00"), ...extra};
}

export function fakeDoc(blocks: Partial<DocConversion> = {}): DocConversion {
  return {title: "Doc title", blocks: [{type: "p", inlines: [{text: "Hello"}]}], readingMinutes: 1, warnings: [], errors: [], ...blocks};
}
