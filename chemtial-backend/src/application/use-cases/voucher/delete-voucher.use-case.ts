import { VoucherRepository } from "../../../domain/repositories/voucher.repository";
import { NotFoundError } from "../../../shared/exceptions/app.error";

export class DeleteVoucherUseCase {
  constructor(private readonly voucherRepository: VoucherRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.voucherRepository.findById(id);
    if (!existing) throw new NotFoundError("Voucher", id);
    await this.voucherRepository.delete(id);
  }
}
