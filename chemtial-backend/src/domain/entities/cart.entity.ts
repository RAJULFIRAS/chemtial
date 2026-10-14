import { Product } from "./product.entity.js";

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  unitId: string | null;
  unitName: string | null;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}
