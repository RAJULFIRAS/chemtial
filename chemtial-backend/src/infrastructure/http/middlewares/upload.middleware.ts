import multer from "multer";
import { ValidationError } from "../../../shared/exceptions/app.error.js";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const ALLOWED_VIDEO_TYPES = ["video/mp4"];

const IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const VIDEO_MAX_SIZE = 20 * 1024 * 1024; // 20MB
const DEFAULT_MAX_SIZE = IMAGE_MAX_SIZE;

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.mimetype);
  if (isImage) {
    cb(null, true);
    return;
  }
  cb(
    new ValidationError("File type not allowed. Use JPEG, PNG, WEBP, or GIF."),
  );
};

const bannerFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.mimetype);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.mimetype);
  if (isImage || isVideo) {
    cb(null, true);
    return;
  }
  cb(
    new ValidationError(
      "Unsupported format. Use image (JPEG, PNG, WEBP, GIF) or video MP4.",
    ),
  );
};

const memoryStorage = multer.memoryStorage();

const baseUploader = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: DEFAULT_MAX_SIZE,
    files: 1,
  },
});

const bannerUploader = multer({
  storage: memoryStorage,
  fileFilter: bannerFileFilter,
  limits: {
    fileSize: VIDEO_MAX_SIZE,
    files: 1,
  },
});

export const uploadProductImage = baseUploader.single("image");
export const uploadBrandLogo = baseUploader.single("logo");
export const uploadCategoryImage = baseUploader.single("image");
export const uploadPromoImage = baseUploader.single("image");
export const uploadBannerFile = bannerUploader.single("file");
export const uploadSingle = baseUploader.single("file");
