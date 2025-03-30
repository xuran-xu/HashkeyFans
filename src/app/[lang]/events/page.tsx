/* eslint-disable @next/next/no-img-element */
"use client"

import { useTranslation } from "react-i18next";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { EventItem } from "@/types";
import { eventData } from "@/data/eventData";

const SkeletonCard = () => (
  <div className="w-full px-2">
    <div className="relative overflow-hidden h-[380px] rounded-xl animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/90 via-gray-700/90 to-gray-800/90 border border-white/5 rounded-xl"></div>
      <div className="relative h-full flex flex-col rounded-xl overflow-hidden">
        <div className="relative h-48 bg-gray-700/50"></div>
        <div className="flex-1 p-4 flex flex-col">
          <div className="h-6 bg-gray-700/50 rounded-md w-3/4 mb-2"></div>
          <div className="h-10 bg-gray-700/30 rounded-md w-full mb-3"></div>
          <div className="mt-auto flex justify-end">
            <div className="h-8 bg-gray-700/40 rounded-md w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function EventList() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const lang = params?.lang as string || 'en';

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setEvents(eventData[lang as keyof typeof eventData] || eventData.zh);
      setLoading(false);
    }, 1000);
  }, [lang]);

  const currentDate = new Date();
  const upcomingEvents = events.filter(event => new Date(event.startDate) > currentDate);
  const currentEvents = events.filter(event => new Date(event.startDate) <= currentDate && new Date(event.endDate) >= currentDate);
  const pastEvents = events.filter(event => new Date(event.endDate) < currentDate);

  const renderEventCard = (event: EventItem) => (
    <div className="w-full px-2">
      <div className="relative overflow-hidden group h-[380px] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
        {/* 背景遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 border border-white/10 rounded-xl z-10"></div>
        
        {/* 发光效果 */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>
        
        {/* 科技线条装饰 */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden z-20">
          <div className="absolute rotate-45 top-4 -right-8 w-[1px] h-16 bg-gradient-to-b from-transparent via-blue-400/40 to-transparent"></div>
          <div className="absolute rotate-45 top-6 -right-10 w-[1px] h-16 bg-gradient-to-b from-transparent via-purple-400/30 to-transparent"></div>
        </div>
        
        {/* 卡片内容 */}
        <div className="relative z-20 h-full flex flex-col rounded-xl overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60 z-10"></div>
            <img
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* 科技风格的纹理覆盖 */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 mix-blend-overlay"></div>
          </div>
          
          <div className="flex-1 p-4 flex flex-col">
            <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-1 group-hover:text-shadow-glow">{event.title}</h2>
            <p className="text-gray-300/90 line-clamp-2 h-10 mb-2">
              {event.content}
            </p>
            <div className="mt-auto flex flex-wrap gap-2 justify-end">
              {event.buttons && event.buttons.length > 0 ? (
                event.buttons.map((button, index) => (
                  <Link 
                    key={index} 
                    href={button.link} 
                    target="_blank"
                    className="relative px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-md overflow-hidden group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300"
                  >
                    <span className="relative z-10">{button.text}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                ))
              ) : (
                <div className="relative px-4 py-1.5 bg-gray-700/50 text-gray-300 rounded-md border border-gray-600/50">
                  {t('events.comingSoon')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        {t('events.title')}
      </h1>
      
      {loading ? (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {t('common.loading')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </section>
      ) : (
        <>
          {currentEvents.length > 0 && (
            <section className="mb-12 relative">
              {/* 科技感装饰 */}
              <div className="absolute -left-4 top-8 w-1 h-20 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent blur-sm"></div>
              <div className="absolute -top-2 left-0 w-32 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm"></div>
              
              <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] inline-flex items-center">
                <div className="w-5 h-5 mr-2 relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-sm rotate-45"></div>
                  <div className="absolute inset-1 bg-blue-500/40 rounded-sm rotate-45"></div>
                </div>
                <span className="relative">
                  {t('events.current')}
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEvents.map((event, index) => (
                  <div key={index}>{renderEventCard(event)}</div>
                ))}
              </div>
            </section>
          )}

          {upcomingEvents.length > 0 && (
            <section className="mb-12 relative">
              {/* 科技感装饰 */}
              <div className="absolute -left-4 top-8 w-1 h-20 bg-gradient-to-b from-transparent via-green-500/30 to-transparent blur-sm"></div>
              <div className="absolute -top-2 left-0 w-32 h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent blur-sm"></div>
              
              <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] inline-flex items-center">
                <div className="w-5 h-5 mr-2 relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-sm rotate-45"></div>
                  <div className="absolute inset-1 bg-green-500/40 rounded-sm rotate-45"></div>
                </div>
                <span className="relative">
                  {t('events.upcoming')}
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent"></span>
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event, index) => (
                  <div key={index}>{renderEventCard(event)}</div>
                ))}
              </div>
            </section>
          )}

          {pastEvents.length > 0 && (
            <section className="relative">
              {/* 科技感装饰 */}
              <div className="absolute -left-4 top-8 w-1 h-20 bg-gradient-to-b from-transparent via-purple-500/30 to-transparent blur-sm"></div>
              <div className="absolute -top-2 left-0 w-32 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-sm"></div>
              
              <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] inline-flex items-center">
                <div className="w-5 h-5 mr-2 relative">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-sm rotate-45"></div>
                  <div className="absolute inset-1 bg-purple-500/40 rounded-sm rotate-45"></div>
                </div>
                <span className="relative">
                  {t('events.past')}
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></span>
                </span>
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
  );
}
