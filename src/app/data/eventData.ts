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

export const eventData: Record<string, EventItem[]> = {
  zh: [
    {
      type: 'event',
      startDate: "2024-12-12",
      endDate: "2024-12-20",
      image: "/img/hacker1.png",
      title: "太初 Hackerhouse - 香港",
      content: "加入我们的香港Hackerhouse, 一起探索Web3!",
      link: "/events",
      buttons: [
        {
          text: "申请参加",
          link: "/"
        },
        {
          text: "查看详情",
          link: "https://opaque-mistake-40f.notion.site/HashKey-Hackerhouse-Bali-704f5f2f04b34f3583e1392ae5de82ab?pvs=74"
        }
      ]
    },
  ],
  en: [
    {
      type: 'event',
      startDate: "2024-12-12",
      endDate: "2024-12-20",
      image: "/img/hacker1.png",
      title: "Taichu Hackerhouse - HongKong",
      content: "Join us in HongKong for a cutting-edge blockchain hacker house!",
      link: "/events/bali-2024",
      buttons: [
        {
          text: "Apply Now",
          link: "/"
        },
        {
          text: "Learn More",
          link: "https://opaque-mistake-40f.notion.site/HashKey-Hackerhouse-Bali-Taichu-125e2f6b83c88019aed6c092f3ed796b?pvs=4"
        }
      ]
    },
  ]
};
