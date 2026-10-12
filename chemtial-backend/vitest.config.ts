import { defineConfig } from "vitest/config";

const RUN_E2E = process.env.RUN_E2E === "true";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
    exclude: [
      "node_modules",
      "dist",
      ...(RUN_E2E ? [] : ["tests/integration/e2e/**"]),
    ],
    testTimeout: 30000,
    hookTimeout: 30000,
    fileParallelism: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.d.ts",
        "src/server.ts",
        "src/config/**",
        "src/scripts/**",
        "src/infrastructure/**",
        "src/shared/**",
        "src/domain/repositories/**",
        "src/application/dtos/**",

        "src/application/use-cases/banner/**",
        "src/application/use-cases/brand/**",
        "src/application/use-cases/category/**",
        "src/application/use-cases/promo/**",
        "src/application/use-cases/user/**",
        "src/application/use-cases/download/**",

        "src/application/use-cases/product/create-product.use-case.ts",
        "src/application/use-cases/product/update-product.use-case.ts",
        "src/application/use-cases/product/delete-product.use-case.ts",
        "src/application/use-cases/product/create-product-review.use-case.ts",
        "src/application/use-cases/product/get-product-reviews.use-case.ts",
        "src/application/use-cases/product/get-my-reviews.use-case.ts",

        "src/application/use-cases/voucher/create-voucher.use-case.ts",
        "src/application/use-cases/voucher/update-voucher.use-case.ts",
        "src/application/use-cases/voucher/delete-voucher.use-case.ts",
        "src/application/use-cases/voucher/get-vouchers.use-case.ts",
        "src/application/use-cases/voucher/get-voucher-by-id.use-case.ts",
        "src/application/use-cases/voucher/get-my-vouchers.use-case.ts",

        "src/application/use-cases/order/create-order.use-case.ts",
        "src/application/use-cases/order/cancel-my-order.use-case.ts",
        "src/application/use-cases/order/confirm-cod-received.use-case.ts",
        "src/application/use-cases/order/get-all-orders.use-case.ts",
        "src/application/use-cases/order/get-cod-pending.use-case.ts",
        "src/application/use-cases/order/get-order-by-id.use-case.ts",
        "src/application/use-cases/order/get-order-history.use-case.ts",
        "src/application/use-cases/order/get-orders.use-case.ts",
        "src/application/use-cases/order/get-revenue-report.use-case.ts",
        "src/application/use-cases/cart/**",

        "src/application/mappers/**",
        "src/domain/entities/brand.entity.ts",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
