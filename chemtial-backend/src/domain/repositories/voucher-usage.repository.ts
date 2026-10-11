export interface VoucherUsageEntry {
  id: string;
  voucherId: string;
  userId: string;
  orderId: string | null;
  status: string;
  discountAmount: number | null;
  claimedAt: Date;
  usedAt: Date | null;
  voucher?: {
    id: string;
    code: string;
    title: string;
    description: string | null;
    type: string;
    category: string;
    value: number;
    minPurchase: number | null;
    maxDiscount: number | null;
    startDate: Date;
    endDate: Date;
    usageLimit: number | null;
    usageCount: number;
    perUserLimit: number;
    isActive: boolean;
  };
}

export interface VoucherUsageRepository {
  claim(voucherId: string, userId: string): Promise<VoucherUsageEntry>;

  findById(id: string): Promise<VoucherUsageEntry | null>;

  findByUser(userId: string, status?: string): Promise<VoucherUsageEntry[]>;

  findActiveClaimedByUser(userId: string): Promise<VoucherUsageEntry[]>;

  findByUserAndVoucher(
    userId: string,
    voucherId: string,
  ): Promise<VoucherUsageEntry | null>;

  markUsed(
    id: string,
    orderId: string,
    discountAmount: number,
  ): Promise<VoucherUsageEntry>;

  markReturned(id: string): Promise<VoucherUsageEntry>;

  findUsedByOrderId(orderId: string): Promise<VoucherUsageEntry | null>;
}
