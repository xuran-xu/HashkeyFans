import { IconName } from '@/components/common/Icon';

interface MenuItem {
  icon: IconName;
  key: string;
  link: string;
  iconClass?: string;
  requireAuth?: boolean;
  type?: 'divider';
}

export interface MenuConfig {
  explore: {
    icon: IconName;
    items: MenuItem[];
  };
  main: MenuItem[];
} 