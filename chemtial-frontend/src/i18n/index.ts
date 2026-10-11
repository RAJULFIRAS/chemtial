import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./locales/en.json";
import idTranslation from "./locales/id.json";
import zhTranslation from "./locales/zh.json";
import hiTranslation from "./locales/hi.json";
import ruTranslation from "./locales/ru.json";
import arTranslation from "./locales/ar.json";

const resources = {
  en: { translation: enTranslation },
  id: { translation: idTranslation },
  zh: { translation: zhTranslation },
  hi: { translation: hiTranslation },
  ru: { translation: ruTranslation },
  ar: { translation: arTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "id", "zh", "hi", "ru", "ar"],
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
