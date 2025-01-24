"use client"

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

export const Hero = () => {
  const { i18n } = useTranslation();
  const [content, setContent] = useState({
    slogan: "",
    description: "",
    buttonJoin: { text: "", link: "" },
    buttonReview: { text: "", link: "" }
  });

  useEffect(() => {
    const { t } = i18n;
    setContent({
      slogan: t('home.slogan'),
      description: t('home.description'),
      buttonJoin: {
        text: t('home.buttonJoin.text'),
        link: t('home.buttonJoin.link')
      },
      buttonReview: {
        text: t('home.buttonReview.text'),
        link: t('home.buttonReview.link')
      }
    });
  }, [i18n]);

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
          <Button size="lg">
            <Link href={content.buttonJoin.link} className="flex items-center space-x-2">
              <Icon name="calendar" />
              <span>{content.buttonJoin.text}</span>
            </Link>
          </Button>
          <Button size="lg" variant="secondary">
            <Link href={content.buttonReview.link} className="flex items-center space-x-2">
              <Icon name="grid" />
              <span>{content.buttonReview.text}</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}; 