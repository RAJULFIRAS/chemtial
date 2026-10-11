import React, { useState, useEffect } from "react";
import { apiClient } from "../../services/api";
import { getImageUrl } from "../../utils/image";

interface PromoBanner {
  id: string;
  file: string;
  mediaType: "image" | "video";
  position: string;
}

const PromoSection: React.FC = () => {
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPromoBanners = async (): Promise<void> => {
      try {
        const response = await apiClient.get("/banners", {
          params: { position: "home", activeNow: "true" },
        });
        setBanners(response.data.data);
      } catch (error) {
        console.error("Failed to load home banners:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromoBanners();
  }, []);

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="w-full h-[200px] md:h-[250px] lg:h-[300px] bg-gray-100 rounded-2xl animate-pulse" />
      </section>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  const banner = banners[0];

  return (
    <section className="mb-12">
      <div className="relative w-full h-[200px] md:h-[250px] lg:h-[300px] overflow-hidden rounded-2xl bg-gray-100">
        {banner.mediaType === "video" ? (
          <video
            src={getImageUrl(banner.file)}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={getImageUrl(banner.file)}
            alt="Promo"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>
    </section>
  );
};

export default PromoSection;
