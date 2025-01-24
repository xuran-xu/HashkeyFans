"use client"

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { NewsItem } from "@/types";
import { newsData } from "@/data/newsData";

export default function NewsDetail() {
  const { t } = useTranslation();
  const params = useParams();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);

  useEffect(() => {
    const loadNewsContent = async () => {
      setLoading(true);
      try {
        const currentNews = newsData[params.lang as keyof typeof newsData]?.find(
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
  }, [params.slug, params.lang]);

  if (loading) {
    return (
      <div className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">{t('news.notFound')}</div>
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
            {new Date(newsItem.date).toLocaleDateString(params.lang, {
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