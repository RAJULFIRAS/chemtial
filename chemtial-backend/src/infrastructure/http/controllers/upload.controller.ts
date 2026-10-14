import { Request, Response, NextFunction } from "express";
import { put } from "@vercel/blob";
import path from "path";
import crypto from "crypto";
import { ValidationError } from "../../../shared/exceptions/app.error";
import { logger } from "../../../shared/utils/logger";

type UploadFolder =
  | "products"
  | "brands"
  | "categories"
  | "promos"
  | "banners"
  | "others";

const IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const VIDEO_MAX_SIZE = 20 * 1024 * 1024;

export class UploadController {
  private async uploadToBlob(
    file: Express.Multer.File,
    folder: UploadFolder,
  ): Promise<{
    path: string;
    filename: string;
    url: string;
    originalName: string;
    mimetype: string;
    size: number;
  }> {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const uniqueId = crypto.randomBytes(8).toString("hex");
    const filename = `${folder}-${Date.now()}-${uniqueId}${ext}`;
    const blobPath = `${folder}/${filename}`;

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      throw new ValidationError("BLOB_READ_WRITE_TOKEN is not configured");
    }

    try {
      const blob = await put(blobPath, file.buffer, {
        access: "public",
        contentType: file.mimetype,
        token,
      });

      logger.info(
        `[UploadController] Uploaded to Blob: ${blob.url} (${file.size} bytes)`,
      );

      return {
        path: blob.url,
        filename,
        url: blob.url,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      };
    } catch (error) {
      logger.error({ err: error }, "[UploadController] Blob upload failed");
      throw new ValidationError(
        error instanceof Error ? error.message : "Upload to Blob failed",
      );
    }
  }

  private createHandler(folder: UploadFolder) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const file = req.file;
        if (!file) {
          throw new ValidationError("No file uploaded");
        }

        const saved = await this.uploadToBlob(file, folder);

        res.status(201).json({
          success: true,
          data: {
            path: saved.path,
            url: saved.url,
            filename: saved.filename,
            originalName: saved.originalName,
            mimetype: saved.mimetype,
            size: saved.size,
          },
          message: "File uploaded successfully",
        });
      } catch (error) {
        next(error);
      }
    };
  }

  uploadProduct = this.createHandler("products");
  uploadBrand = this.createHandler("brands");
  uploadCategory = this.createHandler("categories");
  uploadPromo = this.createHandler("promos");

  uploadBanner = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const file = req.file;
      if (!file) {
        throw new ValidationError("No file uploaded");
      }

      const isVideo = file.mimetype === "video/mp4";

      if (isVideo && file.size > VIDEO_MAX_SIZE) {
        throw new ValidationError("Video maksimal 20MB");
      }
      if (!isVideo && file.size > IMAGE_MAX_SIZE) {
        throw new ValidationError("Gambar maksimal 5MB");
      }

      const saved = await this.uploadToBlob(file, "banners");

      res.status(201).json({
        success: true,
        data: {
          path: saved.path,
          url: saved.url,
          filename: saved.filename,
          originalName: saved.originalName,
          mimetype: saved.mimetype,
          size: saved.size,
          mediaType: isVideo ? "video" : "image",
        },
        message: "File uploaded successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  uploadSingle = this.createHandler("others");
}
