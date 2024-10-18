export interface EventItem {
  type: 'event' | 'roadmap' | 'future';
  startDate: string;
  endDate: string;
  image: string;
  title: string;
  content: string;
  link?: string;
  theme?: string;
  button: {
    text: string;
    link: string;
  };
}

export const eventData: Record<string, EventItem[]> = {
  zh: [
    {
      type: 'event',
      startDate: "2024-12-12",
      endDate: "2024-12-20",
      image: "/img/hacker1.png",
      title: "太初 Hackerhouse - 巴厘岛",
      content: "加入我们的巴厘岛黑客屋,探索区块链技术的前沿!",
      link: "/events/bali-2024",
      button: {
        text: "申请参加",
        link: "/apply/bali-2024"
      }
    }
  ],
  en: [
    {
      type: 'event',
      startDate: "2024-12-12",
      endDate: "2024-12-20",
      image: "/img/hacker1.png",
      title: "Taichu Hackerhouse - Bali",
      content: "Join us in Bali for a cutting-edge blockchain hacker house!",
      link: "/events/bali-2024",
      button: {
        text: "Apply Now",
        link: "/apply/bali-2024"
      }
    }
  ]
};
