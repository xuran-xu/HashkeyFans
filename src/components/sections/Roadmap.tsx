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
    <Card className="h-[420px] flex flex-col p-6">
      <div className="h-48 overflow-hidden rounded-lg mb-4">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">
        {event.title}
      </h3>
      <p className="text-gray-300 text-sm mb-4 flex-grow line-clamp-3">
        {event.content}
      </p>
      <div className="mt-auto">
        {event.buttons?.map((button, index) => (
          <Button key={index} variant="secondary" className="w-full">
            <Link href={button.link}>{button.text}</Link>
          </Button>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.7)] tracking-wide">
          {t('events.title')}
        </h2>
        
        <div className="relative">
          {roadmapItems.length > itemsPerView && (
            <>
              <Button
                variant="secondary"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full"
                onClick={prevSlide}
              >
                <Icon name="chevronLeft" />
              </Button>
              <Button
                variant="secondary"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full"
                onClick={nextSlide}
              >
                <Icon name="chevronRight" />
              </Button>
            </>
          )}
          
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
                  className={`flex-none w-full md:w-1/2 lg:w-1/3 px-2`}
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