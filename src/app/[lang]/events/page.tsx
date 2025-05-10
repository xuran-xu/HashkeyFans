/* eslint-disable @next/next/no-img-element */
"use client"

import { useTranslation } from "react-i18next";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
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
  
  // 修改分类逻辑，将TBD日期的活动移到即将开始的区域
  const upcomingEvents = events.filter(event => 
    event.startDate === "TBD" || new Date(event.startDate) > currentDate
  );
  const currentEvents = events.filter(event => 
    event.startDate !== "TBD" && 
    new Date(event.startDate) <= currentDate && 
    new Date(event.endDate) >= currentDate
  );
  const pastEvents = events.filter(event => 
    event.startDate !== "TBD" && 
    new Date(event.endDate) < currentDate
  );

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
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
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
                  target="_blank"
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
                {event.startDate === "TBD" ? t('common.stayTuned') : t('events.comingSoon')}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
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
