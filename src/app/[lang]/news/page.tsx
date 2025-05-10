"use client"

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { Card } from "@/components/common/Card";
import { NewsItem } from "@/types";
import { newsData } from "@/data/newsData";

const SkeletonCard = () => (
  <Card gradient={false} className="animate-pulse">
    <div className="w-full h-48 bg-white/10"></div>
    <div className="p-6">
      <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
      <div className="h-6 bg-white/10 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-white/10 rounded w-full mb-4"></div>
      <div className="h-10 bg-white/10 rounded w-full"></div>
    </div>
  </Card>
);

const NewsCard = ({ news, lang }: { news: NewsItem; lang: string }) => {
  const { t } = useTranslation();
  
  return (
    <Card className="h-[420px] flex flex-col overflow-hidden">
      <div className="h-[160px] overflow-hidden relative">
        {/* 图片渐变覆盖 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#081020] via-[#081020]/60 to-transparent opacity-70 z-10"></div>
        
        <img 
          src={news.image} 
          alt={news.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* 科技网格覆盖 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 mix-blend-overlay z-20"></div>
      </div>
      
      <div className="p-4 pb-5 flex-grow flex flex-col">
        <div className="mb-2">
          <span className="text-gray-300 text-sm">
            {new Date(news.date).toLocaleDateString(lang, { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-white truncate">
          {news.title}
        </h3>
        
        <div className="flex-grow overflow-hidden">
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
            {news.summary}
          </p>
        </div>
        
        <div className="mt-auto pt-4">
          <Link 
            href={`/news/${news.slug}`}
            className="block w-full text-center py-2 bg-gradient-to-r from-[#1a56db] to-[#1e40af] hover:from-[#1e40af] hover:to-[#1a56db] text-white font-medium px-4 rounded-md transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
          >
            {t('news.readMore')}
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default function NewsList() {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setNews(newsData[i18n.language as keyof typeof newsData] || newsData.zh);
      setLoading(false);
    }, 1000);
  }, [i18n.language]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        {t('news.title')}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i}>
              <SkeletonCard />
            </div>
          ))
        ) : (
          news.map((newsItem, index) => (
            <div key={index}>
              <NewsCard news={newsItem} lang={i18n.language} />
            </div>
          ))
        )}
      </div>
    </div>
  );
} 