import React from 'react';
import { 
  FaTelegram, 
  FaDiscord, 
  FaGithub, 
  FaMedium, 
  FaSquareXTwitter, 
  FaEthereum, 
  FaBitcoin, 
  FaGlobe, 
  FaLocationDot,
  FaWallet
} from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  IoNewspaperOutline,
  IoGridOutline,
  IoCalendarOutline,
  IoLanguageOutline,
  IoMenuOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCompassOutline,
  IoChevronUpOutline,
  IoChevronDownOutline,
  IoGiftOutline,
  IoAddOutline,
  IoTimeOutline,
  IoSearchOutline,
  IoCheckmarkOutline,
  IoPersonOutline,
  IoCloseOutline,
  IoCopyOutline,
  IoTrophyOutline,
  IoCameraOutline,
  IoCodeOutline
} from "react-icons/io5";
import { SiSolana } from "react-icons/si";

export const icons = {
  telegram: FaTelegram,
  discord: FaDiscord,
  twitter: FaSquareXTwitter,
  github: FaGithub,
  medium: FaMedium,
  ethereum: FaEthereum,
  solana: SiSolana,
  bitcoin: FaBitcoin,
  globe: FaGlobe,
  location: FaLocationDot,
  news: IoNewspaperOutline,
  grid: IoGridOutline,
  calendar: IoCalendarOutline,
  language: IoLanguageOutline,
  menu: IoMenuOutline,
  chevronLeft: IoChevronBackOutline,
  chevronRight: IoChevronForwardOutline,
  compass: IoCompassOutline,
  "chevron-up": IoChevronUpOutline,
  "chevron-down": IoChevronDownOutline,
  gift: IoGiftOutline,
  plus: IoAddOutline,
  history: IoTimeOutline,
  search: IoSearchOutline,
  check: IoCheckmarkOutline,
  user: IoPersonOutline,
  close: IoCloseOutline,
  copy: IoCopyOutline,
  trophy: IoTrophyOutline,
  camera: IoCameraOutline,
  code: IoCodeOutline,
  wallet: FaWallet,
  externalLink: FaExternalLinkAlt,
  x: IoCloseOutline
} as const;

export type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  className?: string;
}

export const Icon = ({ name, className = "w-5 h-5" }: IconProps) => {
  const IconComponent = icons[name];
  return <IconComponent className={`${className}`} />;
}; 