import "./config/load-env";

import express from "express";
import cors from "cors";
import helmet from "helmet";

import { config } from "./config/env.validation.js";
import { prisma } from "./infrastructure/database/prisma/client.js";

import { errorMiddleware } from "./infrastructure/http/middlewares/error.middleware.js";
import { generalLimiter } from "./infrastructure/http/middlewares/rate-limit.middleware.js";

import { PrismaUserRepository } from "./infrastructure/database/repositories/prisma-user.repository.js";
import { PrismaProductRepository } from "./infrastructure/database/repositories/prisma-product.repository.js";
import { PrismaCartRepository } from "./infrastructure/database/repositories/prisma-cart.repository.js";
import { PrismaOrderRepository } from "./infrastructure/database/repositories/prisma-order.repository.js";
import { PrismaAuditLogRepository } from "./infrastructure/database/repositories/prisma-audit-log.repository.js";
import { PrismaOrderStatusHistoryRepository } from "./infrastructure/database/repositories/prisma-order-status-history.repository.js";
import { PrismaCategoryRepository } from "./infrastructure/database/repositories/prisma-category.repository.js";
import { PrismaBrandRepository } from "./infrastructure/database/repositories/prisma-brand.repository.js";
import { PrismaPromoRepository } from "./infrastructure/database/repositories/prisma-promo.repository.js";
import { PrismaVoucherRepository } from "./infrastructure/database/repositories/prisma-voucher.repository.js";
import { PrismaVoucherUsageRepository } from "./infrastructure/database/repositories/prisma-voucher-usage.repository.js";
import { PrismaBannerRepository } from "./infrastructure/database/repositories/prisma-banner.repository.js";
import { PrismaDownloadRepository } from "./infrastructure/database/repositories/prisma-download.repository.js";

import { JwtService } from "./infrastructure/auth/jwt.service.js";
import { PasswordService } from "./infrastructure/auth/password.service.js";
import { RegisterUseCase } from "./application/use-cases/auth/register.use-case.js";
import { LoginUseCase } from "./application/use-cases/auth/login.use-case.js";
import { RefreshTokenUseCase } from "./application/use-cases/auth/refresh-token.use-case.js";
import { ForgotPasswordUseCase } from "./application/use-cases/auth/forgot-password.use-case.js";
import { ResetPasswordUseCase } from "./application/use-cases/auth/reset-password.use-case.js";
import { AuthController } from "./infrastructure/http/controllers/auth.controller.js";
import { createAuthRoutes } from "./infrastructure/http/routes/auth.routes.js";

import { GetProductsUseCase } from "./application/use-cases/product/get-products.use-case.js";
import { GetProductByIdUseCase } from "./application/use-cases/product/get-product-by-id.use-case.js";
import { CreateProductUseCase } from "./application/use-cases/product/create-product.use-case.js";
import { UpdateProductUseCase } from "./application/use-cases/product/update-product.use-case.js";
import { DeleteProductUseCase } from "./application/use-cases/product/delete-product.use-case.js";
import { ProductController } from "./infrastructure/http/controllers/product.controller.js";
import { createProductRoutes } from "./infrastructure/http/routes/product.routes.js";

import { GetCartUseCase } from "./application/use-cases/cart/get-cart.use-case.js";
import { AddToCartUseCase } from "./application/use-cases/cart/add-to-cart.use-case.js";
import { UpdateCartItemUseCase } from "./application/use-cases/cart/update-cart-item.use-case.js";
import { RemoveCartItemUseCase } from "./application/use-cases/cart/remove-cart-item.use-case.js";
import { CartController } from "./infrastructure/http/controllers/cart.controller.js";
import { createCartRoutes } from "./infrastructure/http/routes/cart.routes.js";

import { CreateOrderUseCase } from "./application/use-cases/order/create-order.use-case.js";
import { GetOrdersUseCase } from "./application/use-cases/order/get-orders.use-case.js";
import { GetOrderByIdUseCase } from "./application/use-cases/order/get-order-by-id.use-case.js";
import { UpdateOrderStatusUseCase } from "./application/use-cases/order/update-order-status.use-case.js";
import { GetAllOrdersUseCase } from "./application/use-cases/order/get-all-orders.use-case.js";
import { GetOrderHistoryUseCase } from "./application/use-cases/order/get-order-history.use-case.js";
import { GetCodPendingUseCase } from "./application/use-cases/order/get-cod-pending.use-case.js";
import { ConfirmCodReceivedUseCase } from "./application/use-cases/order/confirm-cod-received.use-case.js";
import { GetRevenueReportUseCase } from "./application/use-cases/order/get-revenue-report.use-case.js";
import { OrderController } from "./infrastructure/http/controllers/order.controller.js";
import { createOrderRoutes } from "./infrastructure/http/routes/order.routes.js";
import { CancelMyOrderUseCase } from "./application/use-cases/order/cancel-my-order.use-case.js";

import { GetVouchersUseCase } from "./application/use-cases/voucher/get-vouchers.use-case.js";
import { GetVoucherByIdUseCase } from "./application/use-cases/voucher/get-voucher-by-id.use-case.js";
import { CreateVoucherUseCase } from "./application/use-cases/voucher/create-voucher.use-case.js";
import { UpdateVoucherUseCase } from "./application/use-cases/voucher/update-voucher.use-case.js";
import { DeleteVoucherUseCase } from "./application/use-cases/voucher/delete-voucher.use-case.js";
import { ValidateVoucherUseCase } from "./application/use-cases/voucher/validate-voucher.use-case.js";
import { ClaimVoucherUseCase } from "./application/use-cases/voucher/claim-voucher.use-case.js";
import { GetMyVouchersUseCase } from "./application/use-cases/voucher/get-my-vouchers.use-case.js";
import { VoucherController } from "./infrastructure/http/controllers/voucher.controller.js";
import { createVoucherRoutes } from "./infrastructure/http/routes/voucher.routes.js";

import { GetCategoriesUseCase } from "./application/use-cases/category/get-categories.use-case.js";
import { GetCategoryByIdUseCase } from "./application/use-cases/category/get-category-by-id.use-case.js";
import { GetCategoryBySlugUseCase } from "./application/use-cases/category/get-category-by-slug.use-case.js";
import { CreateCategoryUseCase } from "./application/use-cases/category/create-category.use-case.js";
import { UpdateCategoryUseCase } from "./application/use-cases/category/update-category.use-case.js";
import { DeleteCategoryUseCase } from "./application/use-cases/category/delete-category.use-case.js";
import { CategoryController } from "./infrastructure/http/controllers/category.controller.js";
import { createCategoryRoutes } from "./infrastructure/http/routes/category.routes.js";

import { GetBrandsUseCase } from "./application/use-cases/brand/get-brands.use-case.js";
import { GetBrandByIdUseCase } from "./application/use-cases/brand/get-brand-by-id.use-case.js";
import { CreateBrandUseCase } from "./application/use-cases/brand/create-brand.use-case.js";
import { UpdateBrandUseCase } from "./application/use-cases/brand/update-brand.use-case.js";
import { DeleteBrandUseCase } from "./application/use-cases/brand/delete-brand.use-case.js";
import { BrandController } from "./infrastructure/http/controllers/brand.controller.js";
import { createBrandRoutes } from "./infrastructure/http/routes/brand.routes.js";

import { GetPromosUseCase } from "./application/use-cases/promo/get-promos.use-case.js";
import { GetPromoByIdUseCase } from "./application/use-cases/promo/get-promo-by-id.use-case.js";
import { CreatePromoUseCase } from "./application/use-cases/promo/create-promo.use-case.js";
import { UpdatePromoUseCase } from "./application/use-cases/promo/update-promo.use-case.js";
import { DeletePromoUseCase } from "./application/use-cases/promo/delete-promo.use-case.js";
import { PromoController } from "./infrastructure/http/controllers/promo.controller.js";
import { createPromoRoutes } from "./infrastructure/http/routes/promo.routes.js";

import { GetBannersUseCase } from "./application/use-cases/banner/get-banners.use-case.js";
import { GetBannerByIdUseCase } from "./application/use-cases/banner/get-banner-by-id.use-case.js";
import { CreateBannerUseCase } from "./application/use-cases/banner/create-banner.use-case.js";
import { UpdateBannerUseCase } from "./application/use-cases/banner/update-banner.use-case.js";
import { DeleteBannerUseCase } from "./application/use-cases/banner/delete-banner.use-case.js";
import { BannerController } from "./infrastructure/http/controllers/banner.controller.js";
import { createBannerRoutes } from "./infrastructure/http/routes/banner.routes.js";

import { TrackDownloadUseCase } from "./application/use-cases/download/track-download.use-case.js";
import { GetDownloadStatsUseCase } from "./application/use-cases/download/get-download-stats.use-case.js";
import { GetDownloadAnalyticsUseCase } from "./application/use-cases/download/get-download-analytics.use-case.js";
import { DownloadController } from "./infrastructure/http/controllers/download.controller.js";
import { createDownloadRoutes } from "./infrastructure/http/routes/download.routes.js";

import { GetUsersUseCase } from "./application/use-cases/user/get-users.use-case.js";
import { UpdateUserRoleUseCase } from "./application/use-cases/user/update-user-role.use-case.js";
import { DeleteUserUseCase } from "./application/use-cases/user/delete-user.use-case.js";
import { UserController } from "./infrastructure/http/controllers/user.controller.js";
import { createUserRoutes } from "./infrastructure/http/routes/user.routes.js";

import { StripeService } from "./infrastructure/payment/stripe.service.js";
import { PaymentController } from "./infrastructure/http/controllers/payment.controller.js";
import { createPaymentRoutes } from "./infrastructure/http/routes/payment.routes.js";
import { UploadController } from "./infrastructure/http/controllers/upload.controller.js";
import { createUploadRoutes } from "./infrastructure/http/routes/upload.routes.js";

import { PrismaProductReviewRepository } from "./infrastructure/database/repositories/prisma-product-review.repository.js";
import { CreateProductReviewUseCase } from "./application/use-cases/product/create-product-review.use-case.js";
import { GetProductReviewsUseCase } from "./application/use-cases/product/get-product-reviews.use-case.js";
import { ProductReviewController } from "./infrastructure/http/controllers/product-review.controller.js";
import { createProductReviewRoutes } from "./infrastructure/http/routes/product-review.routes.js";
import { GetMyReviewsUseCase } from "./application/use-cases/product/get-my-reviews.use-case.js";

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

export { app };
