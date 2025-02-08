import { useTranslation } from "react-i18next";
import Link from 'next/link';
import { ConnectButton } from "@particle-network/connectkit";
import { SocialLinks } from './SocialLinks';
import { Icon } from './Icon';

interface MobileMenuProps {
  onClose: () => void;
}

export const MobileMenu = ({ onClose }: MobileMenuProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="menu bg-base-200 w-full p-4 rounded-box">
      <li>
        <Link href="/events" onClick={onClose}>
          <Icon name="calendar" className="h-4 w-4" />
          {t('nav.events')}
        </Link>
      </li>
      <li>
        <Link href="/news" onClick={onClose}>
          <Icon name="news" className="h-4 w-4" />
          {t('nav.news')}
        </Link>
      </li>
      <li>
        <Link href="/rankings" onClick={onClose}>
          <Icon name="trophy" className="h-4 w-4" />
          {t('nav.rankings')}
        </Link>
      </li>
      <li>
        <Link href="/projects" onClick={onClose}>
          <Icon name="grid" className="h-4 w-4" />
          {t('nav.projects')}
        </Link>
      </li>
      <div className="divider"></div>
      <div className="flex justify-center">
        <ConnectButton />
      </div>
      <div className="flex justify-around py-2">
        <SocialLinks />
      </div>
    </div>
  );
}; 