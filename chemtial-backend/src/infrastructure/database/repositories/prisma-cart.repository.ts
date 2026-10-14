import { prisma } from "../prisma/client.js";
import { Cart, CartItem } from "../../../domain/entities/cart.entity.js";
import { CartRepository } from "../../../domain/repositories/cart.repository.js";
import { AddToCartDTO } from "../../../application/dtos/cart.dto.js";
import { ValidationError } from "../../../shared/exceptions/app.error.js";
import { ProductMapper } from "../../../application/mappers/product.mapper.js";

export class PrismaCartRepository implements CartRepository {
  async findByUserId(userId: string): Promise<Cart | null> {
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { sortOrder: "asc" } },
                units: { orderBy: { sortOrder: "asc" } },
              },
            },
          },
        },
      },
    });

    if (!cart) return null;
    return this.toDomain(cart);
  }

  async addItem(userId: string, item: AddToCartDTO): Promise<Cart> {
    let cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: { units: true },
    });

    if (!product) {
      throw new ValidationError("Product not found");
    }

    const inStock =
      product.units.length > 0
        ? product.units.some((u) => u.isActive && u.stock > 0)
        : true;

    if (!inStock) {
      throw new ValidationError(`Product ${product.name} is out of stock`);
    }

    let price = product.price;
    let unitName: string | null = null;

    if (item.unitId) {
      const unit = product.units.find((u) => u.id === item.unitId);
      if (!unit) {
        throw new ValidationError("Unit not found");
      }
      if (!unit.isActive) {
        throw new ValidationError("Unit is not active");
      }
      if (unit.stock < item.quantity) {
        throw new ValidationError(
          `Insufficient stock for unit ${unit.unit} (available: ${unit.stock})`,
        );
      }
      price = unit.price;
      unitName = unit.unit;
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: item.productId,
        unitName: unitName,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: item.quantity } },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
          price,
          unitName,
        },
      });
    }

    return this.findByUserId(userId) as Promise<Cart>;
  }

  async updateItemQuantity(
    userId: string,
    cartItemId: string,
    quantity: number,
  ): Promise<Cart> {
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return this.findByUserId(userId) as Promise<Cart>;
  }

  async removeItem(userId: string, cartItemId: string): Promise<Cart> {
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return this.findByUserId(userId) as Promise<Cart>;
  }

  async clear(userId: string): Promise<void> {
    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }
  }

  private toDomain(cart: any): Cart {
    const items: CartItem[] = cart.items.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      product: ProductMapper.toResponse(item.product) as any,
      unitId: null,
      unitName: item.unitName ?? null,
      quantity: item.quantity,
      price: item.price,
    }));

    return {
      id: cart.id,
      userId: cart.userId,
      items,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    };
  }
}
