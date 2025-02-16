import { MenuConfig } from '@/types/menu';

export const menuConfig: MenuConfig = {
  explore: {
    icon: 'compass',
    items: [
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
      {
        icon: 'gift',
        key: 'nav.redpacket',
        link: '/redpacket',
        iconClass: 'text-red-500'
      },
      {
        icon: 'trophy',
        key: 'nav.rankings',
        link: '/rankings'
      },
      {
        icon: 'trophy',
        key: 'nav.card',
        link: '/consensuscard',
        requireAuth: true
      }
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