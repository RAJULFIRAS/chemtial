import { describe, it, expect } from "vitest";
import { Password } from "../../../src/domain/value-objects/password.vo";

describe("Password VO", () => {
  it("should create from valid password", () => {
    const p = new Password("Password123!", true);
    expect(p.hash).toBe("Password123!");
  });

  it("should throw when created with plaintext (not hashed)", () => {
    expect(() => new Password("Password123!")).toThrow(
      "Password VO cannot hash plaintext",
    );
  });

  it("should throw when invalid password given without hashed flag", () => {
    expect(() => new Password("weak")).toThrow();
  });
});
