import i18n from "../i18n";

export const getLocalizedName = (item: {
  name: string;
  nameEn?: string | null;
  nameZh?: string | null;
  nameHi?: string | null;
  nameRu?: string | null;
  nameAr?: string | null;
}): string => {
  const lang = i18n.language;
  if (lang === "en" && item.nameEn) return item.nameEn;
  if (lang === "zh" && item.nameZh) return item.nameZh;
  if (lang === "hi" && item.nameHi) return item.nameHi;
  if (lang === "ru" && item.nameRu) return item.nameRu;
  if (lang === "ar" && item.nameAr) return item.nameAr;
  return item.name;
};

export const getLocalizedDescription = (item: {
  description?: string | null;
  descriptionEn?: string | null;
  descriptionZh?: string | null;
  descriptionHi?: string | null;
  descriptionRu?: string | null;
  descriptionAr?: string | null;
}): string => {
  const lang = i18n.language;
  if (lang === "en" && item.descriptionEn) return item.descriptionEn;
  if (lang === "zh" && item.descriptionZh) return item.descriptionZh;
  if (lang === "hi" && item.descriptionHi) return item.descriptionHi;
  if (lang === "ru" && item.descriptionRu) return item.descriptionRu;
  if (lang === "ar" && item.descriptionAr) return item.descriptionAr;
  return item.description || "";
};
