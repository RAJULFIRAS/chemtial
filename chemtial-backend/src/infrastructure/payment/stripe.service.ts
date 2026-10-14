import Stripe from "stripe";
import { UpdateOrderStatusUseCase } from "../../application/use-cases/order/update-order-status.use-case.js";
import { OrderRepository } from "../../domain/repositories/order.repository.js";

export class StripeService {
  private stripe: Stripe;
  private webhookSecret: string;
  private orderRepository: OrderRepository;
  private updateOrderStatusUseCase: UpdateOrderStatusUseCase;

  constructor(
    orderRepository: OrderRepository,
    updateOrderStatusUseCase: UpdateOrderStatusUseCase,
  ) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secretKey) {
      console.warn(
        "[StripeService] STRIPE_SECRET_KEY not set — payment features disabled",
      );
    }
    if (!webhookSecret) {
      console.warn(
        "[StripeService] STRIPE_WEBHOOK_SECRET not set — webhook disabled",
      );
    }
    this.stripe = secretKey
      ? new Stripe(secretKey, { apiVersion: "2024-11-20.acacia" as any })
      : (null as any);
    this.webhookSecret = webhookSecret || "";
    this.orderRepository = orderRepository;
    this.updateOrderStatusUseCase = updateOrderStatusUseCase;
  }

  async createPaymentIntent(order: {
    orderNumber: string;
    totalAmount: number;
    currency?: string;
    customerEmail?: string;
    customerName?: string;
  }) {
    const amount = Math.round(order.totalAmount * 100);
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: order.currency || "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { orderNumber: order.orderNumber },
      receipt_email: order.customerEmail,
      description: `Order ${order.orderNumber}`,
    });
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async createCheckoutSession(order: {
    orderNumber: string;
    totalAmount: number;
    customerEmail?: string;
    successUrl: string;
    cancelUrl: string;
  }) {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Order ${order.orderNumber}` },
            unit_amount: Math.round(order.totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: order.successUrl,
      cancel_url: order.cancelUrl,
      customer_email: order.customerEmail,
      metadata: { orderNumber: order.orderNumber },
    });
    return { sessionId: session.id, url: session.url };
  }

  verifyWebhookSignature(payload: string, signature: string): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Webhook signature verification failed: ${errorMessage}`);
    }
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderNumber = paymentIntent.metadata.orderNumber;
        console.log(`Payment succeeded for order ${orderNumber}`);
        await this.updateOrderStatusFromWebhook(orderNumber, "paid", event.id);
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderNumber = paymentIntent.metadata.orderNumber;
        console.log(`Payment failed for order ${orderNumber}`);
        break;
      }
      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderNumber = paymentIntent.metadata.orderNumber;
        console.log(`Payment canceled for order ${orderNumber}`);
        await this.updateOrderStatusFromWebhook(
          orderNumber,
          "cancelled",
          event.id,
        );
        break;
      }
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderNumber = session.metadata?.orderNumber;
        if (orderNumber) {
          console.log(`Checkout completed for order ${orderNumber}`);
          await this.updateOrderStatusFromWebhook(
            orderNumber,
            "paid",
            event.id,
          );
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async updateOrderStatusFromWebhook(
    orderNumber: string,
    status: string,
    eventId: string,
  ): Promise<void> {
    try {
      const order = await this.orderRepository.findByOrderNumber(orderNumber);
      if (!order) {
        console.error(`Order ${orderNumber} not found (event: ${eventId})`);
        return;
      }

      if (order.status === "paid" && status === "paid") {
        console.log(`Order ${orderNumber} already paid, skipping`);
        return;
      }

      await this.updateOrderStatusUseCase.execute(order.id, status, {
        userId: "system",
      });

      console.log(
        `Order ${orderNumber} updated to ${status} (event: ${eventId})`,
      );
    } catch (error) {
      console.error(`Failed to update order ${orderNumber}:`, error);
    }
  }
}
