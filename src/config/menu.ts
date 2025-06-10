import { MenuConfig } from '@/types/menu';

export const menuConfig: MenuConfig = {
  explore: {
    icon: 'compass',
    items: [
      {
        icon: 'wallet',
        key: 'nav.tokens',
        link: '/tokens'
      },
      {
        icon: 'news',
        key: 'nav.news',
        link: '/news'
      },
      {
        icon: 'calendar',
        key: 'nav.events',
        link: '/events'
      },
      // {
      //   icon: 'gift',
      //   key: 'nav.redpacket',
      //   link: '/redpacket',
      //   iconClass: 'text-red-500'
      // }
    ]
  },
  main: [
    {
      icon: 'grid',
      key: 'nav.projects',
      link: '/projects'
    }
  ]
}; 