import { describe, it, expect } from "vitest";
import { User } from "../../../src/domain/entities/user.entity";

const makeUser = () =>
  new User(
    "u-1",
    "John Doe",
    "john@example.com",
    "hashed-pw",
    "user",
    true,
    null,
    null,
    null,
    new Date(),
    new Date(),
  );

describe("User Entity", () => {
  it("should return all getters", () => {
    const u = makeUser();
    expect(u.name).toBe("John Doe");
    expect(u.email).toBe("john@example.com");
    expect(u.role).toBe("user");
    expect(u.isActive).toBe(true);
  });

  it("should update name", () => {
    const u = makeUser();
    u.updateName("Jane Doe");
    expect(u.name).toBe("Jane Doe");
  });

  it("should throw when updating name too short", () => {
    const u = makeUser();
    expect(() => u.updateName("X")).toThrow("at least 2 characters");
  });

  it("should update password and clear reset token", () => {
    const u = makeUser();
    u.updateResetToken("tok", new Date());
    u.updatePassword("new-hash");
    expect(u.passwordHash).toBe("new-hash");
    expect(u.resetToken).toBeNull();
    expect(u.resetTokenExp).toBeNull();
  });

  it("should update refresh token", () => {
    const u = makeUser();
    u.updateRefreshToken("rt", new Date());
    expect(u.refreshToken).toBe("rt");
  });

  it("should update lastSeen", () => {
    const u = makeUser();
    u.updateLastSeen();
    expect(u.lastSeen).toBeInstanceOf(Date);
  });

  it("should deactivate", () => {
    const u = makeUser();
    u.deactivate();
    expect(u.isActive).toBe(false);
  });

  it("should activate", () => {
    const u = makeUser();
    u.deactivate();
    u.activate();
    expect(u.isActive).toBe(true);
  });

  it("should update reset token", () => {
    const u = makeUser();
    const exp = new Date();
    u.updateResetToken("token", exp);
    expect(u.resetToken).toBe("token");
    expect(u.resetTokenExp).toBe(exp);
  });
});
