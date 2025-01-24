export interface EventItem {
  type: 'event' | 'roadmap' | 'future';
  startDate: string;
  endDate: string;
  image: string;
  title: string;
  content: string;
  link?: string;
  theme?: string;
  buttons?: {
    text: string;
    link: string;
  }[];
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  image: string;
  slug: string;
  summary?: string;
}

export type ProjectTag = 'infrastructure' | 'bridge' | 'wallet' | 'RWA' | 'defi' | 'oracle' | 'gaming' | 'DeFi' | 'Dex';

export interface ProjectSocial {
  platform: 'x' | 'discord' | 'telegram';
  link: string;
}

export interface ProjectButton {
  text: string;
  link?: string;
  action?: string;
}

export interface Project {
  id: string;
  name: string;
  logo: string;
  imgClassName?: string;
  link: string;
  tags: ProjectTag[];
  isVerified?: boolean;
  contractAddress?: string;
  description?: {
    en: string;
    zh: string;
  };
  pointsBonus?: {
    type: 'interaction' | 'bonus' | 'reward';
    hasExtraPoints?: boolean;
    description: {
      en: string;
      zh: string;
    };
  };
  socials?: ProjectSocial[];
  buttons?: ProjectButton[];
}

export interface Partner {
  name: string;
  image: string;
  link: string;
  width: number;
  height: number;
}

// ... 其他类型定义 