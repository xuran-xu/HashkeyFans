/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import Link from 'next/link';

interface Partner {
  name: string;
  image: string;
  link: string;
  width: number;
  height: number;
}

const partners: { [key: string]: Partner[] } = {
  collaborators: [
    {
      name: "Antaplha Lab",
      image: "/img/antalphalab.png",
      link: "https://partner1.com",
      width: 80,
      height: 80
    },
    {
      name: "Rebase",
      image: "/img/rebase.png",
      link: "https://partner3.com",
      width: 180,
      height: 80
    },
  ],
  mediaPartners: [
    {
      name: "BuidlerDAO",
      image: "/img/buidlerdao.jpg",
      link: "https://partner2.com",
      width: 80,
      height: 80
    },
    {
      name: "Deng Lian",
      image: "/img/denglian.webp",
      link: "https://partner2.com",
      width: 80,
      height: 80
    }
  ]
};

const translations = {
  en: {
    "Our Partners": "Our Partners",
    "Collaborators": "Collaborators",
    "Media Partners": "Media Partners",
    "Interested in Partnering?": "Interested in Partnering?",
    "If you're interested in partnering with us, we'd love to hear from you!": "If you're interested in partnering with us, we'd love to hear from you!",
    "Apply for Partnership": "Apply for Partnership"
  },
  zh: {
    "Our Partners": "我们的合作伙伴",
    "Collaborators": "合作伙伴",
    "Media Partners": "媒体合作伙伴",
    "Interested in Partnering?": "有兴趣成为合作伙伴吗？",
    "If you're interested in partnering with us, we'd love to hear from you!": "如果您有兴趣与我们合作，我们很乐意听取您的意见！",
    "Apply for Partnership": "申请合作"
  }
};

export default function Partners() {
  const { i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const currentTranslations = translations[i18n.language as keyof typeof translations] || translations.en;

  const renderPartners = (partnerList: Partner[], title: string) => (
    <div className="mb-12">
      <h3 className="text-2xl text-center font-bold mb-6 font-mono text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] tracking-wide">{currentTranslations[title as keyof typeof currentTranslations]}</h3>
      <div className="flex flex-wrap justify-center items-center gap-8">
        {partnerList.map((partner, index) => (
          <Link key={index} href={partner.link} target="_blank" rel="noopener noreferrer"
                className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center">
            <img 
              src={partner.image} 
              alt={partner.name} 
              width={partner.width} 
              height={partner.height}
              className="object-contain"
            />
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-center font-bold mb-12 font-mono text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.7)] tracking-wide">{currentTranslations["Our Partners"]}</h2>
        {renderPartners(partners.collaborators, "Collaborators")}
        {renderPartners(partners.mediaPartners, "Media Partners")}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4 font-mono text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] tracking-wide">{currentTranslations["Interested in Partnering?"]}</h3>
          <p className="text-white mb-6">{currentTranslations["If you're interested in partnering with us, we'd love to hear from you!"]}</p>
          <Link href="/sponsor" className="inline-block w-60 h-14 bg-white text-black font-semibold text-lg rounded-lg overflow-hidden group relative shadow-md hover:shadow-lg transition-shadow duration-300">
            <span className="absolute inset-0 bg-gradient-to-r from-black via-gray-700 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-700 tracking-wide flex items-center justify-center h-full">
              {currentTranslations["Apply for Partnership"]}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
