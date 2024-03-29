import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { i18n as i18nConfig } from "../../next-i18next.config";
import about from "../../public/locales/en/about.json";
import create from "../../public/locales/en/create.json";
import forms from "../../public/locales/en/forms.json";
import main from "../../public/locales/en/main.json";
import navbar from "../../public/locales/en/navbar.json";

i18n.use(initReactI18next).init({
  ...i18nConfig,
  lng: "en",
  debug: false,
  resources: {
    en: {
      about,
      create,
      forms,
      main,
      navbar,
    },
  },
});

window.i18n = i18n;
