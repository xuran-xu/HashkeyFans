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
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="h-[100dvh] w-full bg-gray-900 flex flex-col" data-theme="dark">
            {/* 顶部导航栏 */}
            <div className="p-4 pt-safe border-b border-white/10">
              <div className="flex justify-between items-center">
                <img src="/img/hashfans.png" alt="HashFans" className="w-32 h-8" />
                <button 
                  className="btn btn-ghost btn-circle"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon name="close" className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* 主菜单内容 */}
            <div className="flex-1 overflow-y-auto p-4 pb-safe">
              {/* 菜单列表 */}
              <div className="space-y-4">
                {/* Explore 菜单 */}
                <div className="collapse collapse-plus bg-gray-800/80 rounded-xl">
                  <input type="checkbox" /> 
                  <div className="collapse-title text-white flex items-center gap-2">
                    <Icon name={menuConfig.explore.icon} className="h-5 w-5 text-white" />
                    {t('nav.explore')}
                  </div>
                  <div className="collapse-content">
                    <ul className="menu menu-md gap-1">
                      {menuConfig.explore.items.map((item) => {
                        if (item.type === 'divider') return <li key="divider" className="divider" />;
                        if (item.requireAuth && !address) return null;
                        
                        const link = item.requireAuth ? `${item.link}/${generateShareCode(address || '')}` : item.link;
                        
                        return (
                          <li key={item.key}>
                            <Link 
                              href={link}
                              onClick={() => setIsMenuOpen(false)}
                              className="text-white hover:text-white"
                            >
                              <Icon name={item.icon} className={`h-4 w-4 text-white ${item.iconClass || ''}`} />
                              {t(item.key)}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* 主菜单项 */}
                <ul className="menu menu-md gap-1 p-0">
                  {menuConfig.main.map((item) => (
                    <li key={item.key}>
                      <Link 
                        href={item.link}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 text-white hover:text-white rounded-xl bg-gray-800/50"
                      >
                        <Icon name={item.icon} className="h-4 w-4 text-white" />
                        {t(item.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="divider my-8"></div>

              {/* 底部功能区 */}
              <div className="space-y-4">
                <div className="flex justify-between items-center gap-4">
                <ConnectButton />
                  <LanguageSelector 
                    isOpen={isLangMenuOpen}
                    onToggle={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    onSelect={(lang) => {
                      i18n.changeLanguage(lang);
                      setIsLangMenuOpen(false);
                      setIsMenuOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 