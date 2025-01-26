import { useTranslation } from "react-i18next";
import { NavLink } from './NavLink';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SocialLinks } from './SocialLinks';

interface MobileMenuProps {
  onClose: () => void;
}

export const MobileMenu = ({ onClose }: MobileMenuProps) => {
  const { t } = useTranslation();
  
  return (
    <div onClick={onClose} className="md:hidden mt-4 space-y-2 p-2 bg-gradient-to-br from-[#1a237e]/95 via-[#311b92]/90 to-[#4a148c]/85 rounded-lg">
      <NavLink href="/events" icon="calendar" text={t('nav.events')} />
      <NavLink href="/news" icon="news" text={t('nav.news')} />
      <NavLink href="/projects" icon="grid" text={t('nav.projects')} />
      <div className="border-t border-white/10 my-2"></div>
      <div className="flex justify-center">
        <ConnectButton />
      </div>
      <div className="flex justify-around py-2">
        <SocialLinks />
      </div>
    </div>
  );
}; 