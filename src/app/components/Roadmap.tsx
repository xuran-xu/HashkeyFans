/* eslint-disable @next/next/no-img-element */
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef, TouchEvent } from "react";
import Link from 'next/link';
import { eventData, EventItem } from "@/app/data/eventData";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const roadmapContent = {
  zh: {
    title: "活动",
    applyButton: "申请参加",
    stayTuned: "敬请期待",
    eventEnded: "活动已结束"
  },
  en: {
    title: "Events",
    applyButton: "Apply Now",
    stayTuned: "Stay Tuned",
    eventEnded: "Event Ended"
  }
};

export default function Roadmap() {
  const { i18n } = useTranslation();
  const [content, setContent] = useState(roadmapContent.zh);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [roadmapItems, setRoadmapItems] = useState<EventItem[]>([]);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const language = i18n.language as keyof typeof roadmapContent;
    setContent(roadmapContent[language] || roadmapContent.zh);
    
    const currentEventData = eventData[language] || eventData.zh;
    const sortedItems = [...currentEventData].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
    setRoadmapItems(sortedItems);

    // 根据屏幕宽度设置每页显示数量
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [i18n.language]);

  const nextSlide = () => {
    setCurrentIndex(current => 
      current + itemsPerView >= roadmapItems.length ? 0 : current + itemsPerView
    );
  };

  const prevSlide = () => {
    setCurrentIndex(current => 
      current - itemsPerView < 0 ? Math.max(0, roadmapItems.length - itemsPerView) : current - itemsPerView
    );
  };

  const renderEventCard = (item: EventItem) => (
    <div className="w-full px-2">
      <div className="bg-gradient-to-br from-[#1a237e]/95 via-[#311b92]/90 to-[#4a148c]/85 backdrop-blur-sm rounded-lg shadow-lg p-6 h-[420px] flex flex-col">
        <div className="h-48 overflow-hidden rounded-lg mb-4">
          <img 
            src={item.image} 
            alt={item.theme || item.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">
          {item.theme || item.title}
        </h3>
        <p className="text-gray-300 text-sm mb-4 flex-grow line-clamp-3">
          {item.content}
        </p>
        <div className="mt-auto">
          {item.buttons && item.buttons[0]?.link ? (
            <Link 
              href={item.buttons[0].link}
              className="block w-full text-center py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
            >
              {new Date(item.endDate) < new Date() ? content.eventEnded : content.applyButton}
            </Link>
          ) : (
            <div className="block w-full text-center py-2 bg-white/10 text-white/60 rounded-lg cursor-not-allowed">
              {content.stayTuned}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // 计算总页数
  const totalPages = Math.ceil(roadmapItems.length / itemsPerView);
  const currentPage = Math.floor(currentIndex / itemsPerView);

  // 触摸事件处理
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // 直接跳转到指定页面
  const goToPage = (page: number) => {
    setCurrentIndex(page * itemsPerView);
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.7)] tracking-wide">
          {content.title}
        </h2>
        
        <div className="relative">
          {/* 导航按钮 */}
          {roadmapItems.length > itemsPerView && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-all duration-300"
              >
                <IoChevronBackOutline className="w-6 h-6" />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-all duration-300"
              >
                <IoChevronForwardOutline className="w-6 h-6" />
              </button>
            </>
          )}
          
          {/* 轮播内容 */}
          <div className="overflow-hidden">
            <div 
              ref={slideRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {roadmapItems.map((item, index) => (
                <div 
                  key={index}
                  className={`flex-none w-full md:w-1/2 lg:w-1/3`}
                >
                  {renderEventCard(item)}
                </div>
              ))}
            </div>
          </div>

          {/* 底部指示点 */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentPage === index 
                      ? 'bg-white scale-125' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
