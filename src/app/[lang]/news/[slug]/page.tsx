"use client"

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { newsData, NewsItem } from "@/app/data/newsData";
import { useParams } from "next/navigation";
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

const newsDetailContent = {
  zh: {
    loading: "加载中...",
    notFound: "未找到文章",
    backToNews: "返回新闻列表"
  },
  en: {
    loading: "Loading...",
    notFound: "Article not found",
    backToNews: "Back to News"
  }
};

export default function NewsDetail() {
  const { i18n } = useTranslation();
  const params = useParams();
  const [content, setContent] = useState(newsDetailContent.zh);
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);

  useEffect(() => {
    const language = i18n.language as keyof typeof newsDetailContent;
    setContent(newsDetailContent[language] || newsDetailContent.zh);
    
    const loadNewsContent = async () => {
      setLoading(true);
      try {
        const currentNews = newsData[i18n.language as keyof typeof newsData].find(
          news => news.slug === params.slug
        );

        if (currentNews) {
          setNewsItem(currentNews);
          const response = await fetch(`/content/news/${params.lang}/${params.slug}.mdx`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const content = await response.text();
          const mdxSource = await serialize(content);
          setMdxSource(mdxSource);
        }
      } catch (error) {
        console.error('Error loading news content:', error);
      }
      setLoading(false);
    };

    loadNewsContent();
  }, [params.slug, params.lang, i18n.language]);

  if (loading) {
    return (
      <div className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">{content.loading}</div>
        </div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">{content.notFound}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <img 
            src={newsItem.image} 
            alt={newsItem.title} 
            className="w-full h-auto object-cover rounded-lg mb-8"
          />
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {newsItem.title}
          </h1>
          <p className="text-gray-300 mb-8">
            {new Date(newsItem.date).toLocaleDateString(i18n.language, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <div className="text-white rounded-lg py-6 prose prose-lg max-w-none">
            {mdxSource && <MDXRemote {...mdxSource} />}
          </div>
        </div>
      </div>
    </div>
  );
} 