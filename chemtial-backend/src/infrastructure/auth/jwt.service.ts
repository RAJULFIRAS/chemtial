import jwt from "jsonwebtoken";
import { config } from "../../config/env.validation.js";

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export class JwtService {
  private readonly jwtSecret: string;
  private readonly refreshSecret: string;

  constructor() {
    this.jwtSecret = config.JWT_SECRET;
    this.refreshSecret = config.REFRESH_SECRET;
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: config.JWT_EXPIRY as any,
      algorithm: "HS256",
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: config.REFRESH_EXPIRY as any,
      algorithm: "HS256",
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as TokenPayload;
    } catch {
      throw new Error("Invalid or expired token");
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.refreshSecret) as TokenPayload;
    } catch {
      throw new Error("Invalid or expired refresh token");
    }
  }

  decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }

  getRefreshTokenExpiryDate(): Date {
    const expiry = config.REFRESH_EXPIRY;
    const match = expiry.match(/^(\d+)([dhms])$/);

    if (!match) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const value = parseInt(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * multipliers[unit]);
  }
}
