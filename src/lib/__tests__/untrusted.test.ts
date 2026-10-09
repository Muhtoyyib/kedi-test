import {describe, expect, it} from "vite-plus/test";
import {isRecord, readNumber, readString} from "@/lib/untrusted";

describe("isRecord", () => {
  it("accepts plain objects", () => {
    expect(isRecord({a: 1})).toBe(true);
    expect(isRecord({})).toBe(true);
  });

  it("rejects non-records", () => {
    expect(isRecord(null)).toBe(false);
    expect(isRecord(undefined)).toBe(false);
    expect(isRecord([1, 2])).toBe(false);
    expect(isRecord("x")).toBe(false);
    expect(isRecord(4)).toBe(false);
  });
});

describe("readString", () => {
  it("returns a non-empty string field", () => {
    expect(readString({name: "Amaka"}, "name")).toBe("Amaka");
  });

  it("returns null for missing, empty or non-string fields", () => {
    expect(readString({}, "name")).toBeNull();
    expect(readString({name: ""}, "name")).toBeNull();
    expect(readString({name: 7}, "name")).toBeNull();
    expect(readString({name: null}, "name")).toBeNull();
  });
});

describe("readNumber", () => {
  it("returns a finite number field", () => {
    expect(readNumber({price: 18500}, "price")).toBe(18500);
    expect(readNumber({price: 0}, "price")).toBe(0);
  });

  it("returns null for missing, non-finite or non-number fields", () => {
    expect(readNumber({}, "price")).toBeNull();
    expect(readNumber({price: "18500"}, "price")).toBeNull();
    expect(readNumber({price: Number.NaN}, "price")).toBeNull();
    expect(readNumber({price: Number.POSITIVE_INFINITY}, "price")).toBeNull();
  });
});
