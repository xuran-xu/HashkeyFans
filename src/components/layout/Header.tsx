"use client"
import { generateShareCode } from "@/lib/utils";
import { ConnectButton, useAccount } from "@particle-network/connectkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "../common/Icon";
import { LanguageSelector } from "../common/LanguageSelector";
import { menuConfig } from '@/config/menu';
import { formatAddress } from "@/utils/format";

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
    if (urlLang && (urlLang === 'en' || urlLang === 'zh') && urlLang !== i18n.language) {
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
  }, []);

  const renderMenuItem = (item: any) => {
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
        >
          <Icon name={item.icon} className={`h-4 w-4 ${item.iconClass || ''}`} />
          {t(item.key)}
        </Link>
      </li>
    );
  };

  if (!mounted) return null;

  return (
    <div className="navbar">
      <div className="navbar-start flex-1">
        <Link href="/" className="btn btn-ghost px-0">
          <img src="/img/hashfans.png" alt="HashFans" className="w-32 h-8" />
        </Link>

        <ul className="hidden lg:flex menu menu-horizontal ml-2">
          {/* Explore 菜单 */}
          <li className="dropdown dropdown-hover">
            <div tabIndex={0} role="button" className="flex items-center gap-2">
              <Icon name={menuConfig.explore.icon} className="h-4 w-4" />
              {t('nav.explore')}
            </div>
            <ul className="dropdown-content z-[1] ml-0 menu p-2 shadow bg-base-100 rounded-box w-48">
              {menuConfig.explore.items.map((item, index) => renderMenuItem(item))}
            </ul>
          </li>

          {menuConfig.main.map((item) => (
            <li key={item.key}>
              <Link href={item.link} className="flex items-center gap-2">
                <Icon name={item.icon} className="h-4 w-4" />
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <div className="hidden lg:flex items-center gap-3">
          {/* {address && (
            <div className="dropdown dropdown-end">
              <div 
                tabIndex={0} 
                role="button" 
                className="btn btn-ghost bg-white/5 hover:bg-white/10 text-white border-white/10 gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Icon name="user" className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/80">{formatAddress(address)}</span>
                <Icon name="x" className="h-4 w-4 text-white/60" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-2">
                <li>
                  <Link href="/profile" className="flex items-center gap-2">
                    <Icon name="user" className="h-4 w-4" />
                    {t('nav.profile')}
                  </Link>
                </li>
                <li>
                  <Link href={`/consensuscard/${generateShareCode(address)}`} className="flex items-center gap-2">
                    <Icon name="trophy" className="h-4 w-4" />
                    {t('nav.card')}
                  </Link>
                </li>
              </ul>
            </div>
          )} */}
          <ConnectButton />
          <LanguageSelector 
            isOpen={isLangMenuOpen}
            onToggle={() => setIsLangMenuOpen(!isLangMenuOpen)}
            onSelect={(lang) => {
              i18n.changeLanguage(lang);
              setIsLangMenuOpen(false);
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
          <div className="h-[100dvh] w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
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
              {/* 用户信息区域 */}
              {address && (
                <div 
                  className="mb-6 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    window.location.href = '/profile';
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Icon name="user" className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-white/60">Connected as</div>
                      <div className="text-white font-medium">{formatAddress(address)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 菜单列表 */}
              <div className="space-y-4">
                {/* Explore 菜单 */}
                <div className="collapse collapse-plus bg-base-200/10 rounded-xl">
                  <input type="checkbox" /> 
                  <div className="collapse-title text-white flex items-center gap-2">
                    <Icon name={menuConfig.explore.icon} className="h-5 w-5" />
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
                              className="text-white/80 hover:text-white"
                            >
                              <Icon name={item.icon} className={`h-4 w-4 ${item.iconClass || ''}`} />
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
                        className="flex items-center gap-2 text-white/80 hover:text-white rounded-xl bg-base-200/10"
                      >
                        <Icon name={item.icon} className="h-4 w-4" />
                        {t(item.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="divider my-8"></div>

              {/* 底部功能区 */}
              <div className="space-y-4">
                {address && (
                  <Link 
                    href="/profile" 
                    className="btn btn-block bg-white/5 hover:bg-white/10 text-white border-white/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon name="user" className="h-5 w-5" />
                    {t('nav.profile')}
                  </Link>
                )}
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