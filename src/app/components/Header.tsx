"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaTelegram, FaDiscord, FaTwitter } from "react-icons/fa";
import { IoEarthOutline } from "react-icons/io5";
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
  const { i18n } = useTranslation();
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
    // 更新 URL
    const newPathname = pathname.replace(/^\/[a-z]{2}/, `/${lng}`);
    router.push(newPathname);
  };

  return (
    <header className="shadow-sm">
      <div className="container mx-auto md:px-4 md:py-3">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            <img src="/img/logo.png" alt="Logo" width={32} height={32} />
          </Link>

          {/* 桌面导航 */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="https://t.me/HashKeyChainHSK" className="text-gray-600 hover:text-blue-500 transition-colors duration-200">
            </a>
            <a href="https://discord.gg/qvPkbrYY" className="text-gray-600 hover:text-indigo-500 transition-colors duration-200">
              <FaDiscord className="w-5 h-5" />
            </a>
            <a href="https://x.com/HashKeyHSK" className="text-gray-600 hover:text-black transition-colors duration-200">
              <FaTwitter className="w-5 h-5" />
            </a>
            <div className="relative">
              <button
                onClick={toggleLangMenu}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors duration-200"
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
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 p-2 bg-white/50">
            <a href="https://t.me/HashKeyChainHSK" className="block text-gray-600 hover:text-blue-500 transition-colors duration-200">
              <FaTelegram className="w-5 h-5 inline-block mr-2" /> Telegram
            </a>
            <a href="https://discord.gg/qvPkbrYY" className="block text-gray-600 hover:text-indigo-500 transition-colors duration-200">
              <FaDiscord className="w-5 h-5 inline-block mr-2" /> Discord
            </a>
            <a href="https://x.com/HashKeyHSK" className="block text-gray-600 hover:text-black transition-colors duration-200">
              <FaTwitter className="w-5 h-5 inline-block mr-2" /> X
            </a>
            <div className="relative">
              <button
                onClick={toggleLangMenu}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors duration-200"
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
