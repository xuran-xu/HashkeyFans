export interface NewsItem {
  id: string;
  title: string;
  date: string;
  image: string;
  slug: string;
  summary?: string;
}

export const newsData: Record<string, NewsItem[]> = {
  en: [
    {
      id: '1',
      title: 'HashKey Chain Now Supports OKX Web3 Wallet Integration',
      date: '2025-01-20',
      image: '/img/okxweb3xhashkey.jpg',
      slug: 'okx-web3-x-hashkey',
      summary: 'Join us for the grand launch of Taichu Hackerhouse...'
    },
  ],
  zh: [
    {
      id: '1',
      title: 'HashKey Chain现已支持 OKX Web3钱包交互',
      date: '2025-01-20',
      image: '/img/okxweb3xhashkey.jpg',
      slug: 'okx-web3-x-hashkey',
      summary: 'HashKey Chain宣布支持OKX Web3钱包，用户现可通过OKX Web3钱包与HashKey Chain便捷交互。'
    },
  ],
}; 