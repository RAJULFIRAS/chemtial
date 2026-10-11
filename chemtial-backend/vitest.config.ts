import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    testTimeout: 30000,
    hookTimeout: 30000,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.d.ts",
        "src/server.ts",
        "src/**/index.ts",
        "src/scripts/**",
        "src/config/**",
        "src/infrastructure/database/prisma/client.ts",
        "src/infrastructure/http/routes/**",
        "src/infrastructure/http/middlewares/**",
        "src/infrastructure/http/controllers/**",
        "src/infrastructure/auth/jwt.service.ts",
        "src/infrastructure/auth/password.service.ts",
        "src/infrastructure/payment/**",
        "src/shared/utils/logger.ts",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
