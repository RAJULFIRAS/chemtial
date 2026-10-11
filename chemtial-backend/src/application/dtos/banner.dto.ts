import { z } from "zod";

const bannerBaseSchema = z.object({
  file: z.string().min(1),
  mediaType: z.enum(["image", "video"]).default("image"),
  position: z.enum(["hero", "home"]).default("hero"),
  sortOrder: z.number().int().default(0),
  startDate: z.string().datetime().or(z.date()).optional(),
  endDate: z.string().datetime().or(z.date()).optional(),
});

export const createBannerSchema = bannerBaseSchema.refine(
  (data) => !(data.position === "hero" && data.mediaType === "video"),
  { message: "Image Slider hanya mendukung gambar." },
);

export const updateBannerSchema = bannerBaseSchema.partial();

export type CreateBannerDTO = z.infer<typeof createBannerSchema>;
export type UpdateBannerDTO = z.infer<typeof updateBannerSchema>;

export interface BannerResponse {
  id: string;
  file: string;
  mediaType: "image" | "video";
  position: string;
  sortOrder: number;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
