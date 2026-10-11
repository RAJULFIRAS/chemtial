const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return "/images/placeholder.png";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  if (imagePath.startsWith("blob:")) {
    return imagePath;
  }

  const baseUrl = API_BASE_URL.replace(/\/api\/?$/, "");

  if (imagePath.startsWith("/")) {
    return `${baseUrl}${imagePath}`;
  }

  return `${baseUrl}/${imagePath}`;
};
