/* eslint-disable @next/next/no-img-element */
"use client"

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { eventData, EventItem } from "@/app/data/eventData";

const eventListContent = {
  zh: {
    title: "活动列表",
    upcoming: "即将到来的活动",
    current: "正在进行的活动",
    past: "往期活动",
    loading: "加载中..."
  },
  en: {
    title: "Event List",
    upcoming: "Upcoming Events",
    current: "Current Events",
    past: "Past Events",
    loading: "Loading..."
  }
};

const SkeletonCard = () => (
  <div className="bg-gradient-to-br from-[#1a237e]/30 via-[#311b92]/25 to-[#4a148c]/20 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-white/10"></div>
    <div className="p-6">
      <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
      <div className="h-6 bg-white/10 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-white/10 rounded w-full mb-4"></div>
      <div className="h-10 bg-white/10 rounded w-full"></div>
    </div>
  </div>
);

export default function EventList() {
  const { i18n } = useTranslation();
  const [content, setContent] = useState(eventListContent.zh);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const language = i18n.language as keyof typeof eventListContent;
    setContent(eventListContent[language] || eventListContent.zh);
    setLoading(true);
    // 模拟数据加载延迟
    setTimeout(() => {
      setEvents(eventData[language] || eventData.zh);
      setLoading(false);
    }, 1000);
  }, [i18n.language]);

  const currentDate = new Date();
  const upcomingEvents = events.filter(event => new Date(event.startDate) > currentDate);
  const currentEvents = events.filter(event => new Date(event.startDate) <= currentDate && new Date(event.endDate) >= currentDate);
  const pastEvents = events.filter(event => new Date(event.endDate) < currentDate);

  const renderEventCard = (event: EventItem) => (
    <div className="w-full px-2">
      <div className="bg-gradient-to-br from-[#1a237e]/95 via-[#311b92]/90 to-[#4a148c]/85 backdrop-blur-sm rounded-lg shadow-lg p-6 h-[420px] flex flex-col">
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
          {event.buttons && event.buttons.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.buttons.map((button, index) => (
                <Link 
                  target="_blank" 
                  key={index} 
                  href={button.link} 
                  className="block w-full text-center py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
                >
                  {button.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSkeletonSection = (count: number) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count).fill(0).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );

  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          {content.title}
        </h1>
        
        {loading ? (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              {content.loading}
            </h2>
            {renderSkeletonSection(3)}
          </section>
        ) : (
          <>
            {currentEvents.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                  {content.current}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentEvents.map((event, index) => (
                    <div key={index}>{renderEventCard(event)}</div>
                  ))}
                </div>
              </section>
            )}

            {upcomingEvents.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                  {content.upcoming}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event, index) => (
                    <div key={index}>{renderEventCard(event)}</div>
                  ))}
                </div>
              </section>
            )}

            {pastEvents.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                  {content.past}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((event, index) => (
                    <div key={index}>{renderEventCard(event)}</div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
