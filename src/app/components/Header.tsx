"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaTelegram, FaDiscord } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { 
  IoNewspaperOutline, 
  IoGridOutline, 
  IoCalendarOutline,
  IoLanguageOutline,
  IoChevronDownOutline 
} from "react-icons/io5";
import { useTranslation } from 'react-i18next';

const languages = [
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "en", name: "English", flag: "🇺🇸" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 从 URL 中获取当前语言
    const urlLang = pathname.split('/')[1];
    if (urlLang && (urlLang === 'en' || urlLang === 'zh') && urlLang !== i18n.language) {
      i18n.changeLanguage(urlLang);
    }
  }, [pathname]);

  if (!mounted) return null;

  const toggleLangMenu = () => {
    setIsLangMenuOpen(prevState => !prevState);
  };

  const changeLanguage = (lng: string) => {
    const segments = pathname.split('/');
    segments[1] = lng;
    const newPath = segments.join('/');
    
    // 先更新路由
    router.push(newPath);
    // 然后更新语言
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
  };

  // 添加一个辅助函数来生成带语言的链接
  const getLocalizedHref = (path: string) => {
    return `/${i18n.language}${path}`;
  };

  return (
    <header className="">
      <div className="container mx-auto md:px-4 md:py-3">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo and Menu */}
          <div className="flex items-center space-x-6">
            <Link href={getLocalizedHref('/')} className="text-xl font-bold rounded-full">
              <img className="rounded-full" src="/img/logo.png" alt="Logo" width={32} height={32} />
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href={getLocalizedHref('/events')} className="flex items-center space-x-2 text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200">
                <IoCalendarOutline className="w-5 h-5" />
                <span>{t('Events')}</span>
              </Link>
              <Link href={getLocalizedHref('/news')} className="flex items-center space-x-2 text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200">
                <IoNewspaperOutline className="w-5 h-5" />
                <span>{t('News')}</span>
              </Link>
              <Link href={getLocalizedHref('/projects')} className="flex items-center space-x-2 text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200">
                <IoGridOutline className="w-5 h-5" />
                <span>{t('Projects')}</span>
              </Link>
            </nav>
          </div>

          {/* 桌面导航 */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="https://t.me/HashKeyChainHSK" className="text-gray-300 hover:text-white transition-colors duration-200">
              <FaTelegram className="w-5 h-5" />
            </a>
            <a href="https://discord.gg/qvPkbrYY" className="text-gray-300 hover:text-white transition-colors duration-200">
              <FaDiscord className="w-5 h-5" />
            </a>
            <a href="https://x.com/HashKeyHSK" className="text-gray-300 hover:text-white transition-colors duration-200">
              <FaSquareXTwitter className="w-5 h-5" />
            </a>
            <div className="relative">
              <button
                onClick={toggleLangMenu}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
              >
                <IoLanguageOutline className="w-5 h-5" />
                <span>{languages.find(lang => lang.code === i18n.language)?.flag}</span>
                <IoChevronDownOutline className="w-4 h-4" />
              </button>
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-[#1a237e]/95 via-[#311b92]/90 to-[#4a148c]/85 rounded-lg shadow-lg py-1 z-10">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-all duration-200"
                    >
                      {lang.flag} {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 p-2 bg-gradient-to-br from-[#1a237e]/95 via-[#311b92]/90 to-[#4a148c]/85 rounded-lg">
            <Link href={getLocalizedHref('/events')} className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200">
              <IoCalendarOutline className="w-5 h-5" />
              <span>{t('Events')}</span>
            </Link>
            <Link href={getLocalizedHref('/news')} className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200">
              <IoNewspaperOutline className="w-5 h-5" />
              <span>{t('News')}</span>
            </Link>
            <Link href={getLocalizedHref('/projects')} className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200">
              <IoGridOutline className="w-5 h-5" />
              <span>{t('Projects')}</span>
            </Link>
            <div className="border-t border-white/10 my-2"></div>
            <a href="https://t.me/HashKeyChainHSK" className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200">
              <FaTelegram className="w-5 h-5" />
              <span>Telegram</span>
            </a>
            <a href="https://discord.gg/qvPkbrYY" className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200">
              <FaDiscord className="w-5 h-5" />
              <span>Discord</span>
            </a>
            <a href="https://x.com/HashKeyHSK" className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200">
              <FaSquareXTwitter className="w-5 h-5" />
              <span>X</span>
            </a>
            <div className="relative px-4">
              <button
                onClick={toggleLangMenu}
                className="flex items-center space-x-2 py-2 text-white w-full hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <IoLanguageOutline className="w-5 h-5" />
                <span>{languages.find(lang => lang.code === i18n.language)?.flag}</span>
                <span>{languages.find(lang => lang.code === i18n.language)?.name}</span>
                <IoChevronDownOutline className="w-4 h-4 ml-auto" />
              </button>
              {isLangMenuOpen && (
                <div className="mt-2 bg-gradient-to-br from-[#1a237e]/95 via-[#311b92]/90 to-[#4a148c]/85 rounded-lg shadow-lg py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-all duration-200"
                    >
                      {lang.flag} {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
