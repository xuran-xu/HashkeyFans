import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "Subscribe to Our Newsletter": "Subscribe to Our Newsletter",
          "Enter your email": "Enter your email",
          "Subscribe": "Subscribe",
          "Roadmap": "Roadmap",
          "Our Partners": "Our Partners",
          "All rights reserved.": "All rights reserved.",
          "Privacy Policy": "Privacy Policy",
          "Terms of Service": "Terms of Service",
          "Contact Us": "Contact Us"
        }
      },
      zh: {
        translation: {
          "Subscribe to Our Newsletter": "订阅我们的通讯",
          "Enter your email": "输入您的邮箱",
          "Subscribe": "订阅",
          "Roadmap": "路线图",
          "Our Partners": "我们的合作伙伴",
          "All rights reserved.": "版权所有。",
          "Privacy Policy": "隐私政策",
          "Terms of Service": "服务条款",
          "Contact Us": "联系我们"
        }
      }
    },
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
