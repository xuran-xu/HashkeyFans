"use client"
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../common/Button";
import { Icon } from "../common/Icon";
import { NavLink } from "../common/NavLink";
import { SocialLinks } from "../common/SocialLinks";
import { LanguageSelector } from "../common/LanguageSelector";
import { MobileMenu } from "../common/MobileMenu";

const languages = [
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "en", name: "English", flag: "🇺🇸" },
];

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const urlLang = pathname.split('/')[1];
    if (urlLang && (urlLang === 'en' || urlLang === 'zh') && urlLang !== i18n.language) {
      i18n.changeLanguage(urlLang);
    }
  }, [pathname]);

  if (!mounted) return null;

  const getLocalizedHref = (path: string) => `/${i18n.language}${path}`;

  return (
    <header className="relative z-50">
      <div className="container mx-auto md:px-4 md:py-3">
        {/* Logo and Navigation */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-6">
            <Link href={getLocalizedHref('/')} className="text-xl font-bold rounded-full">
              <img className="rounded-full" src="/img/logo.png" alt="Logo" width={32} height={32} />
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              {/* Navigation Links */}
              <NavLink href="/events" icon="calendar" text={t('nav.events')} />
              <NavLink href="/news" icon="news" text={t('nav.news')} />
              <NavLink href="/projects" icon="grid" text={t('nav.projects')} />
            </nav>
          </div>

          {/* Social Links & Language Selector */}
          <div className="hidden md:flex items-center space-x-6">
            <SocialLinks />
            <LanguageSelector 
              isOpen={isLangMenuOpen}
              onToggle={() => setIsLangMenuOpen(!isLangMenuOpen)}
              onSelect={(lang) => {
                const segments = pathname.split('/');
                segments[1] = lang;
                router.push(segments.join('/'));
                i18n.changeLanguage(lang);
                setIsLangMenuOpen(false);
              }}
            />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="secondary"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Menu</span>
            <Icon name="menu" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && <MobileMenu onClose={() => setIsMenuOpen(false)} />}
      </div>
    </header>
  );
}; 