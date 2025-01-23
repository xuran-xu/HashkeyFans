"use client"

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { newsData, NewsItem } from "@/app/data/newsData";
import Link from 'next/link';

const newsListContent = {
  zh: {
    title: "新闻中心",
    loading: "加载中...",
  },
  en: {
    title: "News Center",
    loading: "Loading...",
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

  const renderNewsCard = (newsItem: NewsItem) => (
    <Link href={`/news/${newsItem.slug}`} className="block">
      <div className="bg-white/90 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
        <img 
          src={newsItem.image} 
          alt={newsItem.title} 
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2 text-gray-800">{newsItem.title}</h3>
          {newsItem.summary && (
            <p className="text-gray-600 mb-2 line-clamp-2">{newsItem.summary}</p>
          )}
          <p className="text-sm text-gray-500">
            {new Date(newsItem.date).toLocaleDateString(i18n.language, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="w-full py-12 bg-gradient-to-b from-white/10 to-white/5">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          {content.title}
        </h1>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((newsItem) => (
              <div key={newsItem.id}>
                {renderNewsCard(newsItem)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 