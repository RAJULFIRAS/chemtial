import { Router } from "express";
import { UploadController } from "../controllers/upload.controller";
import { uploadLimiter } from "../middlewares/rate-limit.middleware";
import {
  uploadProductImage,
  uploadBrandLogo,
  uploadCategoryImage,
  uploadPromoImage,
  uploadBannerFile,
  uploadSingle,
} from "../middlewares/upload.middleware";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/auth.middleware";
import { JwtService } from "../../auth/jwt.service";

export const createUploadRoutes = (
  controller: UploadController,
  jwtService: JwtService,
): Router => {
  const router = Router();

  router.use(authMiddleware(jwtService));
  router.use(adminMiddleware);
  router.use(uploadLimiter);

  router.post("/product", uploadProductImage, controller.uploadProduct);
  router.post("/brand", uploadBrandLogo, controller.uploadBrand);
  router.post("/category", uploadCategoryImage, controller.uploadCategory);
  router.post("/promo", uploadPromoImage, controller.uploadPromo);
  router.post("/banner", uploadBannerFile, controller.uploadBanner);
  router.post("/single", uploadSingle, controller.uploadSingle);

  return router;
};
