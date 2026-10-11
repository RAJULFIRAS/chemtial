import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../src/server";
import { prisma } from "../../src/infrastructure/database/prisma/client";

describe("Products API", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("GET /api/products - returns paginated list", async () => {
    const res = await request(app).get("/api/products?page=1&limit=5");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.page).toBe(1);
  });

  it("GET /api/products - filters by search", async () => {
    const res = await request(app).get("/api/products?search=zzzznonexistent");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
  });

  it("GET /api/products/:id - 404 for unknown", async () => {
    const res = await request(app).get(
      "/api/products/00000000-0000-0000-0000-000000000000",
    );
    expect(res.status).toBe(404);
  });
});
