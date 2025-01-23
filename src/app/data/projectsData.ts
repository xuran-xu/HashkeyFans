export interface ProjectButton {
  text: string;
  link?: string;
  action?: string; // 用于自定义JS方法的标识符
}

export interface ProjectSocial {
  platform: 'x' | 'discord' | 'telegram';
  link: string;
}

export type ProjectTag = 'infrastructure' | 'bridge' | 'wallet' | 'RWA' | 'defi' | 'oracle' | 'gaming' | 'DeFi' | 'Dex';

export interface Project {
  id: string;
  name: string;
  logo: string;
  imgClassName?: string;
  link: string;  // 项目链接
  tags: ProjectTag[];  // 多个标签
  isVerified?: boolean;  // 控制验证图标
  contractAddress?: string;  // 添加这个字段
  description?: {
    en: string;
    zh: string;
  };
  pointsBonus?: {
    type: 'interaction' | 'bonus' | 'reward';
    hasExtraPoints?: boolean;  // 控制闪电图标
    description: {
      en: string;
      zh: string;
    };
  };
  socials?: ProjectSocial[];
  buttons?: ProjectButton[];
}

type TagConfigType = {
  name: { en: string; zh: string };
  color: string;
};

export const tagConfig: Record<ProjectTag, TagConfigType> = {
  infrastructure: {
    name: { en: 'Infrastructure', zh: '基础设施' },
    color: 'bg-blue-100 text-blue-800'
  },
  wallet: {
    name: { en: 'Wallet', zh: '钱包' },
    color: 'bg-purple-100 text-purple-800'
  },
  defi: {
    name: { en: 'DeFi', zh: '去中心化金融' },
    color: 'bg-green-100 text-green-800'
  },
  DeFi: {
    name: { en: 'DeFi', zh: '去中心化金融' },
    color: 'bg-green-100 text-green-800'
  },
  Dex: {
    name: { en: 'DEX', zh: '去中心化交易所' },
    color: 'bg-indigo-100 text-indigo-800'
  },
  oracle: {
    name: { en: 'Oracle', zh: '预言机' },
    color: 'bg-yellow-100 text-yellow-800'
  },
  gaming: {
    name: { en: 'Gaming', zh: '游戏' },
    color: 'bg-pink-100 text-pink-800'
  },
  RWA: {
    name: { en: 'RWA', zh: '实物资产' },
    color: 'bg-orange-100 text-orange-800'
  },
  bridge: {
    name: { en: 'Bridge', zh: '跨链桥' },
    color: 'bg-teal-100 text-teal-800'
  }
};

export const projectsData: Project[] = [
  {
    id: 'okx',
    name: 'OKX Wallet',
    logo: '/img/okxwallet.webp',
    imgClassName: 'h-8 w-auto',
    link: 'https://www.okx.com/web3',
    tags: ['wallet', 'defi'],
    isVerified: true,
    pointsBonus: {
        type: 'interaction',
        hasExtraPoints: true,
        description: {
        en: 'Bonus for contract interactions',
        zh: '合约交互奖励'
        }
    },
    socials: [
        {
        platform: 'x',
        link: 'https://x.com/wallet'
        }
    ]
  },
  {
    id: 'SuperBridge',
    name: 'SuperBridge',
    logo: '/img/superbridge.jpeg',
    imgClassName: 'h-8 w-8 rounded-full',
    link: 'https://bridge.hsk.xyz/',
    tags: ['infrastructure', 'bridge'],
    isVerified: true,
    pointsBonus: {
        type: 'interaction',
        description: {
        en: 'Bonus for contract interactions',
        zh: '合约交互奖励'
        }
    },
    socials: [
      {
        platform: 'x',
        link: 'https://x.com/HashKeyHSK'
      }
    ]
  },
  {
    id: 'Orbiter',
    name: 'Orbiter Finance',
    logo: '/img/orbiter.png',
    isVerified: true,
    imgClassName: 'h-8 w-8 rounded-full',
    link: 'https://www.orbiter.finance/en?src_chain=177&tgt_chain=1&src_token=HSK',
    tags: ['infrastructure', 'bridge'],
    pointsBonus: {
        type: 'interaction',
        description: {
        en: 'Bonus for contract interactions',
        zh: '合约交互奖励'
        }
    },
    socials: [
      {
        platform: 'x',
        link: 'https://x.com/orbiter_finance'
      },
      {
        platform: 'discord',
        link: 'https://discord.com/invite/FbztTBvnBT'
      }
    ]
  },
  {
    id: 'Owlto',
    name: 'Owlto Finance',
    logo: '/img/owlto.png',
    isVerified: true,
    imgClassName: 'h-8 w-8 rounded-full',
    link: 'https://owlto.finance/',
    tags: ['infrastructure', 'bridge'],
    pointsBonus: {
        type: 'interaction',
        description: {
        en: 'Bonus for contract interactions',
        zh: '合约交互奖励'
        }
    },
    socials: [
      {
        platform: 'x',
        link: 'https://x.com/intent/follow?screen_name=Owlto_Finance'
      },
      {
        platform: 'discord',
        link: 'https://discord.com/invite/owlto'
      }
    ]
  },
  {
    id: 'index',
    name: 'HyperIndex',
    logo: '/img/index.jpg',
    imgClassName: 'h-8 w-8 rounded-full',
    link: 'https://hyperindex.trade',
    tags: ['DeFi', 'Dex'],
    isVerified: true,
    pointsBonus: {
        type: 'interaction',
        description: {
        en: 'Bonus for contract interactions',
        zh: '合约交互奖励'
        }
    },
    socials: [
      {
        platform: 'x',
        link: 'https://x.com/hyperindex_'
      }
    ]
  },
  {
    id: 'dodo',
    name: 'DODO',
    logo: '/img/dodo.jpg',
    imgClassName: 'h-8 w-8 rounded-full',
    isVerified: true,
    link: 'https://app.dodoex.io/swap/network/hashkey/177-HSK/177-WHSK',
    tags: ['DeFi', 'Dex'],
    pointsBonus: {
        type: 'interaction',
        description: {
        en: 'Bonus for contract interactions',
        zh: '合约交互奖励'
        }
    },
    socials: [
      {
        platform: 'x',
        link: 'https://x.com/BreederDodo'
      },
      {
        platform: 'discord',
        link: 'https://discord.com/invite/tyKReUK'
      },
      {
        platform: 'telegram',
        link: 'https://t.me/dodoex_official'
      }
    ]
  },
  {
    id: 'cellula',
    name: 'Cellula',
    logo: '/img/cellula.webp',
    imgClassName: 'h-8 w-8',
    isVerified: true,
    link: 'https://factory-hsk.cellula.life/welcome',
    tags: ['gaming'],
    pointsBonus: {
        type: 'interaction',
        description: {
        en: 'Bonus for contract interactions',
        zh: '合约交互奖励'
        }
    },
    socials: [
      {
        platform: 'x',
        link: 'https://x.com/cellulalifegame'
      },
      {
        platform: 'discord',
        link: 'https://discord.com/invite/cellula-official'
      },
      {
        platform: 'telegram',
        link: 'https://t.me/CellulaOfficial'
      }
    ]
  },
  {
    id: 'Asteroid_X',
    name: 'Asteroid_X',
    logo: '/img/asteroidx.webp',
    isVerified: true,
    imgClassName: 'h-8 w-8 rounded-full',
    link: 'https://asteroidx.io/e',
    tags: ['RWA'],
    pointsBonus: {
        type: 'interaction',
        description: {
        en: 'Bonus for contract interactions',
        zh: '合约交互奖励'
        }
    },
    socials: [
      {
        platform: 'x',
        link: 'https://x.com/Asteroid_AU'
      },
      {
        platform: 'discord',
        link: 'https://discord.com/invite/fCgtggqjhA'
      }
    ]
  },
  {
    id: 'DigiFT',
    name: 'DigiFT',
    logo: '/img/digift.svg',
    isVerified: true,
    imgClassName: 'h-8 w-16',
    link: 'https://www.digift.sg/',
    tags: ['DeFi', 'RWA'],
    pointsBonus: {
        type: 'interaction',
        description: {
        en: 'Bonus for contract interactions',
        zh: '合约交互奖励'
        }
    },
    socials: [
      {
        platform: 'x',
        link: 'https://x.com/DigiFTTech'
      },
      {
        platform: 'telegram',
        link: 'https://t.me/DigiFTTech'
      }
    ]
  },
  {
    id: 'supra',
    name: 'Supra',
    logo: 'https://supra.com/images/brand/SupraOracles-Red-Light-Horz.png',
    isVerified: true,
    imgClassName: 'h-8 w-24',
    link: 'https://supra.com',
    tags: ['infrastructure', 'oracle'],
    socials: [
      {
        platform: 'x',
        link: 'https://x.com/SUPRA_Labs'
      },
      {
        platform: 'discord',
        link: 'https://discord.com/invite/supralabs'
      }
    ]
  },
  {
    id: 'apro',
    name: 'APRO',
    logo: '/img/apro.png',
    isVerified: true,
    imgClassName: 'h-8 w-32',
    link: 'https://supra.com',
    tags: ['infrastructure', 'oracle'],
    socials: [
      {
        platform: 'x',
        link: 'https://x.com/SUPRA_Labs'
      },
      {
        platform: 'discord',
        link: 'https://discord.com/invite/supralabs'
      }
    ]
  },
]; 