import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { IoTicketOutline, IoGridOutline } from "react-icons/io5";

const heroContent = {
  zh: {
    slogan: "Web3大航海",
    description: "区块链如何融入人类文明主叙事 · 香港",
    buttonJoin: {
      text: "申请参加",
      link: "https://lu.ma/hzz6mel6"
    },
    buttonReview: {
      text: "查看链上项目",
      link: "/projects"
    }
  },
  en: {
    slogan: "Web3 Voyage",
    description: "How Blockchain Shapes Humanity's Main Narrative · HongKong",
    buttonJoin: {
      text: "Join Event",
      link: "https://lu.ma/hzz6mel6"
    },
    buttonReview: {
      text: "All Projects",
      link: "/projects"
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
          <Link 
            href={content.buttonJoin.link} 
            className="group/button w-full md:w-60 h-12 md:h-14 bg-gradient-to-br from-[#1a237e]/95 via-[#311b92]/90 to-[#4a148c]/85 
                     text-white font-semibold text-base md:text-lg rounded-lg overflow-hidden relative shadow-md 
                     hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                          opacity-0 group-hover/button:opacity-100 transition-opacity duration-700 ease-in-out">
            </span>
            <span className="relative z-10 flex items-center space-x-2 tracking-wide">
              <IoTicketOutline className="w-5 h-5" />
              <span>{content.buttonJoin.text}</span>
            </span>
          </Link>
          <Link 
            href={content.buttonReview.link} 
            className="group/button w-full md:w-60 h-12 md:h-14 bg-gradient-to-br from-[#1a237e]/95 via-[#311b92]/90 to-[#4a148c]/85 
                     text-white font-semibold text-base md:text-lg rounded-lg overflow-hidden relative shadow-md 
                     hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                          opacity-0 group-hover/button:opacity-100 transition-opacity duration-700 ease-in-out">
            </span>
            <span className="relative z-10 flex items-center space-x-2 tracking-wide">
              <IoGridOutline className="w-5 h-5" />
              <span>{content.buttonReview.text}</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
