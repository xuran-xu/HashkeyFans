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
      image: "/img/taichu.jpg",
      title: "太初 Hackerhouse - 香港",
      content: "加入我们的香港Hackerhouse, 一起探索合规框架下的Web3发展!",
      link: "/events",
      buttons: [
        {
          text: "申请参加",
          link: "https://lu.ma/0q26h11p"
        },
        {
          text: "查看详情",
          link: "https://wooded-tortoise-0a3.notion.site/HashKey-Hackerhouse-1264635d81288097a856ffd67bcb81d1"
        }
      ]
    },
    {
      type: 'event',
      startDate: "TBD",
      endDate: "2024-12-22",
      image: "/img/taiyi.jpg",
      title: "太易",
      content: "Hackathon",
      link: "/events",
      buttons: [
      ]
    },
    {
      type: 'event',
      startDate: "TBD",
      endDate: "2024-12-22",
      image: "/img/taishi.jpg",
      title: "太始",
      content: "Hackerhouse",
      link: "/events",
      buttons: [
      ]
    },
    {
      type: 'event',
      startDate: "TBD",
      endDate: "2024-12-22",
      image: "/img/taisu.jpg",
      title: "太素",
      content: "Hackerhouse",
      link: "/events",
      buttons: [
      ]
    },
    {
      type: 'event',
      startDate: "TBD",
      endDate: "2024-12-22",
      image: "/img/taiji.jpg",
      title: "太极",
      content: "Hackathon",
      link: "/events",
      buttons: [
      ]
    },
  ],
  en: [
    {
      type: 'event',
      startDate: "2024-12-20",
      endDate: "2024-12-22",
      image: "/img/taichu.jpg",
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
    {
      type: 'event',
      startDate: "TBD",
      endDate: "2024-12-22",
      image: "/img/taiyi.jpg",
      title: "Taiyi",
      content: "Hackathon",
      link: "/events",
      buttons: [
      ]
    },
    {
      type: 'event',
      startDate: "TBD",
      endDate: "2024-12-22",
      image: "/img/taishi.jpg",
      title: "Taishi",
      content: "Hackerhouse",
      link: "/events",
      buttons: [
      ]
    },
    {
      type: 'event',
      startDate: "TBD",
      endDate: "2024-12-22",
      image: "/img/taisu.jpg",
      title: "Taisu",
      content: "Hackerhouse",
      link: "/events",
      buttons: [
      ]
    },
    {
      type: 'event',
      startDate: "TBD",
      endDate: "2024-12-22",
      image: "/img/taiji.jpg",
      title: "Taiji",
      content: "Hackathon",
      link: "/events",
      buttons: [
      ]
    },
  ]
};
