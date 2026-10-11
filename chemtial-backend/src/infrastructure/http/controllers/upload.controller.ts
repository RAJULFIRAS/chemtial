import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { config } from "../../../config/env.validation";
import { ValidationError } from "../../../shared/exceptions/app.error";

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
  private saveBufferToDisk(
    file: Express.Multer.File,
    folder: UploadFolder,
  ): { relativePath: string; filename: string; url: string } {
    const uploadDir = path.resolve(config.UPLOAD_DIR);
    const targetDir = path.join(uploadDir, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const uniqueId = crypto.randomBytes(8).toString("hex");
    const filename = `${folder}-${Date.now()}-${uniqueId}${ext}`;
    const filepath = path.join(targetDir, filename);

    fs.writeFileSync(filepath, file.buffer);

    const relativePath = `uploads/${folder}/${filename}`;
    const url = `${config.BASE_URL}/${relativePath}`;

    return { relativePath, filename, url };
  }

  private createHandler(folder: UploadFolder) {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const file = req.file;
        if (!file) {
          throw new ValidationError("No file uploaded");
        }

        const saved = this.saveBufferToDisk(file, folder);

        res.status(201).json({
          success: true,
          data: {
            path: saved.relativePath,
            url: saved.url,
            filename: saved.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
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

  uploadBanner = (req: Request, res: Response, next: NextFunction): void => {
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

      const saved = this.saveBufferToDisk(file, "banners");

      res.status(201).json({
        success: true,
        data: {
          path: saved.relativePath,
          url: saved.url,
          filename: saved.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
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
