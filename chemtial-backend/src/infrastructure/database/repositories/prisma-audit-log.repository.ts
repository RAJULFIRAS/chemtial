import { prisma } from "../prisma/client";
import { AuditLogRepository } from "../../../domain/repositories/audit-log.repository";

export class PrismaAuditLogRepository implements AuditLogRepository {
  async create(data: {
    userId: string;
    action: string;
    resource: string;
    resourceId: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        details: data.details || {},
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }
}
