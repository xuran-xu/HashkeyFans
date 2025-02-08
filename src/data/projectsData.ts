export interface ProjectButton {
  text: string;
  link?: string;
  action?: string; // 用于自定义JS方法的标识符
}

export interface ProjectSocial {
  platform: 'x' | 'discord' | 'telegram';
  link: string;
}

export type ProjectTag = 'infrastructure' | 'bridge' | 'wallet' | 'RWA' | 'defi' | 'oracle' | 'gaming' | 'DeFi' | 'Dex' | 'social' | 'explorer' | 'depin' | 'nft' | 'launchpad' ;

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
  },
  social: {
    name: { en: 'Social', zh: '社交' },
    color: 'bg-red-100 text-red-800'
  },
  explorer: {
    name: { en: 'Explorer', zh: '浏览器' },
    color: 'bg-gray-100 text-gray-800'
  },
  depin: {
    name: { en: 'DePIN', zh: '去中心化物理基础设施' },
    color: 'bg-violet-100 text-violet-800'
  },
  nft: {
    name: { en: 'NFT', zh: '非同质化代币' },
    color: 'bg-pink-100 text-pink-800'
  },
  launchpad: {
    name: { en: 'Launchpad', zh: '发射台' },
    color: 'bg-amber-100 text-amber-800'
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
    id: 'ParticleNetwork',
    name: 'Particle Network',
    logo: '/img/particlenetwork.png',
    imgClassName: 'h-8 w-auto rounded-full',
    link: 'https://particle.network/',
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
        link: 'https://x.com/ParticleNtwrk'
        }
    ]
  },
  {
    id: 'Asteroid_X',
    name: 'Asteroid_X',
    logo: '/img/asteroidx.webp',
    isVerified: true,
    imgClassName: 'h-8 w-8 rounded-full',
    link: 'https://asteroidx.io',
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
    id: 'TardeOS',
    name: 'TardeOS',
    logo: '/img/tradeos.jpg',
    imgClassName: 'h-8 w-8 rounded-full',
    link: 'https://www.tradeos.xyz/',
    tags: ['social'],
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
        link: 'https://tr.ee/P8xDXwaJqF'
      },
      {
        platform: 'telegram',
        link: 'https://tr.ee/MpRhF-LYpG'
      },
    ]
  },
  {
    id: 'Tarta Games(Spot Zero)',
    name: 'Tarta Games(Spot Zero)',
    logo: '/img/spotzero.jpeg',
    imgClassName: 'h-8 w-8 rounded-full',
    link: 'https://spotzero.tartagames.com/',
    tags: ['gaming'],
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
        link: 'https://x.com/SpotZero_Game'
      },
      {
        platform: 'telegram',
        link: 'https://t.me/SpotZeroOfficial'
      },
      {
        platform: 'discord',
        link: 'https://discord.com/invite/spotzero'
      },
    ]
  },
  {
    id: 'Huskey',
    name: 'Huskey',
    logo: '/img/huskey.svg',
    imgClassName: 'h-8 w-16',
    link: 'https://huskeyfi.com/swap?chain=hashkey-mainnet',
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
        link: 'https://x.com/HuskeyFi'
      },
      {
        platform: 'telegram',
        link: 'https://t.me/HuskeyFi'
      },
      {
        platform: 'discord',
        link: 'https://discord.com/invite/HfEcJAFu' 
      }
    ]
  },
  {
    id: 'izumi',
    name: 'iZumi',
    logo: '/img/izumi.png',
    imgClassName: 'h-8 w-8 rounded-full',
    link: 'https://izumi.finance/trade/swap',
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
  {
    id: 'Blockscout',
    name: 'Blockscout',
    logo: '/img/Blockscout.jpg',
    isVerified: true,
    imgClassName: 'h-8 w-8 rounded-full',
    link: 'https://www.blockscout.com/',
    tags: ['infrastructure', 'explorer'],
    socials: [
      {
        platform: 'x',
        link: 'https://x.com/blockscoutcom'
      }
    ]
  },
  {
    id: 'OKLink',
    name: 'OKLink',
    logo: '/img/oklink.webp',
    isVerified: true,
    imgClassName: 'h-8 w-32',
    link: 'https://www.oklink.com/zh-hans/hashkey',
    tags: ['infrastructure', 'explorer'],
    socials: [
      {
        platform: 'x',
        link: 'https://x.com/OKLink'
      }
    ]
  },
  {
    id: 'CyberCharge',
    name: 'CyberCharge',
    logo: '/img/CyberCharge.jpg',
    isVerified: true,
    imgClassName: 'h-8 w-8 rounded-full',
    link: 'https://cybercharge.org/',
    tags: ['depin'],
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
        link: 'https://x.com/CyberChargeWeb3'
      }
    ]
  },
  {
    id: 'Mint Club',
    name: 'Mint Club',
    logo: '/img/mintclub.jpg',
    isVerified: true,
    imgClassName: 'h-8 w-8 rounded-full',
    link: 'https://mint.club/',
    tags: ['launchpad'],
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
        link: 'https://x.com/MintClubPro'
      }
    ]
  },
  {
    id: 'Novabits',
    name: 'Novabits',
    logo: '/img/Novabits.png',
    isVerified: true,
    imgClassName: 'h-8 w-8 rounded-full',
    link: 'https://www.momo.fun/en-US/meme/pumping/',
    tags: ['launchpad'],
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
        link: 'https://x.com/MintClubPro'
      }
    ]
  },
  {
    id: 'Dmail',
    name: 'Dmail',
    logo: '/img/dmail.jpg',
    isVerified: true,
    imgClassName: 'h-8 w-8 rounded-full',
    link: 'https://dmail.ai/',
    tags: ['social'],
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
        link: 'https://x.com/dmailofficial'
      }
    ]
  },
]; 