import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "../../utils/image";
import { apiClient } from "../../services/api";

interface BannerSlide {
  id: string;
  file: string;
  position: string;
}

interface ImageSliderProps {
  autoPlayInterval?: number;
  height?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  autoPlayInterval = 3000,
  height = "h-[200px] md:h-[250px] lg:h-[300px]",
}) => {
  const { t } = useTranslation();
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await apiClient.get("/banners", {
          params: { position: "hero", activeNow: "true" },
        });
        setSlides(response.data.data);
      } catch (error) {
        console.error("Failed to load banners:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (isHovering || slides.length <= 1) return;
    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isHovering, autoPlayInterval, slides.length]);

  if (isLoading) {
    return (
      <div
        className={`w-full ${height} bg-gray-100 rounded-2xl mb-12 animate-pulse`}
      />
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const prevIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;

  return (
    <div
      className="relative rounded-2xl mb-12 group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={`relative w-full ${height} bg-gray-100 rounded-2xl overflow-hidden`}
      >
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <img
            src={getImageUrl(slides[currentIndex].file)}
            alt="Banner"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {slides.length > 1 && (
          <>
            <div className="absolute left-0 top-0 h-full w-72 md:w-96 z-0 overflow-hidden pointer-events-none">
              <div className="absolute left-0 top-0 w-full h-full opacity-40 group-hover:opacity-70 transition-opacity duration-300">
                <img
                  src={getImageUrl(slides[prevIndex].file)}
                  alt={t("slider.previous")}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "right center" }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-transparent" />
            </div>

            <div className="absolute right-0 top-0 h-full w-72 md:w-96 z-0 overflow-hidden pointer-events-none">
              <div className="absolute right-0 top-0 w-full h-full opacity-40 group-hover:opacity-70 transition-opacity duration-300">
                <img
                  src={getImageUrl(slides[nextIndex].file)}
                  alt={t("slider.next")}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "left center" }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-l from-white/60 to-transparent" />
            </div>

            <button
              onClick={goToPrevious}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-white/70 text-black p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-30"
              aria-label={t("slider.previous")}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-white/70 text-black p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-30"
              aria-label={t("slider.next")}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-8 h-2 bg-primary"
                  : "w-2 h-2 bg-gray-400 hover:bg-gray-600"
              }`}
              aria-label={t("slider.go_to_slide", { index: index + 1 })}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
