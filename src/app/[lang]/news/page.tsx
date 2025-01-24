"use client"

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { newsData, NewsItem } from "@/app/data/newsData";
import Link from 'next/link';

const newsListContent = {
  zh: {
    title: "新闻中心",
    loading: "加载中...",
    readMore: "阅读更多"
  },
  en: {
    title: "News Center",
    loading: "Loading...",
    readMore: "Read More"
  }
};

const SkeletonCard = () => (
  <div className="bg-white/90 rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-300"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
    </div>
  </div>
);

const renderNewsCard = (news: NewsItem, i18n: any) => (
  <div className="w-full px-2 group">
    <div className="bg-gradient-to-br from-[#1a237e]/95 via-[#311b92]/90 to-[#4a148c]/85 backdrop-blur-sm 
                  rounded-lg shadow-lg p-6 h-[420px] flex flex-col transform 
                  transition-all duration-500 ease-in-out hover:scale-[1.02] hover:-rotate-1
                  group-hover:translate-y-1 hover:shadow-xl
                  hover:after:opacity-100">
      <div className="h-48 overflow-hidden rounded-lg mb-4 transform transition-transform duration-500 ease-in-out 
                    group-hover:scale-[1.03] group-hover:-rotate-1">
        <img 
          src={news.image} 
          alt={news.title} 
          className="w-full h-full object-cover transform transition-transform duration-500 ease-in-out 
                   group-hover:scale-[1.05]"
        />
      </div>
      
      <div className="flex flex-col flex-grow transform transition-all duration-500 ease-in-out 
                    group-hover:translate-y-1">
        <div className="mb-2">
          <span className="text-gray-300 text-sm">
            {new Date(news.date).toLocaleDateString(i18n.language, { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-white">
          {news.title}
        </h3>
        
        <p className="text-gray-300 text-sm mb-4 flex-grow line-clamp-3">
          {news.summary}
        </p>
        
        <div className="mt-auto transform transition-all duration-500 ease-in-out 
                     group-hover:translate-y-1">
          <Link 
            href={`/news/${news.slug}`}
            className="block w-full text-center py-2 bg-white/10 hover:bg-white/20 text-white 
                     rounded-lg transition-all duration-300 transform 
                     group-hover:translate-y-1"
          >
            {newsListContent[i18n.language as keyof typeof newsListContent]?.readMore}
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default function NewsList() {
  const { i18n } = useTranslation();
  const [content, setContent] = useState(newsListContent.zh);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const language = i18n.language as keyof typeof newsListContent;
    setContent(newsListContent[language] || newsListContent.zh);
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setNews(newsData[language] || newsData.zh);
      setLoading(false);
    }, 1000);
  }, [i18n.language]);

  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          {content.title}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // 显示骨架屏
            Array(3).fill(0).map((_, i) => (
              <div key={i}>
                <SkeletonCard />
              </div>
            ))
          ) : (
            news.map((newsItem, index) => (
              <div key={index}>
                {renderNewsCard(newsItem, i18n)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 