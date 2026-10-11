import { Banner } from "@prisma/client";

export interface BannerRepository {
  findById(id: string): Promise<Banner | null>;
  findAll(params: {
    position?: string;
    activeNow?: boolean;
  }): Promise<Banner[]>;
  findActive(position?: string): Promise<Banner[]>;
  save(banner: Banner): Promise<Banner>;
  update(id: string, data: Partial<Banner>): Promise<Banner>;
  delete(id: string): Promise<void>;
}
