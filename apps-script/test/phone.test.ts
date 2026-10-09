import {describe, expect, it} from "vitest";
import {normalizeNigerianPhone} from "../src/phone.ts";

describe("normalizeNigerianPhone", () => {
  it.each([
    ["08031234567", "+2348031234567"],
    ["803 123 4567", "+2348031234567"],
    ["+234 803 123 4567", "+2348031234567"],
    ["2348031234567", "+2348031234567"],
    ["(0803) 123-4567", "+2348031234567"],
    ["09123456789", "+2349123456789"],
    ["07012345678", "+2347012345678"],
  ])("normalises %s", (input, expected) => {
    expect(normalizeNigerianPhone(input)).toBe(expected);
  });

  it.each(["012345678", "0803123456", "080312345678", "06031234567", "+14155552671", "", "phone number"])("rejects %s", (input) => {
    expect(normalizeNigerianPhone(input)).toBeNull();
  });
});
