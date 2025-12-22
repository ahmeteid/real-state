import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en.json";
import trTranslations from "./locales/tr.json";
import arTranslations from "./locales/ar.json";

// Get saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations,
    },
    tr: {
      translation: trTranslations,
    },
    ar: {
      translation: arTranslations,
    },
  },
  lng: savedLanguage, // Use saved language or default to 'en'
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
