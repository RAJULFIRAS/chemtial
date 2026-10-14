import { Product } from "../../domain/entities/product.entity.js";
import { ProductResponse } from "../dtos/product.dto.js";

export class ProductMapper {
  static toResponse(product: Product): ProductResponse {
    const inStock =
      product.units.length > 0
        ? product.units.some((u) => u.isActive && u.stock > 0)
        : true;

    const productDiscountedPrice =
      product.isPromo && product.promoDiscount
        ? Math.round(product.price * (1 - product.promoDiscount / 100) * 100) /
          100
        : product.price;

    const productOriginalPrice =
      product.isPromo && product.promoDiscount ? product.price : null;

    const unitsWithDiscount = product.units.map((u) => {
      const discountedPrice =
        product.isPromo && product.promoDiscount
          ? Math.round(u.price * (1 - product.promoDiscount / 100) * 100) / 100
          : u.price;
      return {
        id: u.id,
        unit: u.unit,
        price: u.price,
        discountedPrice,
        stock: u.stock,
        isActive: u.isActive,
      };
    });

    return {
      id: product.id,
      name: product.name,
      nameEn: product.nameEn,
      nameZh: product.nameZh,
      nameHi: product.nameHi,
      nameRu: product.nameRu,
      nameAr: product.nameAr,
      description: product.description,
      descriptionEn: product.descriptionEn,
      descriptionZh: product.descriptionZh,
      descriptionHi: product.descriptionHi,
      descriptionRu: product.descriptionRu,
      descriptionAr: product.descriptionAr,
      brand: product.brand,
      brandId: product.brandId,
      category: product.category,
      categoryId: product.categoryId,
      price: productDiscountedPrice,
      originalPrice: productOriginalPrice,
      discountedPrice: productDiscountedPrice,
      image: product.image,
      images: product.images,
      units: unitsWithDiscount,
      rating: product.rating,
      reviews: product.reviews,
      inStock,
      unit: product.unit,
      isPromo: product.isPromo,
      promoDiscount: product.promoDiscount,
      casNumber: product.casNumber,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
