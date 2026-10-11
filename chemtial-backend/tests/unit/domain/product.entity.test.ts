import { describe, it, expect } from "vitest";
import { Product } from "../../../src/domain/entities/product.entity";

const makeProduct = (overrides: any = {}) => {
  return new Product(
    overrides.id ?? "p-1",
    overrides.name ?? "Test Product",
    overrides.nameEn ?? null,
    overrides.nameZh ?? null,
    overrides.nameHi ?? null,
    overrides.nameRu ?? null,
    overrides.nameAr ?? null,
    overrides.description ?? null,
    overrides.descriptionEn ?? null,
    overrides.descriptionZh ?? null,
    overrides.descriptionHi ?? null,
    overrides.descriptionRu ?? null,
    overrides.descriptionAr ?? null,
    overrides.brand ?? "TestBrand",
    overrides.brandId ?? null,
    overrides.category ?? "TestCat",
    overrides.categoryId ?? null,
    overrides.price ?? 100,
    overrides.image ?? "img.jpg",
    overrides.rating ?? 0,
    overrides.reviews ?? 0,
    overrides.unit ?? "ml",
    overrides.isPromo ?? false,
    overrides.promoDiscount ?? null,
    overrides.casNumber ?? null,
    overrides.createdAt ?? new Date(),
    overrides.updatedAt ?? new Date(),
    overrides.deletedAt ?? null,
    overrides.images ?? [],
    overrides.units ?? [],
  );
};

describe("Product Entity", () => {
  it("should return discounted price when promo active", () => {
    const p = makeProduct({ price: 100, isPromo: true, promoDiscount: 10 });
    expect(p.discountedPrice).toBe(90);
  });

  it("should return base price when not promo", () => {
    const p = makeProduct({ price: 100, isPromo: false });
    expect(p.discountedPrice).toBe(100);
  });

  it("should return base price when promo but no discount value", () => {
    const p = makeProduct({ price: 100, isPromo: true, promoDiscount: null });
    expect(p.discountedPrice).toBe(100);
  });

  it("should round discounted price to 2 decimals", () => {
    const p = makeProduct({ price: 99.99, isPromo: true, promoDiscount: 15 });
    expect(p.discountedPrice).toBe(84.99);
  });

  it("should be inStock=true if no units", () => {
    const p = makeProduct({ units: [] });
    expect(p.inStock).toBe(true);
  });

  it("should be inStock=true when some unit is active and has stock", () => {
    const p = makeProduct({
      units: [
        { id: "u1", unit: "100ml", price: 50, stock: 0, isActive: true },
        { id: "u2", unit: "500ml", price: 100, stock: 5, isActive: true },
      ],
    });
    expect(p.inStock).toBe(true);
  });

  it("should be inStock=false when all units stock=0", () => {
    const p = makeProduct({
      units: [{ id: "u1", unit: "100ml", price: 50, stock: 0, isActive: true }],
    });
    expect(p.inStock).toBe(false);
  });

  it("should update price", () => {
    const p = makeProduct({ price: 100 });
    p.updatePrice(200);
    expect(p.price).toBe(200);
  });

  it("should throw when updating to zero price", () => {
    const p = makeProduct({ price: 100 });
    expect(() => p.updatePrice(0)).toThrow("Price must be positive");
  });

  it("should throw when updating to negative price", () => {
    const p = makeProduct({ price: 100 });
    expect(() => p.updatePrice(-5)).toThrow();
  });
});
