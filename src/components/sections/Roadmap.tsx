"use client"

import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef, TouchEvent } from "react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Icon } from "../common/Icon";
import { EventItem } from "@/types";
import Link from "next/link";
import { eventData } from "@/data/eventData";

export const Roadmap = () => {
  const { i18n, t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [roadmapItems, setRoadmapItems] = useState<EventItem[]>([]);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const language = i18n.language as keyof typeof eventData;
    const currentEventData = eventData[language] || eventData.zh;
    const sortedItems = [...currentEventData].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
    setRoadmapItems(sortedItems);

    const handleResize = () => {
      setItemsPerView(window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3);
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

  const renderEventCard = (event: EventItem) => (
    <Card className="h-[380px] flex flex-col overflow-hidden w-full">
      {/* 固定大小的图片容器 */}
      <div className="h-[160px] overflow-hidden relative">
        {/* 图片渐变覆盖 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#081020] via-[#081020]/60 to-transparent opacity-70 z-10"></div>
        
        {/* 图片 */}
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* 科技网格覆盖 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 mix-blend-overlay z-20"></div>
        
        {/* 标题覆盖在图片上 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] truncate">
            {event.title}
          </h3>
        </div>
      </div>
      
      {/* 内容区域 - 固定高度 */}
      <div className="p-4 pb-5 flex-grow flex flex-col h-[220px]">
        {/* 装饰线 */}
        <div className="w-12 h-0.5 bg-blue-500/50 mb-3"></div>
        
        {/* 内容 - 添加省略号 */}
        <div className="flex-grow overflow-hidden">
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
            {event.content}
          </p>
        </div>
        
        {/* 按钮区域 - 确保在底部 */}
        <div className="mt-auto pt-4">
          {event.buttons?.length ? (
            <div className="flex">
              {event.buttons.map((button, index) => (
                <Link 
                  key={index}
                  href={button.link} 
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a56db] to-[#1e40af] hover:from-[#1e40af] hover:to-[#1a56db] text-white font-medium px-4 py-2.5 rounded-md transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                >
                  <span className="truncate">{button.text}</span>
                  <Icon name="chevronRight" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex">
              <span className="w-full inline-flex items-center justify-center bg-gray-800/80 text-gray-400 px-4 py-2.5 rounded-md border border-gray-700/50">
                {t('events.comingSoon')}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.7)] tracking-wide">
          {t('events.title')}
        </h2>
        
        <div className="relative">
          {roadmapItems.length > itemsPerView && (
            <>
              <Button
                variant="secondary"
                className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 z-30 rounded-full p-2 bg-gray-900/80 border border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800/90"
                onClick={prevSlide}
              >
                <Icon name="chevronLeft" className="w-5 h-5" />
              </Button>
              <Button
                variant="secondary"
                className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 z-30 rounded-full p-2 bg-gray-900/80 border border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800/90"
                onClick={nextSlide}
              >
                <Icon name="chevronRight" className="w-5 h-5" />
              </Button>
            </>
          )}
          
          <div className="overflow-hidden rounded-xl">
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
                  className={`flex-none w-full md:w-1/2 lg:w-1/3 p-3`}
                  style={{ height: '400px', maxWidth: '392px', margin: '0 auto' }}
                >
                  {renderEventCard(item)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 