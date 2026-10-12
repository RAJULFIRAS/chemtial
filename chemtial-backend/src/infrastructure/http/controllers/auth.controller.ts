import { Request, Response, NextFunction } from "express";
import { RegisterUseCase } from "../../../application/use-cases/auth/register.use-case.js";
import { LoginUseCase } from "../../../application/use-cases/auth/login.use-case.js";
import { RefreshTokenUseCase } from "../../../application/use-cases/auth/refresh-token.use-case.js";
import { ForgotPasswordUseCase } from "../../../application/use-cases/auth/forgot-password.use-case.js";
import { ResetPasswordUseCase } from "../../../application/use-cases/auth/reset-password.use-case.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../../../application/dtos/auth.dto.js";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../../../application/dtos/password-reset.dto.js";

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await this.registerUseCase.execute(validated);
      res.status(201).json({
        success: true,
        data: result,
        message: "Registration successful",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await this.loginUseCase.execute(validated);
      res.status(200).json({
        success: true,
        data: result,
        message: "Login successful",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validated = forgotPasswordSchema.parse(req.body);
      await this.forgotPasswordUseCase.execute(validated);
      res.status(200).json({
        success: true,
        message:
          "If the email is registered, we've sent a password reset link to it.",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validated = resetPasswordSchema.parse(req.body);
      await this.resetPasswordUseCase.execute(validated);
      res.status(200).json({
        success: true,
        message:
          "Password reset successfully. Please login with your new password.",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validated = refreshTokenSchema.parse(req.body);
      const result = await this.refreshTokenUseCase.execute(validated);
      res.status(200).json({
        success: true,
        data: result,
        message: "Token refreshed successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
}
