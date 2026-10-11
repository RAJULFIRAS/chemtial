import { z } from "zod";

export const trackDownloadSchema = z.object({
  platform: z.enum(["playstore", "appstore"]),
  referrer: z.string().optional(),
});

export type TrackDownloadDTO = z.infer<typeof trackDownloadSchema>;

export interface DownloadStatsResponse {
  playstore: number;
  appstore: number;
  total: number;
}