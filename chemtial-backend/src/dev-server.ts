import "./config/load-env";
import { app } from "./server";
import { config } from "./config/env.validation";
import { logger } from "./shared/utils/logger";
import { prisma } from "./infrastructure/database/prisma/client";

const PORT = config.PORT;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${config.NODE_ENV}`);
  logger.info(`API URL: http://localhost:${PORT}/api`);
});

const shutdown = async (signal: string) => {
  logger.info(`${signal} received — shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
