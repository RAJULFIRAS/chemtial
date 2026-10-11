import { describe, it, expect } from "vitest";
import { Email } from "../../../src/domain/value-objects/email.vo";

describe("Email VO", () => {
  it("should normalize email to lowercase", () => {
    const email = new Email("Test@Example.COM");
    expect(email.value).toBe("test@example.com");
  });

  it("should preserve already-normalized email", () => {
    const email = new Email("user@example.com");
    expect(email.value).toBe("user@example.com");
  });

  it("should throw on empty string", () => {
    expect(() => new Email("")).toThrow("Invalid email format");
  });

  it("should throw on missing @", () => {
    expect(() => new Email("invalid.com")).toThrow("Invalid email format");
  });

  it("should throw on missing domain", () => {
    expect(() => new Email("user@")).toThrow("Invalid email format");
  });

  it("should throw on spaces", () => {
    expect(() => new Email("user @example.com")).toThrow();
  });

  it("should compare equal emails", () => {
    const a = new Email("Test@Example.com");
    const b = new Email("test@example.com");
    expect(a.equals(b)).toBe(true);
  });

  it("should compare different emails", () => {
    const a = new Email("a@example.com");
    const b = new Email("b@example.com");
    expect(a.equals(b)).toBe(false);
  });

  it("should return value via toString", () => {
    const email = new Email("user@example.com");
    expect(email.toString()).toBe("user@example.com");
  });
});
