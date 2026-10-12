import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../src/server";
import { prisma } from "../../src/infrastructure/database/prisma/client";

describe("Auth API", () => {
  const testEmail = `test-${Date.now()}@example.com`;
  let userId: string;

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });

  it("POST /api/auth/register - success", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: testEmail,
      password: "Password123!",
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    userId = res.body.data.user.id;
  });

  it("POST /api/auth/register - duplicate email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: testEmail,
      password: "Password123!",
    });
    expect(res.status).toBe(409);
  });

  it("POST /api/auth/register - weak password", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "X",
      email: "weak@example.com",
      password: "123",
    });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /api/auth/login - success", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: "Password123!",
    });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("POST /api/auth/login - wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: "WrongPassword!",
    });
    expect(res.status).toBe(401);
  });

  it("GET /health - returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
