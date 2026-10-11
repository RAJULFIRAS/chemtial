import { describe, it, expect } from "vitest";
import { getImageUrl } from "../../../src/utils/image";

describe("getImageUrl", () => {
  it("should return placeholder for null", () => {
    expect(getImageUrl(null)).toBe("/images/placeholder.png");
  });

  it("should return placeholder for undefined", () => {
    expect(getImageUrl(undefined)).toBe("/images/placeholder.png");
  });

  it("should return placeholder for empty string", () => {
    expect(getImageUrl("")).toBe("/images/placeholder.png");
  });

  it("should preserve http URL", () => {
    expect(getImageUrl("http://example.com/a.jpg")).toBe(
      "http://example.com/a.jpg",
    );
  });

  it("should preserve https URL", () => {
    expect(getImageUrl("https://example.com/a.jpg")).toBe(
      "https://example.com/a.jpg",
    );
  });

  it("should preserve blob URL", () => {
    expect(getImageUrl("blob:xyz")).toBe("blob:xyz");
  });

  it("should prepend base url for relative path", () => {
    const url = getImageUrl("uploads/products/a.jpg");
    expect(url).toBe("http://localhost:3000/uploads/products/a.jpg");
  });

  it("should handle leading slash", () => {
    const url = getImageUrl("/uploads/products/a.jpg");
    expect(url).toBe("http://localhost:3000/uploads/products/a.jpg");
  });
});
