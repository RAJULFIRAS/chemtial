import { Product } from "./product.entity";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitName: string | null;
}

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "awaiting_payment"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  subtotal: number;
  productDiscount: number;
  voucherDiscount: number;
  shippingCost: number;
  discountAmount: number | null;
  voucherCode: string | null;
  promoCode: string | null;
  paymentMethod: string;
  paymentProof: string | null;
  paymentReference: string | null;
  paymentNote: string | null;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}
