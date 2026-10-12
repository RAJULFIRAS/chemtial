import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetProductsUseCase } from "../../../../src/application/use-cases/product/get-products.use-case";
import { Product } from "../../../../src/domain/entities/product.entity";

const makeProduct = () =>
  new Product(
    "p-1",
    "Test",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    "Brand",
    null,
    "Cat",
    null,
    100,
    "img.jpg",
    0,
    0,
    "ml",
    false,
    null,
    null,
    new Date(),
    new Date(),
  );

describe("GetProductsUseCase", () => {
  let repo: any;
  let useCase: GetProductsUseCase;

  beforeEach(() => {
    repo = { findAll: vi.fn() };
    useCase = new GetProductsUseCase(repo);
  });

  it("returns mapped products", async () => {
    repo.findAll.mockResolvedValue({ data: [makeProduct()], total: 1 });
    const res = await useCase.execute({ page: 1, limit: 20 });
    expect(res.total).toBe(1);
    expect(res.data[0].id).toBe("p-1");
  });

  it("passes filters to repo", async () => {
    repo.findAll.mockResolvedValue({ data: [], total: 0 });
    await useCase.execute({
      page: 1,
      limit: 20,
      search: "acid",
      category: "c-1",
      brand: "b-1",
      isPromo: true,
    });
    expect(repo.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      search: "acid",
      category: "c-1",
      brand: "b-1",
      isPromo: true,
      recent: undefined,
    });
  });
});
