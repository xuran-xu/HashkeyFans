import { useTranslation } from "react-i18next";
import Image from 'next/image';
import Link from 'next/link';

interface RoadmapItem {
  date: string;
  theme: string;
  content: string;
  image: string;
  button?: {
    text: string;
    link: string;
  };
}

const roadmapData: Record<string, RoadmapItem[]> = {
  zh: [
    { 
      date: "2024 Q4", 
      theme: "PayFi-Infrastructure", 
      content: "建立一个专注于支付和金融基础设施创新的House，促进技术交流与创新项目的孵化",
      image: "/img/hacker1.png",
      button: {
        text: "查看详情",
        link: "/q1-details"
      }
    }
  ],
  en: [
    { 
      date: "2024 Q4", 
      theme: "Pay-Fi Infra", 
      content: "Establish a hacker house focused on payment and financial infrastructure innovation, fostering technological exchange and incubation of innovative projects.",
      image: "/img/hacker1.png",
      button: {
        text: "View Details",
        link: "/q1-details"
      }
    }
  ]
};

const futureData: Record<string, RoadmapItem> = {
  zh: {
    date: "",
    theme: "Hackthon & Hackerhouse",
    content: "更多激动人心的Hackthon & Hackerhouse主题即将揭晓，请持续关注我们的动态！",
    image: "/img/pending.png"
  },
  en: {
    date: "",
    theme: "Hackthon & Hackerhouse",
    content: "Stay tuned for more exciting hacker house themes coming soon - the best is yet to come!",
    image: "/img/pending.png"
  }
};

export default function Roadmap() {
  const { t, i18n } = useTranslation();
  const language = i18n.language as keyof typeof roadmapData;
  const currentRoadmapData = roadmapData[language] || roadmapData.zh;
  const currentFutureData = futureData[language] || futureData.zh;

  // 填充数据到5个项目
  const fullRoadmapData = [
    ...currentRoadmapData,
    ...Array(5 - currentRoadmapData.length).fill(currentFutureData)
  ];

  return (
    <div className="py-12 bg-gradient-to-b bg-white/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center font-mono text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.7)] tracking-wide">
          {t("Roadmap")}
        </h2>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 h-full w-0.5 bg-gradient-to-b from-white to-black"></div>
          {fullRoadmapData.map((item, index) => (
            <div key={index} className={`flex flex-col md:flex-row items-start md:items-center mb-10 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 md:w-6 md:h-6 bg-white rounded-full border-2 md:border-3 border-black z-10"></div>
              <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pl-6' : 'md:pr-6'}`}>
                <div className="text-lg md:text-xl font-bold text-white mb-2">{item.date}</div>
                <div className="bg-white p-3 md:p-4 rounded-lg shadow-md group relative overflow-hidden transition-all duration-700 hover:shadow-lg">
                  <span className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 opacity-0 group-hover:opacity-80 transition-all duration-1000 ease-in-out transform scale-105 group-hover:scale-100"></span>
                  <div className="relative z-10">
                    <Image src={item.image} alt={item.theme} width={200} height={150} className="w-full h-24 md:h-32 object-cover mb-2 md:mb-3 rounded transition-all duration-700 group-hover:opacity-90" />
                    <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 bg-gradient-to-b from-black via-gray-600 to-gray-400 bg-clip-text text-transparent group-hover:text-white transition-all duration-700">{item.theme}</h3>
                    <p className="bg-gradient-to-b from-gray-700 to-gray-400 bg-clip-text text-transparent mb-2 md:mb-3 text-xs md:text-sm line-clamp-3 group-hover:text-white transition-all duration-700">{item.content}</p>
                    {item.button && (
                      <Link href={item.button.link} className="inline-block mt-1 md:mt-2 px-3 md:px-4 py-1 md:py-2 bg-white text-black font-semibold text-xs md:text-sm rounded-lg overflow-hidden group relative shadow-md hover:shadow-lg transition-all duration-300">
                        <span className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 opacity-0 group-hover:opacity-80 transition-all duration-1000 ease-in-out transform scale-105 group-hover:scale-100"></span>
                        <span className="relative z-10 group-hover:text-white transition-colors duration-700">
                          {item.button.text}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
