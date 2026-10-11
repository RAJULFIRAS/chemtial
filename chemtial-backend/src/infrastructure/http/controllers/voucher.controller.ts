import { Request, Response, NextFunction } from "express";
import { GetVouchersUseCase } from "../../../application/use-cases/voucher/get-vouchers.use-case";
import { GetVoucherByIdUseCase } from "../../../application/use-cases/voucher/get-voucher-by-id.use-case";
import { CreateVoucherUseCase } from "../../../application/use-cases/voucher/create-voucher.use-case";
import { UpdateVoucherUseCase } from "../../../application/use-cases/voucher/update-voucher.use-case";
import { DeleteVoucherUseCase } from "../../../application/use-cases/voucher/delete-voucher.use-case";
import { ValidateVoucherUseCase } from "../../../application/use-cases/voucher/validate-voucher.use-case";
import { ClaimVoucherUseCase } from "../../../application/use-cases/voucher/claim-voucher.use-case";
import { GetMyVouchersUseCase } from "../../../application/use-cases/voucher/get-my-vouchers.use-case";
import {
  createVoucherSchema,
  updateVoucherSchema,
  validateVoucherSchema,
} from "../../../application/dtos/voucher.dto";
import { UnauthorizedError } from "../../../shared/exceptions/app.error";

export class VoucherController {
  constructor(
    private readonly getVouchersUseCase: GetVouchersUseCase,
    private readonly getVoucherByIdUseCase: GetVoucherByIdUseCase,
    private readonly createVoucherUseCase: CreateVoucherUseCase,
    private readonly updateVoucherUseCase: UpdateVoucherUseCase,
    private readonly deleteVoucherUseCase: DeleteVoucherUseCase,
    private readonly validateVoucherUseCase: ValidateVoucherUseCase,
    private readonly claimVoucherUseCase: ClaimVoucherUseCase,
    private readonly getMyVouchersUseCase: GetMyVouchersUseCase,
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { isActive, search, activeNow, category } = req.query;
      const vouchers = await this.getVouchersUseCase.execute({
        isActive:
          isActive === "true" ? true : isActive === "false" ? false : undefined,
        search: search as string,
        onlyActiveNow: activeNow === "true",
        category: category as string,
      });
      res.json({ success: true, data: vouchers });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const voucher = await this.getVoucherByIdUseCase.execute(id);
      res.json({ success: true, data: voucher });
    } catch (error) {
      next(error);
    }
  }

  async claim(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError("Authentication required");
      }

      const { id } = req.params;
      const result = await this.claimVoucherUseCase.execute(id, userId);

      res.status(201).json({
        success: true,
        data: result,
        message: "Voucher claimed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyVouchers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError("Authentication required");
      }

      const { status } = req.query;
      const vouchers = await this.getMyVouchersUseCase.execute(
        userId,
        status as string,
      );
      res.json({ success: true, data: vouchers });
    } catch (error) {
      next(error);
    }
  }

  async validate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError("Authentication required");
      }

      const validated = validateVoucherSchema.parse(req.body);
      const result = await this.validateVoucherUseCase.execute({
        voucherUsageId: validated.voucherUsageId,
        userId,
        orderAmount: validated.orderAmount,
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createVoucherSchema.parse(req.body);
      const voucher = await this.createVoucherUseCase.execute(validated);
      res.status(201).json({
        success: true,
        data: voucher,
        message: "Voucher created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validated = updateVoucherSchema.parse(req.body);
      const voucher = await this.updateVoucherUseCase.execute(id, validated);
      res.json({
        success: true,
        data: voucher,
        message: "Voucher updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteVoucherUseCase.execute(id);
      res.json({ success: true, message: "Voucher deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
