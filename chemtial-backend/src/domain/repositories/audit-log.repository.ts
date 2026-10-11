export interface AuditLogRepository {
  create(data: {
    userId: string;
    action: string;
    resource: string;
    resourceId: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void>;
}
