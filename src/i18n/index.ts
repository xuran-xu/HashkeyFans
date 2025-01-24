import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import zh from './locales/zh';

let initialized = false;

const initI18n = () => {
  if (initialized) return i18n;

  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        zh: { translation: zh }
      },
      lng: 'zh',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      },
      react: {
        useSuspense: false
      }
    });

  initialized = true;
  return i18n;
};

export default initI18n();