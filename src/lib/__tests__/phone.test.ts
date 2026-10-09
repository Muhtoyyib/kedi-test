import {describe, expect, it} from "vite-plus/test";
import * as fc from "fast-check";
import {formatPhoneDisplay, normalizeNigerianPhone} from "@/lib/phone";

// National significant numbers (after the trunk 0) start with these two digits.
const prefixes = ["70", "80", "81", "90", "91"];

const digitString = (length: number) =>
  fc.array(fc.constantFrom(..."0123456789"), {minLength: length, maxLength: length}).map((digits) => digits.join(""));
const validNational = fc.tuple(fc.constantFrom(...prefixes), digitString(8)).map(([p, rest]) => `${p}${rest}`);

describe("normalizeNigerianPhone", () => {
  it("accepts all written forms and stores E.164", () => {
    for (const input of ["08031234567", "8031234567", "+2348031234567", "2348031234567", "0803 123 4567", "+234 803 123 4567"]) {
      expect(normalizeNigerianPhone(input)).toBe("+2348031234567");
    }
  });

  it("accepts every generated valid mobile number", () => {
    fc.assert(
      fc.property(validNational, (national) => {
        expect(normalizeNigerianPhone(`0${national}`)).toBe(`+234${national}`);
      })
    );
  });

  it("rejects landlines and wrong lengths", () => {
    for (const input of ["012345678", "01 234 5678", "080312", "080312345678", "1234567890", "hello", ""]) {
      expect(normalizeNigerianPhone(input)).toBeNull();
    }
  });

  it("rejects non-mobile prefixes", () => {
    fc.assert(
      fc.property(
        digitString(10).filter((n) => !prefixes.includes(n.slice(0, 2))),
        (national) => {
          expect(normalizeNigerianPhone(`0${national}`)).toBeNull();
        }
      )
    );
  });
});

describe("formatPhoneDisplay", () => {
  it("renders E.164 as local '0803 123 4567'", () => {
    expect(formatPhoneDisplay("+2348031234567")).toBe("0803 123 4567");
    expect(formatPhoneDisplay("2348031234567")).toBe("0803 123 4567");
  });

  it("passes through values that cannot be normalised", () => {
    expect(formatPhoneDisplay("not-a-number")).toBe("not-a-number");
  });
});
