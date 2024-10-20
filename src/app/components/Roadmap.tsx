/* eslint-disable @next/next/no-img-element */
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import Link from 'next/link';
import { eventData, EventItem } from "@/app/data/eventData";

const roadmapContent = {
  zh: {
    title: "路线图",
    futureEvent: "未来活动",
    futureContent: "更多精彩活动即将揭晓，敬请期待！",
    futureTheme: "未来展望"
  },
  en: {
    title: "Roadmap",
    futureEvent: "Future Event",
    futureContent: "More exciting events coming soon, stay tuned!",
    futureTheme: "Future Outlook"
  }
};

export default function Roadmap() {
  const { i18n } = useTranslation();
  const [content, setContent] = useState(roadmapContent.zh);
  const [roadmapItems, setRoadmapItems] = useState<EventItem[]>([]);
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const language = i18n.language as keyof typeof roadmapContent;
    setContent(roadmapContent[language] || roadmapContent.zh);

    const currentEventData = eventData[language] || eventData.zh;
    
    const sortedItems = [...currentEventData].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    const defaultItem: EventItem = {
      type: 'future',
      startDate: "",
      image: "/img/pending.png",
      title: content.futureEvent,
      content: content.futureContent,
      theme: content.futureTheme,
      endDate: "",
      buttons: []
    };

    const fullItems = [
      ...sortedItems,
      ...Array(Math.max(0, 5 - sortedItems.length)).fill(defaultItem)
    ].slice(0, 5);

    setRoadmapItems(fullItems);
    setVisibleItems(new Array(fullItems.length).fill(false));
  }, [i18n.language, content]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'));
          setVisibleItems(prev => {
            const newVisible = [...prev];
            newVisible[index] = true;
            return newVisible;
          });
        }
      });
    }, { threshold: 0.1 });

    const items = document.querySelectorAll('.roadmap-item');
    items.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, [roadmapItems]);

  useEffect(() => {
    if (timelineRef.current) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timelineRef.current?.classList.add('timeline-visible');
          }
        });
      }, { threshold: 0.1 });

      observer.observe(timelineRef.current);

      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className="py-12 bg-gradient-to-b bg-white/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center font-mono text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.7)] tracking-wide">
          {content.title}
        </h2>
        <div className="relative">
          {/* 时间轴 */}
          <div ref={timelineRef} className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/30 timeline-animation"></div>
          
          {roadmapItems.map((item, index) => (
            <div key={index} className={`roadmap-item w-full justify-between flex flex-col md:flex-row items-start md:items-center mb-10 transition-all duration-1000 ease-in-out ${visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} data-index={index}>
              {/* 时间点 */}
              <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-black z-10"></div>
              
              {/* 日期部分 */}
              <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:order-last md:pl-8'}`}>
                <div className="text-lg md:text-xl font-bold text-white mb-2 md:mb-0">{item.startDate}</div>
              </div>
              
              {/* 卡片部分 */}
              <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'}`}>
                <div className="bg-white p-3 md:p-4 rounded-lg shadow-md group relative overflow-hidden transition-all duration-700 hover:shadow-lg">
                  <span className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 opacity-0 group-hover:opacity-80 transition-all duration-1000 ease-in-out transform scale-105 group-hover:scale-100"></span>
                  <div className="relative z-10">
                    <img src={item.image} alt={item.theme || item.title} width={200} height={150} className="w-full h-24 md:h-32 object-cover mb-2 md:mb-3 rounded transition-all duration-700 group-hover:opacity-90" />
                    <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 bg-gradient-to-b from-black via-gray-600 to-gray-400 bg-clip-text text-transparent group-hover:text-white transition-all duration-700">{item.theme || item.title}</h3>
                    <p className="bg-gradient-to-b from-gray-700 to-gray-400 bg-clip-text text-transparent mb-2 md:mb-3 text-xs md:text-sm line-clamp-3 group-hover:text-white transition-all duration-700">{item.content}</p>
                    {item.buttons && item.buttons.length > 0 && item.buttons[0].link && (
                      <Link href={item.buttons[0].link} className="inline-block mt-1 md:mt-2 px-3 md:px-4 py-1 md:py-2 bg-white text-black font-semibold text-xs md:text-sm rounded-lg overflow-hidden group relative shadow-md hover:shadow-lg transition-all duration-300">
                        <span className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 opacity-0 group-hover:opacity-80 transition-all duration-1000 ease-in-out transform scale-105 group-hover:scale-100"></span>
                        <span className="relative z-10 group-hover:text-white transition-colors duration-700">
                          {item.buttons[0].text}
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
