"use client"

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { partners } from "@/data/partnersData";

interface Partner {
  name: string;
  image: string;
  link: string;
  width: number;
  height: number;
}

export const Partners = () => {
  const { i18n, t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const renderPartners = (partnerList: Partner[], title: string) => (
    <div className="mb-12">
      <h3 className="text-2xl text-center font-bold mb-6 text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] tracking-wide">
        {t(`partners.${title}`)}
      </h3>
      <div className="flex flex-wrap justify-center items-center gap-8">
        {partnerList.map((partner, index) => (
          <Link 
            key={index} 
            href={partner.link} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Card className="w-[200px] h-[100px] flex items-center justify-center p-4 group hover:scale-105 transition-all duration-300">
              <img 
                src={partner.image} 
                alt={partner.name} 
                className="w-full h-auto max-h-full object-contain brightness-90 contrast-125 
                         group-hover:brightness-110 group-hover:contrast-100 transition-all duration-300
                         filter invert"
              />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-center font-bold mb-12 text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.7)] tracking-wide">
          {t('partners.title')}
        </h2>
        {renderPartners(partners.collaborators, 'collaborators')}
        {renderPartners(partners.mediaPartners, 'mediaPartners')}
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4 text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] tracking-wide">
            {t('partners.interested')}
          </h3>
          <p className="text-gray-300 mb-6">
            {t('partners.description')}
          </p>
          <Button size="lg">
            <Link href="/sponsor">
              {t('partners.apply')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}; 