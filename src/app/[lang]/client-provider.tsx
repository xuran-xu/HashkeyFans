"use client";

import i18n from '@/i18n';
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { usePathname, useRouter } from 'next/navigation';

export default function ClientProvider({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState(lang);
  console.log('currentLang', currentLang);
  useEffect(() => {
    const initI18n = async () => {
      const savedLang = localStorage.getItem('i18nextLng');
      const targetLang = savedLang || lang;

      if (i18n.language !== targetLang) {
        try {
          await i18n.changeLanguage(targetLang);
          localStorage.setItem('i18nextLng', targetLang);
          setCurrentLang(targetLang);
          
          // 更新 URL 以匹配语言
          const segments = pathname.split('/');
          if (segments[1] !== targetLang) {
            segments[1] = targetLang;
            const newPath = segments.join('/');
            router.replace(newPath);
          }
        } catch (error) {
          console.error('Language change error:', error);
        }
      }
    };

    initI18n();
  }, [lang, pathname, router]);

  // 监听语言变化
  useEffect(() => {
    const handleLanguageChanged = (newLang: string) => {
      localStorage.setItem('i18nextLng', newLang);
      setCurrentLang(newLang);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
} 