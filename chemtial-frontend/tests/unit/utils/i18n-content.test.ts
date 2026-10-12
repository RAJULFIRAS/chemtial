import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getLocalizedName,
  getLocalizedDescription,
} from "../../../src/utils/i18n-content";

vi.mock("../../../src/i18n", () => ({
  default: {
    language: "en",
  },
}));

import i18n from "../../../src/i18n";

const mockI18n = i18n as unknown as { language: string };

describe("i18n-content utils", () => {
  beforeEach(() => {
    mockI18n.language = "en";
  });

  describe("getLocalizedName", () => {
    it("should return nameEn when lang=en", () => {
      mockI18n.language = "en";
      expect(getLocalizedName({ name: "Kimia", nameEn: "Chemistry" })).toBe(
        "Chemistry",
      );
    });

    it("should fallback to name when nameEn missing", () => {
      mockI18n.language = "en";
      expect(getLocalizedName({ name: "Kimia", nameEn: null })).toBe("Kimia");
    });

    it("should return name when lang=id", () => {
      mockI18n.language = "id";
      expect(getLocalizedName({ name: "Kimia", nameEn: "Chemistry" })).toBe(
        "Kimia",
      );
    });

    it("should return nameZh for lang=zh", () => {
      mockI18n.language = "zh";
      expect(getLocalizedName({ name: "Kimia", nameZh: "化学" })).toBe("化学");
    });

    it("should return nameHi for lang=hi", () => {
      mockI18n.language = "hi";
      expect(getLocalizedName({ name: "X", nameHi: "रसायन" })).toBe("रसायन");
    });

    it("should return nameRu for lang=ru", () => {
      mockI18n.language = "ru";
      expect(getLocalizedName({ name: "X", nameRu: "Химия" })).toBe("Химия");
    });

    it("should return nameAr for lang=ar", () => {
      mockI18n.language = "ar";
      expect(getLocalizedName({ name: "X", nameAr: "كيمياء" })).toBe("كيمياء");
    });
  });

  describe("getLocalizedDescription", () => {
    it("should return descriptionEn for lang=en", () => {
      mockI18n.language = "en";
      expect(
        getLocalizedDescription({
          description: "ID desc",
          descriptionEn: "EN desc",
        }),
      ).toBe("EN desc");
    });

    it("should fallback to description", () => {
      mockI18n.language = "en";
      expect(getLocalizedDescription({ description: "ID desc" })).toBe(
        "ID desc",
      );
    });

    it("should return empty string when no description", () => {
      mockI18n.language = "en";
      expect(getLocalizedDescription({})).toBe("");
    });
  });
});
