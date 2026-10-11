import { StripeService } from "../../payment/stripe.service";
import { GetOrderByIdUseCase } from "../../../application/use-cases/order/get-order-by-id.use-case";
import { Request, Response, NextFunction } from "express";

export class PaymentController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
  ) {}

  async createPaymentIntent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { orderId } = req.body;
      const order = await this.getOrderByIdUseCase.execute(orderId);

      if (order.userId !== req.user?.id) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const result = await this.stripeService.createPaymentIntent({
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        currency: "usd",
        customerEmail: req.user?.email,
        customerName: req.user?.email,
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async createCheckoutSession(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { orderId, successUrl, cancelUrl } = req.body;
      const order = await this.getOrderByIdUseCase.execute(orderId);

      if (order.userId !== req.user?.id) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const result = await this.stripeService.createCheckoutSession({
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        customerEmail: req.user?.email,
        successUrl,
        cancelUrl,
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async handleWebhook(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const signature = req.headers["stripe-signature"] as string;
      if (!signature) {
        res.status(400).json({ error: "Missing stripe-signature header" });
        return;
      }

      let event;
      try {
        const rawBody = Buffer.isBuffer(req.body)
          ? req.body.toString("utf8")
          : JSON.stringify(req.body);
        event = this.stripeService.verifyWebhookSignature(rawBody, signature);
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        res.status(400).json({ error: "Invalid signature" });
        return;
      }

      try {
        await this.stripeService.handleWebhookEvent(event);
        res.status(200).json({ received: true });
      } catch (err) {
        console.error("Webhook processing error:", err);
        res.status(500).json({ error: "Processing failed" });
      }
    } catch (error) {
      next(error);
    }
  }
}
