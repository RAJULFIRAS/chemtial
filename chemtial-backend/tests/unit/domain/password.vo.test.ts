import { describe, it, expect } from "vitest";
import { Password } from "../../../src/domain/value-objects/password.vo";

describe("Password VO", () => {
  it("should store hashed value", () => {
    const p = new Password("hashed-value", true);
    expect(p.hash).toBe("hashed-value");
  });

  it("should accept pre-hashed value without validation", () => {
    const p = new Password("a", true);
    expect(p.hash).toBe("a");
  });

  it("should throw when plaintext does not meet complexity requirements", () => {
    expect(() => new Password("weak")).toThrow();
    expect(() => new Password("alllowercase")).toThrow();
    expect(() => new Password("ALLUPPERCASE")).toThrow();
  });

  it("should throw when plaintext lacks special character", () => {
    expect(() => new Password("Password123")).toThrow();
  });

  it("should throw when plaintext lacks uppercase", () => {
    expect(() => new Password("password123!")).toThrow();
  });

  it("should throw when plaintext shorter than 8 chars", () => {
    expect(() => new Password("Aa1!")).toThrow();
  });
});
