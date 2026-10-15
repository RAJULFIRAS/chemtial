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

  const map: Record<string, string | null | undefined> = {
    en: item.nameEn,
    zh: item.nameZh,
    hi: item.nameHi,
    ru: item.nameRu,
    ar: item.nameAr,
  };

  const localized = map[lang];
  if (localized) return localized;

  if (lang !== "en" && item.nameEn) return item.nameEn;

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

  const map: Record<string, string | null | undefined> = {
    en: item.descriptionEn,
    zh: item.descriptionZh,
    hi: item.descriptionHi,
    ru: item.descriptionRu,
    ar: item.descriptionAr,
  };

  const localized = map[lang];
  if (localized) return localized;

  if (lang !== "en" && item.descriptionEn) return item.descriptionEn;

  return item.description || "";
};

export const hasTranslation = (
  item: {
    nameEn?: string | null;
    nameZh?: string | null;
    nameHi?: string | null;
    nameRu?: string | null;
    nameAr?: string | null;
  },
  lang: "en" | "zh" | "hi" | "ru" | "ar",
): boolean => {
  const map: Record<string, string | null | undefined> = {
    en: item.nameEn,
    zh: item.nameZh,
    hi: item.nameHi,
    ru: item.nameRu,
    ar: item.nameAr,
  };
  const value = map[lang];
  return typeof value === "string" && value.trim().length > 0;
};
