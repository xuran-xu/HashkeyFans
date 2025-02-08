"use client"
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "../common/Icon";
import { LanguageSelector } from "../common/LanguageSelector";
import { MobileMenu } from "../common/MobileMenu";
import { ConnectButton, useAccount } from "@particle-network/connectkit";
import styled from 'styled-components';
import { generateShareCode } from "@/lib/utils";

export const Header = () => {
  const router = useRouter();
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

  if (!mounted) return null;

  const getLocalizedHref = (path: string) => `/${i18n.language}${path}`;

  const getCardLink = (address: string | undefined) => {
    if (!address) return '/';
    // 使用 generateShareCode 生成一致的 shareCode
    const shareCode = generateShareCode(address);
    return `/consensuscard/${shareCode}`;
  };

  return (
    <div className="navbar">
      <div className="navbar-start flex-1">
        <Link href="/" className="btn btn-ghost px-0">
          <img src="/img/hashfans.png" alt="HashFans" className="w-32 h-8" />
        </Link>

        <ul className="hidden lg:flex menu menu-horizontal ml-2">
          <li>
            <details className="dropdown">
              <summary className="flex items-center gap-2">
                <Icon name="compass" className="h-4 w-4" />
                {t('nav.activities')}
              </summary>
              <ul className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-48">
                <li>
                  <Link href="/events">
                    <Icon name="calendar" className="h-4 w-4" />
                    {t('nav.events')}
                  </Link>
                </li>
                <li>
                  <details>
                    <summary>
                      <Icon name="gift" className="h-4 w-4" />
                      {t('nav.consensus')}
                    </summary>
                    <ul>
                      <li>
                        <Link href="/rankings">
                          <Icon name="trophy" className="h-4 w-4" />
                          {t('nav.rankings')}
                        </Link>
                      </li>
                      {address && 
                      <li>
                        <Link href={`/consensuscard/${generateShareCode(address)}`}>
                          <Icon name="trophy" className="h-4 w-4" />
                          {t('nav.card')}
                        </Link>
                      </li>
                      }
                    </ul>
                  </details>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <Link href="/news" className="flex items-center gap-2">
              <Icon name="news" className="h-4 w-4" />
              {t('nav.news')}
            </Link>
          </li>
          <li>
            <Link href="/projects" className="flex items-center gap-2">
              <Icon name="grid" className="h-4 w-4" />
              {t('nav.projects')}
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <button 
          className="btn btn-ghost lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Icon name="menu" className="h-5 w-5" />
        </button>

        {address && (
          <Link href="/profile" className="btn btn-ghost btn-circle">
            <Icon name="user" className="h-5 w-5" />
          </Link>
        )}

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

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-base-100">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <img src="/img/hashfans.png" alt="HashFans" className="w-32 h-8" />
              <button 
                className="btn btn-ghost btn-circle"
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <ul className="menu">
              <li>
                <details>
                  <summary>
                    <Icon name="compass" className="h-4 w-4" />
                    {t('nav.activities')}
                  </summary>
                  <ul>
                    <li>
                      <Link href="/events" onClick={() => setIsMenuOpen(false)}>
                        <Icon name="calendar" className="h-4 w-4" />
                        {t('nav.events')}
                      </Link>
                    </li>
                    <li>
                      <details>
                        <summary>
                          <Icon name="gift" className="h-4 w-4" />
                          {t('nav.consensus')}
                        </summary>
                        <ul>
                          <li>
                            <Link href="/rankings" onClick={() => setIsMenuOpen(false)}>
                              <Icon name="trophy" className="h-4 w-4" />
                              {t('nav.rankings')}
                            </Link>
                          </li>
                        </ul>
                      </details>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <Link href="/news" onClick={() => setIsMenuOpen(false)}>
                  <Icon name="news" className="h-4 w-4" />
                  {t('nav.news')}
                </Link>
              </li>
              <li>
                <Link href="/projects" onClick={() => setIsMenuOpen(false)}>
                  <Icon name="grid" className="h-4 w-4" />
                  {t('nav.projects')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}; 