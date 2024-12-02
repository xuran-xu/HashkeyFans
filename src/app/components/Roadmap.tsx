/* eslint-disable @next/next/no-img-element */
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import Link from 'next/link';
import { eventData, EventItem } from "@/app/data/eventData";

const roadmapContent = {
  zh: {
    title: "路线图",
    applyButton: "申请参加",
    stayTuned: "敬请期待"
  },
  en: {
    title: "Roadmap",
    applyButton: "Apply Now",
    stayTuned: "Stay Tuned"
  }
};

export default function Roadmap() {
  const { i18n } = useTranslation();
  const [content, setContent] = useState(roadmapContent.zh);
  const [roadmapItems, setRoadmapItems] = useState<EventItem[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      title: "敬请期待",
      content: "",
      theme: "future",
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
        <div className="flex flex-wrap justify-center gap-4">
          {roadmapItems.map((item, index) => (
            <div key={index} className="w-full md:w-[380px] h-[420px]">
              <div className="bg-white p-4 rounded-lg shadow-md group relative overflow-hidden transition-all duration-700 hover:shadow-lg h-full flex flex-col">
                <span className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 opacity-0 group-hover:opacity-80 transition-all duration-1000 ease-in-out transform scale-105 group-hover:scale-100"></span>
                <div className="relative z-10 flex flex-col flex-grow">
                  <div className="h-[200px] overflow-hidden mb-4">
                    <img 
                      src={item.image} 
                      alt={item.theme || item.title} 
                      className="w-full h-full object-cover object-center rounded transition-all duration-700 group-hover:opacity-90" 
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 bg-gradient-to-b from-black via-gray-600 to-gray-400 bg-clip-text text-transparent group-hover:text-white transition-all duration-700">
                    {item.theme || item.title}
                  </h3>
                  <p className="bg-gradient-to-b from-gray-700 to-gray-400 bg-clip-text text-transparent mb-4 text-sm line-clamp-3 group-hover:text-white transition-all duration-700 flex-grow">
                    {item.content}
                  </p>
                  <div className="mt-auto">
                    {item.buttons && item.buttons.length > 0 && item.buttons[0].link ? (
                      <Link 
                        href={item.buttons[0].link} 
                        className="inline-block w-full text-center py-2 bg-white text-black font-semibold text-sm rounded-lg overflow-hidden group/btn relative shadow-md group-hover:bg-black transition-all duration-300"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 opacity-0 group-hover:opacity-80 transition-all duration-1000 ease-in-out transform scale-105 group-hover:scale-100"></span>
                        <span className="relative z-10 group-hover:text-white transition-colors duration-700">
                          {content.applyButton}
                        </span>
                      </Link>
                    ) : (
                      <div className="inline-block w-full text-center py-2 bg-gray-100 text-gray-500 font-semibold text-sm rounded-lg cursor-not-allowed">
                        {content.stayTuned}
                      </div>
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
