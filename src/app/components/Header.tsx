"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaTelegram, FaDiscord } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoEarthOutline, IoNewspaperOutline, IoGridOutline, IoCalendarOutline } from "react-icons/io5";
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
  }, []);

  if (!mounted) {
    return null; // 或者返回一个加载指示器
  }

  const toggleLangMenu = () => {
    setIsLangMenuOpen(prevState => !prevState);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
    const newPathname = pathname.replace(/^\/[a-z]{2}/, `/${lng}`);
    router.push(newPathname);
  };

  return (
    <header className="">
      <div className="container mx-auto md:px-4 md:py-3">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo and Menu */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold rounded-full">
              <img className="rounded-full" src="/img/logo.png" alt="Logo" width={32} height={32} />
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/events" className="flex items-center space-x-2 text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200">
                <IoCalendarOutline className="w-5 h-5" />
                <span>{t('Events')}</span>
              </Link>
              <Link href="/news" className="flex items-center space-x-2 text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200">
                <IoNewspaperOutline className="w-5 h-5" />
                <span>{t('News')}</span>
              </Link>
              <Link href="/projects" className="flex items-center space-x-2 text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200">
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
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <IoEarthOutline className="w-5 h-5" />
                <span>{languages.find(lang => lang.code === i18n.language)?.flag}</span>
              </button>
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
            className="md:hidden text-gray-300 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 p-2">
            <Link href="/events" className="pl-4 flex items-center space-x-2 text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200">
              <IoCalendarOutline className="w-5 h-5" />
              <span>{t('Events')}</span>
            </Link>
            <Link href="/news" className="pl-4 flex items-center space-x-2 text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200">
              <IoNewspaperOutline className="w-5 h-5" />
              <span>{t('News')}</span>
            </Link>
            <Link href="/projects" className="pl-4 flex items-center space-x-2 text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200">
              <IoGridOutline className="w-5 h-5" />
              <span>{t('Projects')}</span>
            </Link>
            <div className="border-t border-gray-200 my-2"></div>
            <a href="https://t.me/HashKeyChainHSK" className="pl-4 flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200">
              <FaTelegram className="w-5 h-5" /> <span>Telegram</span>
            </a>
            <a href="https://discord.gg/qvPkbrYY" className="pl-4 flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200">
              <FaDiscord className="w-5 h-5" /> <span>Discord</span>
            </a>
            <a href="https://x.com/HashKeyHSK" className="pl-4 flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200">
              <FaSquareXTwitter className="w-5 h-5" /> <span>X</span>
            </a>
            <div className="relative pl-4">
              <button
                onClick={toggleLangMenu}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <IoEarthOutline className="w-5 h-5" />
                <span>{languages.find(lang => lang.code === i18n.language)?.flag}</span>
                <span>{languages.find(lang => lang.code === i18n.language)?.name}</span>
              </button>
              {isLangMenuOpen && (
                <div className="mt-2 bg-white rounded-md shadow-lg py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
