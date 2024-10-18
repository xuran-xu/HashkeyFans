import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Link from 'next/link';

const heroContent = {
  zh: {
    slogan: "太初",
    description: "Hashkey Chain Hackerhouse · 巴厘岛",
    buttonJoin: {
      text: "申请参加",
      link: "/"
    },
    buttonReview: {
      text: "查看所有活动",
      link: "/events"
    }
  },
  en: {
    slogan: "Taichu",
    description: "Hashkey Chain Hackerhouse · Bali",
    buttonJoin: {
      text: "Join Event",
      link: "/"
    },
    buttonReview: {
      text: "Review All Events",
      link: "/events"
    }
  }
};

export default function Hero() {
  const { i18n } = useTranslation();
  const [content, setContent] = useState(heroContent.zh);

  useEffect(() => {
    const language = i18n.language as keyof typeof heroContent;
    setContent(heroContent[language] || heroContent.zh);
  }, [i18n.language]);

  return (
    <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 font-mono text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.7)] tracking-wide">
          {content.slogan}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider">
          {content.description}
        </p>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-10">
          <Link href={content.buttonJoin.link} className="w-full md:w-60 h-12 md:h-14 bg-white text-black font-semibold text-base md:text-lg rounded-lg overflow-hidden group relative shadow-md hover:shadow-lg transition-shadow duration-300 inline-flex items-center justify-center">
            <span className="absolute inset-0 bg-gradient-to-r from-black via-gray-700 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-700 tracking-wide">
              {content.buttonJoin.text}
            </span>
          </Link>
          <Link href={content.buttonReview.link} className="w-full md:w-60 h-12 md:h-14 bg-white text-black font-semibold text-base md:text-lg rounded-lg overflow-hidden group relative shadow-md hover:shadow-lg transition-shadow duration-300 inline-flex items-center justify-center">
            <span className="absolute inset-0 bg-gradient-to-r from-black via-gray-700 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-700 tracking-wide">
              {content.buttonReview.text}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
