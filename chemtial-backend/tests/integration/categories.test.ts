import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../src/server";
import { prisma } from "../../src/infrastructure/database/prisma/client";

describe("Categories API", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("GET /api/categories - returns list", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
