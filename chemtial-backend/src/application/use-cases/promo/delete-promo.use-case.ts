import { PromoRepository } from "../../../domain/repositories/promo.repository";
import { NotFoundError } from "../../../shared/exceptions/app.error";

export class DeletePromoUseCase {
  constructor(private readonly promoRepository: PromoRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.promoRepository.findById(id);
    if (!existing) throw new NotFoundError("Promo", id);
    await this.promoRepository.delete(id);
  }
}
