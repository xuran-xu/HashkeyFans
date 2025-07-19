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
  <div className="w-full">
    <div className="relative overflow-hidden h-[420px] rounded-2xl animate-pulse border border-white/5">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1323]/90 via-[#0d192b]/90 to-[#071019]/90 backdrop-blur-sm"></div>
      <div className="relative h-full flex flex-col rounded-2xl overflow-hidden">
        {/* 图片骨架 */}
        <div className="relative h-[200px] bg-gradient-to-br from-gray-700/40 to-gray-800/40">
          {/* 闪烁效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-[shimmer_2s_ease-in-out_infinite] skew-x-12"></div>
        </div>
        {/* 内容骨架 */}
        <div className="flex-1 p-6 flex flex-col">
          {/* 装饰线骨架 */}
          <div className="w-16 h-0.5 bg-blue-500/30 rounded-full mb-4"></div>
          {/* 标题骨架 */}
          <div className="h-5 bg-gray-700/40 rounded-md w-3/4 mb-3"></div>
          {/* 内容骨架 */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-700/30 rounded-md w-full"></div>
            <div className="h-4 bg-gray-700/30 rounded-md w-5/6"></div>
            <div className="h-4 bg-gray-700/30 rounded-md w-4/6"></div>
          </div>
          {/* 按钮骨架 */}
          <div className="mt-auto">
            <div className="h-12 bg-gray-700/30 rounded-xl w-full"></div>
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
    <div className="group relative">
      {/* 悬停时的外部发光效果 */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      
      <Card className="h-[420px] flex flex-col overflow-hidden w-full relative z-10 rounded-2xl border border-white/5 backdrop-blur-sm">
        {/* 图片容器 - 增大尺寸 */}
        <div className="h-[200px] overflow-hidden relative">
          {/* 动态渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1323] via-[#0a1323]/80 to-transparent z-10"></div>
          
          {/* 图片 */}
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />
          
          {/* 现代科技网格 */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 group-hover:opacity-60 transition-opacity duration-500 z-20"></div>
          
          {/* 光晕效果 */}
          <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400/60 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)] z-30 animate-pulse"></div>
          
          {/* 标题和状态标签 */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-30">
            <div className="flex items-end justify-between">
              <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors drop-shadow-lg line-clamp-2 flex-1 mr-3">
                {event.title}
              </h3>
              {/* 状态指示器 */}
              <div className="flex items-center space-x-1 bg-blue-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-blue-400/30">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-200 font-medium">活动中</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 内容区域 - 调整高度和间距 */}
        <div className="p-6 flex-grow flex flex-col h-[220px]">
          {/* 现代化装饰线 */}
          <div className="relative mb-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
            <div className="absolute top-0 right-0 w-2 h-0.5 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full opacity-60"></div>
          </div>
          
          {/* 内容文本 */}
          <div className="flex-grow overflow-hidden">
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 group-hover:text-gray-200 transition-colors">
              {event.content}
            </p>
          </div>
          
          {/* 按钮区域 */}
          <div className="mt-auto pt-5">
            {event.buttons?.length ? (
              <div className="flex">
                {event.buttons.map((button, index) => (
                  <Link 
                    key={index}
                    href={button.link} 
                    target="_blank"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-normal px-5 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-[1.02] group/btn"
                  >
                    <span className="truncate">{button.text}</span>
                    <Icon name="externalLink" className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform duration-300 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex">
                <span className="w-full inline-flex items-center justify-center bg-gray-800/60 backdrop-blur-sm text-gray-400 px-5 py-3 rounded-xl border border-gray-600/30 font-normal">
                  <Icon name="history" className="w-4 h-4 mr-2" />
                  {event.startDate === "TBD" ? t('common.stayTuned') : t('events.comingSoon')}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
