import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  formatCurrency,
  formatCurrencyNumber,
  formatDate,
  formatDateTime,
  formatDateLong,
} from "../../../src/utils/format";

import i18n from "../../../src/i18n";

const mockI18n = i18n as unknown as { language: string };

describe("format utils", () => {
  beforeEach(() => {
    mockI18n.language = "en";
  });

  describe("formatCurrency", () => {
    it("formats positive amount", () => {
      expect(formatCurrency(1234.5)).toBe("$1,234.50");
    });
    it("formats zero", () => {
      expect(formatCurrency(0)).toBe("$0.00");
    });
    it("formats negative", () => {
      expect(formatCurrency(-50)).toBe("-$50.00");
    });
    it("rounds to 2 decimals", () => {
      expect(formatCurrency(9.999)).toBe("$10.00");
    });
    it("formats large number with comma", () => {
      expect(formatCurrency(1000000)).toBe("$1,000,000.00");
    });
  });

  describe("formatCurrencyNumber", () => {
    it("returns with 2 decimals", () => {
      expect(formatCurrencyNumber(12.5)).toBe("12.50");
    });
    it("returns zero as 0.00", () => {
      expect(formatCurrencyNumber(0)).toBe("0.00");
    });
    it("rounds correctly", () => {
      expect(formatCurrencyNumber(12.567)).toBe("12.57");
    });
  });

  describe("formatDate (en-US)", () => {
    it("formats Date object", () => {
      const d = new Date("2026-01-15T10:00:00Z");
      const out = formatDate(d);
      expect(out).toMatch(/15/);
      expect(out).toMatch(/Jan/);
    });
    it("formats ISO string", () => {
      const out = formatDate("2026-06-20T00:00:00Z");
      expect(out).toMatch(/20/);
    });
    it("formats with en-US locale", () => {
      mockI18n.language = "en";
      const out = formatDate(new Date("2026-03-10"));
      expect(out).toMatch(/Mar/);
    });
    it("formats with id-ID locale", () => {
      mockI18n.language = "id";
      const out = formatDate(new Date("2026-03-10"));
      expect(out).toMatch(/Mar|10/);
    });
  });

  describe("formatDateTime", () => {
    it("includes time components", () => {
      const out = formatDateTime(new Date("2026-03-10T14:30:00Z"));
      expect(out).toMatch(/10/);
      expect(out).toMatch(/30/);
    });
    it("accepts ISO string", () => {
      const out = formatDateTime("2026-06-20T09:15:00Z");
      expect(out).toMatch(/20/);
    });
  });

  describe("formatDateLong", () => {
    it("uses long month name", () => {
      const out = formatDateLong(new Date("2026-01-15T10:00:00Z"));
      expect(out).toMatch(/January|Jan/);
    });
    it("includes year", () => {
      const out = formatDateLong(new Date("2026-12-25T00:00:00Z"));
      expect(out).toMatch(/2026/);
    });
    it("formats with id locale", () => {
      mockI18n.language = "id";
      const out = formatDateLong(new Date("2026-05-01"));
      expect(out.length).toBeGreaterThan(0);
    });
  });
});
