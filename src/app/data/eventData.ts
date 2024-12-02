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
      startDate: "2024-12-20",
      endDate: "2024-12-22",
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
          link: "https://wooded-tortoise-0a3.notion.site/HashKey-Hackerhouse-1264635d81288097a856ffd67bcb81d1"
        }
      ]
    },
  ],
  en: [
    {
      type: 'event',
      startDate: "2024-12-20",
      endDate: "2024-12-22",
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
          link: "https://wooded-tortoise-0a3.notion.site/HashKey-Hackerhouse-Taichu-1264635d8128800aaafdd5493b9296d1"
        }
      ]
    },
  ]
};
