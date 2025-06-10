"use client"
import React from 'react';
import { generateShareCode } from "@/lib/utils";
import { useAccount } from 'wagmi';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "../common/Icon";
import { LanguageSelector } from "../common/LanguageSelector";
import { menuConfig } from '@/config/menu';
import { IconName } from '@/components/common/Icon';
import ConnectButton from "@/components/common/ConnectButton";


export const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    setMounted(true);
    const urlLang = pathname.split('/')[1];
    if (urlLang && (urlLang === 'en' || urlLang === 'zh' || urlLang === 'ko') && urlLang !== i18n.language) {
      i18n.changeLanguage(urlLang);
    }
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      // 完全禁用滚动
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100vh';
      
      // 禁用触摸滚动
      const preventDefault = (e: Event) => e.preventDefault();
      document.addEventListener('touchmove', preventDefault, { passive: false });
      document.addEventListener('wheel', preventDefault, { passive: false });
      
      return () => {
        document.removeEventListener('touchmove', preventDefault);
        document.removeEventListener('wheel', preventDefault);
      };
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        console.log('isExploreOpen', isExploreOpen);
        setIsExploreOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExploreOpen]);

  const renderMenuItem = (item: { 
    type?: string;
    requireAuth?: boolean;
    link: string;
    key: string;
    icon: IconName;
    iconClass?: string;
  }) => {
    if (item.type === 'divider') return <li className="divider"></li>;
    
    if (item.requireAuth && !address) return null;
    const link = item.requireAuth ? `${item.link}/${generateShareCode(address || '')}` : item.link;
    
    return (
      <li key={item.key}>
        <Link 
          href={link} 
          onClick={() => {
            const dropdown = document.querySelector('.dropdown-content');
            if (dropdown) {
              (dropdown as HTMLElement).style.display = 'none';
              setTimeout(() => {
                (dropdown as HTMLElement).style.display = '';
              }, 100);
            }
          }}
          className="text-white"
        >
          <Icon name={item.icon} className={`h-4 w-4 text-white ${item.iconClass || ''}`} />
          {t(item.key)}
        </Link>
      </li>
    );
  };

  if (!mounted) return null;

  return (
    <div className="navbar bg-transparent" data-theme="dark">
      <div className="navbar-start flex-1">
        <Link href="/" className="btn btn-ghost px-0">
          <img src="/img/hashfans.png" alt="HashFans" className="w-32 h-8" />
        </Link>

        <ul className="hidden lg:flex menu menu-horizontal ml-2">
          {/* Explore 菜单 */}
          <li className="dropdown dropdown-hover">
            <div tabIndex={0} role="button" className="flex items-center gap-2 text-white">
              <Icon name={menuConfig.explore.icon} className="h-4 w-4 text-white" />
              {t('nav.explore')}
            </div>
            <ul className="dropdown-content z-[1] ml-0 menu p-2 shadow bg-gray-800 rounded-box w-48">
              {menuConfig.explore.items.map((item) => renderMenuItem(item))}
            </ul>
          </li>

          {menuConfig.main.map((item) => (
            <li key={item.key}>
              <Link href={item.link} className="flex items-center gap-2 text-white">
                <Icon name={item.icon} className="h-4 w-4 text-white" />
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <div className="hidden lg:flex items-center gap-3">
          <ConnectButton />
          <LanguageSelector 
            isOpen={isLangMenuOpen}
            onToggle={() => setIsLangMenuOpen(!isLangMenuOpen)}
            onSelect={(lang) => {
              i18n.changeLanguage(lang);
              setIsLangMenuOpen(false);
              setIsMenuOpen(false);
              
              // 更新URL路径，替换语言代码部分
              const urlParts = pathname.split('/');
              const currentLang = urlParts[1];
              if (currentLang === 'en' || currentLang === 'zh' || currentLang === 'ko') {
                urlParts[1] = lang;
                const newPath = urlParts.join('/');
                window.history.pushState({}, '', newPath);
              } else {
                // 如果当前URL没有语言代码，则添加
                const newPath = `/${lang}${pathname}`;
                window.history.pushState({}, '', newPath);
              }
            }}
          />
        </div>
        
        <button 
          className="btn btn-ghost lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Icon name="menu" className="h-5 w-5 text-white" />
        </button>
      </div>

      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-[99999] bg-gray-900 flex flex-col w-full"
          style={{ 
            width: '100vw', 
            height: '100vh', 
            top: 0, 
            left: 0, 
            position: 'fixed',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between p-4 border-b border-gray-700">
            <img src="/img/hashfans.png" alt="HashFans" className="w-28 h-7" />
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-800"
            >
              <Icon name="close" className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="p-6 w-full">
            {/* Explore Section */}
            <div className="mb-8">
              <h3 className="text-white/60 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                <Icon name={menuConfig.explore.icon} className="w-4 h-4" />
                {t('nav.explore')}
              </h3>
              <div className="space-y-1">
                {menuConfig.explore.items.map((item) => {
                  if (item.type === 'divider') return null;
                  if (item.requireAuth && !address) return null;
                  
                  const link = item.requireAuth ? `${item.link}/${generateShareCode(address || '')}` : item.link;
                  
                  return (
                    <Link 
                      key={item.key}
                      href={link}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 p-3 text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Icon name={item.icon} className={`w-5 h-5 text-gray-400 ${item.iconClass || ''}`} />
                      <span>{t(item.key)}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Main Menu */}
            <div className="mb-8">
              <h3 className="text-white/60 text-sm uppercase tracking-wide mb-4">主菜单</h3>
              <div className="space-y-1">
                {menuConfig.main.map((item) => (
                  <Link 
                    key={item.key}
                    href={item.link}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 p-3 text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Icon name={item.icon} className="w-5 h-5 text-gray-400" />
                    <span>{t(item.key)}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700 bg-gray-900">
            <div className="space-y-4">
              <ConnectButton />
              
              {/* 移动端专用语言选择器 */}
              <div className="space-y-2">
                <div className="text-white/60 text-sm uppercase tracking-wide mb-2">语言 / Language</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: 'zh', name: '中文', flag: '🇨🇳' },
                    { code: 'en', name: 'English', flag: '🇺🇸' },
                    { code: 'ko', name: '한국어', flag: '🇰🇷' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setIsMenuOpen(false);
                        
                        // 更新URL路径
                        const urlParts = pathname.split('/');
                        const currentLang = urlParts[1];
                        if (currentLang === 'en' || currentLang === 'zh' || currentLang === 'ko') {
                          urlParts[1] = lang.code;
                          const newPath = urlParts.join('/');
                          window.history.pushState({}, '', newPath);
                        } else {
                          const newPath = `/${lang.code}${pathname}`;
                          window.history.pushState({}, '', newPath);
                        }
                      }}
                      className={`p-3 rounded-lg text-center transition-colors border ${
                        i18n.language === lang.code 
                          ? 'bg-blue-600 border-blue-500 text-white' 
                          : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="text-lg mb-1">{lang.flag}</div>
                      <div className="text-xs">{lang.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 