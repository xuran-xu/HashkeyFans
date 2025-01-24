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
      name: "Rebase",
      image: "/img/rebase.png",
      link: "https://rebase.network/",
      width: 90,
      height: 20
    },
    {
      name: "BuidlerDAO",
      image: "/img/builderdao.webp",
      link: "https://buidlerdao.xyz/",
      width: 90,
      height: 20
    },
    {
      name: "Deng Lian",
      image: "/img/denglian.png",
      link: "https://learnblockchain.cn/",
      width: 90,
      height: 20
    },
    {
      name: "OpenBuild",
      image: "/img/openbuild.svg",
      link: "https://openbuild.xyz/",
      width: 90,
      height: 20
    },
    {
      name: "coset",
      image: "/img/coset.png",
      link: "https://coset.io/",
      width: 90,
      height: 20
    },
    {
      name: "SHENZHEN University",
      image: "/img/shenda.svg",
      link: "https://x.com/0xSZUBAgst",
      width: 90,
      height: 20
    },
    {
      name: "LXDAO",
      image: "/img/LXDAO.png",
      link: "https://lxdao.io/",
      width: 90,
      height: 20
    },
  ],
  mediaPartners: [
    {
      name: "PANews",
      image: "/img/panews.png",
      link: "https://www.panewslab.com/",
      width: 300,
      height: 80
    },
    {
      name: "Metaera",
      image: "/img/MetaEra.png",
      link: "https://www.metaera.hk/",
      width: 300,
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
      <h3 className="text-2xl text-center font-bold mb-6 text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] tracking-wide">
        {currentTranslations[title as keyof typeof currentTranslations]}
      </h3>
      <div className="flex flex-wrap justify-center items-center gap-8">
        {partnerList.map((partner, index) => (
          <Link 
            key={index} 
            href={partner.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-[#1a237e]/30 via-[#311b92]/25 to-[#4a148c]/20 backdrop-blur-sm 
                     w-[200px] h-[100px] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 
                     flex items-center justify-center p-4 group border border-white/10 
                     hover:border-white/20 hover:from-[#1a237e]/40 hover:via-[#311b92]/35 hover:to-[#4a148c]/30"
          >
            <img 
              src={partner.image} 
              alt={partner.name} 
              className="w-full h-auto max-h-full object-contain brightness-90 contrast-125 
                       group-hover:brightness-110 group-hover:contrast-100 transition-all duration-300
                       filter invert"
            />
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-center font-bold mb-12 text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.7)] tracking-wide">
          {currentTranslations["Our Partners"]}
        </h2>
        {renderPartners(partners.collaborators, "Collaborators")}
        {renderPartners(partners.mediaPartners, "Media Partners")}
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4 text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] tracking-wide">
            {currentTranslations["Interested in Partnering?"]}
          </h3>
          <p className="text-gray-300 mb-6">
            {currentTranslations["If you're interested in partnering with us, we'd love to hear from you!"]}
          </p>
          <Link 
            href="/sponsor" 
            className="group/button inline-block px-8 py-3 bg-gradient-to-br from-[#1a237e]/95 via-[#311b92]/90 to-[#4a148c]/85 
                     text-white font-semibold rounded-lg overflow-hidden relative shadow-md hover:shadow-xl 
                     transition-all duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                          opacity-0 group-hover/button:opacity-100 transition-opacity duration-700 ease-in-out">
            </span>
            <span className="relative z-10 tracking-wide">
              {currentTranslations["Apply for Partnership"]}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
