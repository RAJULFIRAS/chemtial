import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatCurrencyNumber,
  formatDate,
} from "../../../src/utils/format";

describe("format utils", () => {
  describe("formatCurrency", () => {
    it("should format positive amount", () => {
      expect(formatCurrency(1234.5)).toBe("$1,234.50");
    });

    it("should format zero", () => {
      expect(formatCurrency(0)).toBe("$0.00");
    });

    it("should format negative", () => {
      expect(formatCurrency(-50)).toBe("-$50.00");
    });

    it("should round to 2 decimals", () => {
      expect(formatCurrency(9.999)).toBe("$10.00");
    });
  });

  describe("formatCurrencyNumber", () => {
    it("should return number string with 2 decimals", () => {
      expect(formatCurrencyNumber(12.5)).toBe("12.50");
    });
  });

  describe("formatDate", () => {
    it("should format Date object", () => {
      const d = new Date("2026-01-15T10:00:00Z");
      const out = formatDate(d);
      expect(out).toMatch(/15/);
    });

    it("should format ISO string", () => {
      const out = formatDate("2026-06-20T00:00:00Z");
      expect(out).toMatch(/20/);
    });
  });
});
