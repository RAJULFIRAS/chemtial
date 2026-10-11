import { VoucherUsageRepository } from "../../../domain/repositories/voucher-usage.repository";

export interface MyVoucherResponse {
  usageId: string;
  status: string;
  claimedAt: Date;
  usedAt: Date | null;
  orderId: string | null;
  discountAmount: number | null;
  voucher: {
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
    isActive: boolean;
    isExpired: boolean;
  };
}

export class GetMyVouchersUseCase {
  constructor(
    private readonly voucherUsageRepository: VoucherUsageRepository,
  ) {}

  async execute(userId: string, status?: string): Promise<MyVoucherResponse[]> {
    const usages = await this.voucherUsageRepository.findByUser(userId, status);

    const now = new Date();
    return usages.map((u) => {
      const v = u.voucher!;
      return {
        usageId: u.id,
        status: u.status,
        claimedAt: u.claimedAt,
        usedAt: u.usedAt,
        orderId: u.orderId,
        discountAmount: u.discountAmount,
        voucher: {
          id: v.id,
          code: v.code,
          title: v.title,
          description: v.description,
          type: v.type,
          category: v.category,
          value: v.value,
          minPurchase: v.minPurchase,
          maxDiscount: v.maxDiscount,
          startDate: v.startDate,
          endDate: v.endDate,
          isActive: v.isActive,
          isExpired: v.endDate < now || !v.isActive,
        },
      };
    });
  }
}
