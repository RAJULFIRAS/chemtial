import "./config/load-env";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";

import { config } from "./config/env.validation";
import { logger } from "./shared/utils/logger";
import { prisma } from "./infrastructure/database/prisma/client";

import { errorMiddleware } from "./infrastructure/http/middlewares/error.middleware";
import { generalLimiter } from "./infrastructure/http/middlewares/rate-limit.middleware";

import { PrismaUserRepository } from "./infrastructure/database/repositories/prisma-user.repository";
import { PrismaProductRepository } from "./infrastructure/database/repositories/prisma-product.repository";
import { PrismaCartRepository } from "./infrastructure/database/repositories/prisma-cart.repository";
import { PrismaOrderRepository } from "./infrastructure/database/repositories/prisma-order.repository";
import { PrismaAuditLogRepository } from "./infrastructure/database/repositories/prisma-audit-log.repository";
import { PrismaOrderStatusHistoryRepository } from "./infrastructure/database/repositories/prisma-order-status-history.repository";
import { PrismaCategoryRepository } from "./infrastructure/database/repositories/prisma-category.repository";
import { PrismaBrandRepository } from "./infrastructure/database/repositories/prisma-brand.repository";
import { PrismaPromoRepository } from "./infrastructure/database/repositories/prisma-promo.repository";
import { PrismaVoucherRepository } from "./infrastructure/database/repositories/prisma-voucher.repository";
import { PrismaVoucherUsageRepository } from "./infrastructure/database/repositories/prisma-voucher-usage.repository";
import { PrismaBannerRepository } from "./infrastructure/database/repositories/prisma-banner.repository";
import { PrismaDownloadRepository } from "./infrastructure/database/repositories/prisma-download.repository";

import { JwtService } from "./infrastructure/auth/jwt.service";
import { PasswordService } from "./infrastructure/auth/password.service";
import { RegisterUseCase } from "./application/use-cases/auth/register.use-case";
import { LoginUseCase } from "./application/use-cases/auth/login.use-case";
import { RefreshTokenUseCase } from "./application/use-cases/auth/refresh-token.use-case";
import { ForgotPasswordUseCase } from "./application/use-cases/auth/forgot-password.use-case";
import { ResetPasswordUseCase } from "./application/use-cases/auth/reset-password.use-case";
import { AuthController } from "./infrastructure/http/controllers/auth.controller";
import { createAuthRoutes } from "./infrastructure/http/routes/auth.routes";

import { GetProductsUseCase } from "./application/use-cases/product/get-products.use-case";
import { GetProductByIdUseCase } from "./application/use-cases/product/get-product-by-id.use-case";
import { CreateProductUseCase } from "./application/use-cases/product/create-product.use-case";
import { UpdateProductUseCase } from "./application/use-cases/product/update-product.use-case";
import { DeleteProductUseCase } from "./application/use-cases/product/delete-product.use-case";
import { ProductController } from "./infrastructure/http/controllers/product.controller";
import { createProductRoutes } from "./infrastructure/http/routes/product.routes";

import { GetCartUseCase } from "./application/use-cases/cart/get-cart.use-case";
import { AddToCartUseCase } from "./application/use-cases/cart/add-to-cart.use-case";
import { UpdateCartItemUseCase } from "./application/use-cases/cart/update-cart-item.use-case";
import { RemoveCartItemUseCase } from "./application/use-cases/cart/remove-cart-item.use-case";
import { CartController } from "./infrastructure/http/controllers/cart.controller";
import { createCartRoutes } from "./infrastructure/http/routes/cart.routes";

import { CreateOrderUseCase } from "./application/use-cases/order/create-order.use-case";
import { GetOrdersUseCase } from "./application/use-cases/order/get-orders.use-case";
import { GetOrderByIdUseCase } from "./application/use-cases/order/get-order-by-id.use-case";
import { UpdateOrderStatusUseCase } from "./application/use-cases/order/update-order-status.use-case";
import { GetAllOrdersUseCase } from "./application/use-cases/order/get-all-orders.use-case";
import { GetOrderHistoryUseCase } from "./application/use-cases/order/get-order-history.use-case";
import { GetCodPendingUseCase } from "./application/use-cases/order/get-cod-pending.use-case";
import { ConfirmCodReceivedUseCase } from "./application/use-cases/order/confirm-cod-received.use-case";
import { GetRevenueReportUseCase } from "./application/use-cases/order/get-revenue-report.use-case";
import { OrderController } from "./infrastructure/http/controllers/order.controller";
import { createOrderRoutes } from "./infrastructure/http/routes/order.routes";
import { CancelMyOrderUseCase } from "./application/use-cases/order/cancel-my-order.use-case";

import { GetVouchersUseCase } from "./application/use-cases/voucher/get-vouchers.use-case";
import { GetVoucherByIdUseCase } from "./application/use-cases/voucher/get-voucher-by-id.use-case";
import { CreateVoucherUseCase } from "./application/use-cases/voucher/create-voucher.use-case";
import { UpdateVoucherUseCase } from "./application/use-cases/voucher/update-voucher.use-case";
import { DeleteVoucherUseCase } from "./application/use-cases/voucher/delete-voucher.use-case";
import { ValidateVoucherUseCase } from "./application/use-cases/voucher/validate-voucher.use-case";
import { ClaimVoucherUseCase } from "./application/use-cases/voucher/claim-voucher.use-case";
import { GetMyVouchersUseCase } from "./application/use-cases/voucher/get-my-vouchers.use-case";
import { VoucherController } from "./infrastructure/http/controllers/voucher.controller";
import { createVoucherRoutes } from "./infrastructure/http/routes/voucher.routes";

import { GetCategoriesUseCase } from "./application/use-cases/category/get-categories.use-case";
import { GetCategoryByIdUseCase } from "./application/use-cases/category/get-category-by-id.use-case";
import { GetCategoryBySlugUseCase } from "./application/use-cases/category/get-category-by-slug.use-case";
import { CreateCategoryUseCase } from "./application/use-cases/category/create-category.use-case";
import { UpdateCategoryUseCase } from "./application/use-cases/category/update-category.use-case";
import { DeleteCategoryUseCase } from "./application/use-cases/category/delete-category.use-case";
import { CategoryController } from "./infrastructure/http/controllers/category.controller";
import { createCategoryRoutes } from "./infrastructure/http/routes/category.routes";

import { GetBrandsUseCase } from "./application/use-cases/brand/get-brands.use-case";
import { GetBrandByIdUseCase } from "./application/use-cases/brand/get-brand-by-id.use-case";
import { CreateBrandUseCase } from "./application/use-cases/brand/create-brand.use-case";
import { UpdateBrandUseCase } from "./application/use-cases/brand/update-brand.use-case";
import { DeleteBrandUseCase } from "./application/use-cases/brand/delete-brand.use-case";
import { BrandController } from "./infrastructure/http/controllers/brand.controller";
import { createBrandRoutes } from "./infrastructure/http/routes/brand.routes";

import { GetPromosUseCase } from "./application/use-cases/promo/get-promos.use-case";
import { GetPromoByIdUseCase } from "./application/use-cases/promo/get-promo-by-id.use-case";
import { CreatePromoUseCase } from "./application/use-cases/promo/create-promo.use-case";
import { UpdatePromoUseCase } from "./application/use-cases/promo/update-promo.use-case";
import { DeletePromoUseCase } from "./application/use-cases/promo/delete-promo.use-case";
import { PromoController } from "./infrastructure/http/controllers/promo.controller";
import { createPromoRoutes } from "./infrastructure/http/routes/promo.routes";

import { GetBannersUseCase } from "./application/use-cases/banner/get-banners.use-case";
import { GetBannerByIdUseCase } from "./application/use-cases/banner/get-banner-by-id.use-case";
import { CreateBannerUseCase } from "./application/use-cases/banner/create-banner.use-case";
import { UpdateBannerUseCase } from "./application/use-cases/banner/update-banner.use-case";
import { DeleteBannerUseCase } from "./application/use-cases/banner/delete-banner.use-case";
import { BannerController } from "./infrastructure/http/controllers/banner.controller";
import { createBannerRoutes } from "./infrastructure/http/routes/banner.routes";

import { TrackDownloadUseCase } from "./application/use-cases/download/track-download.use-case";
import { GetDownloadStatsUseCase } from "./application/use-cases/download/get-download-stats.use-case";
import { GetDownloadAnalyticsUseCase } from "./application/use-cases/download/get-download-analytics.use-case";
import { DownloadController } from "./infrastructure/http/controllers/download.controller";
import { createDownloadRoutes } from "./infrastructure/http/routes/download.routes";

import { GetUsersUseCase } from "./application/use-cases/user/get-users.use-case";
import { UpdateUserRoleUseCase } from "./application/use-cases/user/update-user-role.use-case";
import { DeleteUserUseCase } from "./application/use-cases/user/delete-user.use-case";
import { UserController } from "./infrastructure/http/controllers/user.controller";
import { createUserRoutes } from "./infrastructure/http/routes/user.routes";

import { StripeService } from "./infrastructure/payment/stripe.service";
import { PaymentController } from "./infrastructure/http/controllers/payment.controller";
import { createPaymentRoutes } from "./infrastructure/http/routes/payment.routes";
import { UploadController } from "./infrastructure/http/controllers/upload.controller";
import { createUploadRoutes } from "./infrastructure/http/routes/upload.routes";

import { PrismaProductReviewRepository } from "./infrastructure/database/repositories/prisma-product-review.repository";
import { CreateProductReviewUseCase } from "./application/use-cases/product/create-product-review.use-case";
import { GetProductReviewsUseCase } from "./application/use-cases/product/get-product-reviews.use-case";
import { ProductReviewController } from "./infrastructure/http/controllers/product-review.controller";
import { createProductReviewRoutes } from "./infrastructure/http/routes/product-review.routes";
import { GetMyReviewsUseCase } from "./application/use-cases/product/get-my-reviews.use-case";

const app = express();

app.use(
  "/api/payment/webhook/stripe",
  express.raw({ type: "application/json" }),
);

app.use(helmet());
app.use(
  cors({
    origin: config.CORS_ORIGIN.split(","),
    credentials: true,
  }),
);

const uploadPath = path.resolve(process.cwd(), "uploads");
app.use(
  "/uploads",
  (_req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=31536000");
    next();
  },
  express.static(uploadPath, {
    fallthrough: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(generalLimiter);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: prisma ? "connected" : "disconnected",
  });
});

const jwtService = new JwtService();
const passwordService = new PasswordService();

const userRepository = new PrismaUserRepository();
const productRepository = new PrismaProductRepository();
const cartRepository = new PrismaCartRepository();
const orderRepository = new PrismaOrderRepository();
const auditLogRepository = new PrismaAuditLogRepository();
const statusHistoryRepository = new PrismaOrderStatusHistoryRepository();
const categoryRepository = new PrismaCategoryRepository();
const brandRepository = new PrismaBrandRepository();
const promoRepository = new PrismaPromoRepository();
const voucherRepository = new PrismaVoucherRepository();
const voucherUsageRepository = new PrismaVoucherUsageRepository();
const bannerRepository = new PrismaBannerRepository();
const downloadRepository = new PrismaDownloadRepository();
const productReviewRepository = new PrismaProductReviewRepository();

const registerUseCase = new RegisterUseCase(
  userRepository,
  passwordService,
  jwtService,
);
const loginUseCase = new LoginUseCase(
  userRepository,
  passwordService,
  jwtService,
);
const refreshTokenUseCase = new RefreshTokenUseCase(userRepository, jwtService);
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository);
const resetPasswordUseCase = new ResetPasswordUseCase(
  userRepository,
  passwordService,
);

const getVouchersUseCase = new GetVouchersUseCase(voucherRepository);
const getVoucherByIdUseCase = new GetVoucherByIdUseCase(voucherRepository);
const createVoucherUseCase = new CreateVoucherUseCase(voucherRepository);
const updateVoucherUseCase = new UpdateVoucherUseCase(voucherRepository);
const deleteVoucherUseCase = new DeleteVoucherUseCase(voucherRepository);
const getMyReviewsUseCase = new GetMyReviewsUseCase(productReviewRepository);
const validateVoucherUseCase = new ValidateVoucherUseCase(
  voucherUsageRepository,
  orderRepository,
);
const claimVoucherUseCase = new ClaimVoucherUseCase(
  voucherRepository,
  voucherUsageRepository,
  orderRepository,
);
const getMyVouchersUseCase = new GetMyVouchersUseCase(voucherUsageRepository);

const getProductsUseCase = new GetProductsUseCase(productRepository);
const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
const createProductUseCase = new CreateProductUseCase(productRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const deleteProductUseCase = new DeleteProductUseCase(productRepository);

const getCartUseCase = new GetCartUseCase(cartRepository);
const addToCartUseCase = new AddToCartUseCase(cartRepository);
const updateCartItemUseCase = new UpdateCartItemUseCase(cartRepository);
const removeCartItemUseCase = new RemoveCartItemUseCase(cartRepository);

const createOrderUseCase = new CreateOrderUseCase(
  orderRepository,
  cartRepository,
  productRepository,
  statusHistoryRepository,
  voucherUsageRepository,
  voucherRepository,
  validateVoucherUseCase,
);
const getOrdersUseCase = new GetOrdersUseCase(orderRepository);
const getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository);
const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(
  orderRepository,
  auditLogRepository,
  statusHistoryRepository,
  voucherUsageRepository,
  voucherRepository,
);
const getOrderHistoryUseCase = new GetOrderHistoryUseCase(
  orderRepository,
  statusHistoryRepository,
);
const getCodPendingUseCase = new GetCodPendingUseCase(orderRepository);
const confirmCodReceivedUseCase = new ConfirmCodReceivedUseCase(
  orderRepository,
  updateOrderStatusUseCase,
);
const getAllOrdersUseCase = new GetAllOrdersUseCase(orderRepository);
const getRevenueReportUseCase = new GetRevenueReportUseCase(orderRepository);

const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository);
const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);
const getCategoryBySlugUseCase = new GetCategoryBySlugUseCase(
  categoryRepository,
);
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);

const getBrandsUseCase = new GetBrandsUseCase(brandRepository);
const getBrandByIdUseCase = new GetBrandByIdUseCase(brandRepository);
const createBrandUseCase = new CreateBrandUseCase(brandRepository);
const updateBrandUseCase = new UpdateBrandUseCase(brandRepository);
const deleteBrandUseCase = new DeleteBrandUseCase(brandRepository);

const getPromosUseCase = new GetPromosUseCase(promoRepository);
const getPromoByIdUseCase = new GetPromoByIdUseCase(promoRepository);
const createPromoUseCase = new CreatePromoUseCase(promoRepository);
const updatePromoUseCase = new UpdatePromoUseCase(promoRepository);
const deletePromoUseCase = new DeletePromoUseCase(promoRepository);

const getBannersUseCase = new GetBannersUseCase(bannerRepository);
const getBannerByIdUseCase = new GetBannerByIdUseCase(bannerRepository);
const createBannerUseCase = new CreateBannerUseCase(bannerRepository);
const updateBannerUseCase = new UpdateBannerUseCase(bannerRepository);
const deleteBannerUseCase = new DeleteBannerUseCase(bannerRepository);

const trackDownloadUseCase = new TrackDownloadUseCase(downloadRepository);
const getDownloadStatsUseCase = new GetDownloadStatsUseCase(downloadRepository);
const getDownloadAnalyticsUseCase = new GetDownloadAnalyticsUseCase(
  downloadRepository,
);

const getUsersUseCase = new GetUsersUseCase(userRepository);
const updateUserRoleUseCase = new UpdateUserRoleUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

const stripeService = new StripeService(
  orderRepository,
  updateOrderStatusUseCase,
);

const authController = new AuthController(
  registerUseCase,
  loginUseCase,
  refreshTokenUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase,
);

const productController = new ProductController(
  getProductsUseCase,
  getProductByIdUseCase,
  createProductUseCase,
  updateProductUseCase,
  deleteProductUseCase,
);

const createProductReviewUseCase = new CreateProductReviewUseCase(
  productReviewRepository,
  orderRepository,
);
const getProductReviewsUseCase = new GetProductReviewsUseCase(
  productReviewRepository,
);

const productReviewController = new ProductReviewController(
  createProductReviewUseCase,
  getProductReviewsUseCase,
  getMyReviewsUseCase,
);

const cartController = new CartController(
  getCartUseCase,
  addToCartUseCase,
  updateCartItemUseCase,
  removeCartItemUseCase,
);

const cancelMyOrderUseCase = new CancelMyOrderUseCase(
  orderRepository,
  statusHistoryRepository,
  voucherUsageRepository,
  voucherRepository,
  auditLogRepository,
);

const orderController = new OrderController(
  createOrderUseCase,
  getOrdersUseCase,
  getOrderByIdUseCase,
  updateOrderStatusUseCase,
  getAllOrdersUseCase,
  getRevenueReportUseCase,
  getOrderHistoryUseCase,
  getCodPendingUseCase,
  confirmCodReceivedUseCase,
  cancelMyOrderUseCase,
);

const downloadController = new DownloadController(
  trackDownloadUseCase,
  getDownloadStatsUseCase,
  getDownloadAnalyticsUseCase,
);

const userController = new UserController(
  getUsersUseCase,
  updateUserRoleUseCase,
  deleteUserUseCase,
);

const paymentController = new PaymentController(
  stripeService,
  getOrderByIdUseCase,
);

const uploadController = new UploadController();

const categoryController = new CategoryController(
  getCategoriesUseCase,
  getCategoryByIdUseCase,
  getCategoryBySlugUseCase,
  createCategoryUseCase,
  updateCategoryUseCase,
  deleteCategoryUseCase,
);

const brandController = new BrandController(
  getBrandsUseCase,
  getBrandByIdUseCase,
  createBrandUseCase,
  updateBrandUseCase,
  deleteBrandUseCase,
);

const promoController = new PromoController(
  getPromosUseCase,
  getPromoByIdUseCase,
  createPromoUseCase,
  updatePromoUseCase,
  deletePromoUseCase,
);

const voucherController = new VoucherController(
  getVouchersUseCase,
  getVoucherByIdUseCase,
  createVoucherUseCase,
  updateVoucherUseCase,
  deleteVoucherUseCase,
  validateVoucherUseCase,
  claimVoucherUseCase,
  getMyVouchersUseCase,
);

const bannerController = new BannerController(
  getBannersUseCase,
  getBannerByIdUseCase,
  createBannerUseCase,
  updateBannerUseCase,
  deleteBannerUseCase,
);

app.use("/api/auth", createAuthRoutes(authController));
app.use("/api/products", createProductRoutes(productController, jwtService));
app.use("/api/cart", createCartRoutes(cartController, jwtService));
app.use("/api/orders", createOrderRoutes(orderController, jwtService));
app.use("/api/payment", createPaymentRoutes(paymentController, jwtService));
app.use("/api/upload", createUploadRoutes(uploadController, jwtService));
app.use(
  "/api/categories",
  createCategoryRoutes(categoryController, jwtService),
);
app.use(
  "/api/reviews",
  createProductReviewRoutes(productReviewController, jwtService),
);

app.use("/api/brands", createBrandRoutes(brandController, jwtService));
app.use("/api/promos", createPromoRoutes(promoController, jwtService));
app.use("/api/vouchers", createVoucherRoutes(voucherController, jwtService));
app.use("/api/banners", createBannerRoutes(bannerController, jwtService));
app.use("/api/downloads", createDownloadRoutes(downloadController, jwtService));
app.use("/api/users", createUserRoutes(userController, jwtService));

app.use(errorMiddleware);

const PORT = config.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${config.NODE_ENV}`);
  logger.info(`API URL: http://localhost:${PORT}/api`);
});

process.on("SIGINT", async () => {
  logger.info("Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});

export { app };
