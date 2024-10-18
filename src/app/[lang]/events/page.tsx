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
  <div className="bg-white/90 rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-300"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
      <div className="h-10 bg-gray-300 rounded w-full"></div>
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
    <div className="bg-white/90 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <img src={event.image} alt={event.title} width={400} height={200} className="w-full h-48 object-cover" />
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-2">
          {new Date(event.startDate).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' })} - 
          {new Date(event.endDate).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <h3 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h3>
        <p className="text-gray-700 mb-4">{event.content}</p>
        {event.buttons && event.buttons.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.buttons.map((button, index) => (
              <Link key={index} href={button.link} className="flex-grow h-12 md:h-14 bg-white text-black font-semibold text-base md:text-lg rounded-lg overflow-hidden group relative shadow-md hover:shadow-lg transition-shadow duration-300 inline-flex items-center justify-center">
                <span className="absolute inset-0 bg-gradient-to-r from-black via-gray-700 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-700 tracking-wide">
                  {button.text}
                </span>
              </Link>
            ))}
          </div>
        )}
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
    <div className="py-12 bg-gradient-to-b from-white/10 to-white/5">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">{content.title}</h1>
        
        {loading ? (
          <>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">{content.loading}</h2>
              {renderSkeletonSection(3)}
            </section>
          </>
        ) : (
          <>
            {currentEvents.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">{content.current}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentEvents.map((event, index) => (
                    <div key={index}>{renderEventCard(event)}</div>
                  ))}
                </div>
              </section>
            )}

            {upcomingEvents.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">{content.upcoming}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event, index) => (
                    <div key={index}>{renderEventCard(event)}</div>
                  ))}
                </div>
              </section>
            )}

            {pastEvents.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">{content.past}</h2>
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
