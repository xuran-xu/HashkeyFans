"use client"

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Buffer } from 'buffer';

const invitationContent = {
  zh: {
    title: "邀请函",
    loading: "正在加载邀请函...",
    errorTitle: "邀请函未找到",
    errorMessage: "抱歉，我们无法找到您的邀请函。",
    location: "香港",
  },
  en: {
    title: "INVITATION",
    loading: "Loading invitation...",
    errorTitle: "Invitation Not Found",
    errorMessage: "We're sorry, but we couldn't find your invitation.",
    location: "HongKong",
  }
};

export default function Invitation({ params }: { params: { lang: string, code: string } }) {
  const { i18n } = useTranslation();
  const [content, setContent] = useState(invitationContent.zh);
  const [invitee, setInvitee] = useState<{ nickname: string; type: string } | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const language = i18n.language as keyof typeof invitationContent;
    setContent(invitationContent[language] || invitationContent.zh);
    
    try {
      const code = params.code;
      const base64 = code.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = Buffer.from(base64, 'base64').toString('utf-8');
      const [nickname, type] = decoded.split('|');
      
      if (!nickname || !type) {
        throw new Error('Invalid decoded data');
      }
      setInvitee({ nickname, type });
    } catch (e) {
      console.error('Error decoding invitation code', e);
      setError(true);
    }
    setLoading(false);
  }, [i18n.language, params.code]);

  if (loading) return <div className="flex items-center justify-center flex-grow">{content.loading}</div>;
  if (error) return <div className="flex flex-col items-center justify-center flex-grow"><h1>{content.errorTitle}</h1><p>{content.errorMessage}</p></div>;

  return (
    <div className="flex flex-col justify-between flex-grow bg-white/10 text-white p-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold">Taichu</h1>
        <p>HSK Hackerhouse</p>
      </div>
      <div className="flex flex-col justify-center flex-grow text-center">
        <h2 className="text-5xl font-bold mb-16 text-shadow-lg">{content.title}</h2>
        <h3 className="text-8xl font-bold mb-4 text-shadow-lg">{invitee?.nickname}</h3>
        <p className="text-3xl font-light text-shadow-md">{invitee?.type}</p>
      </div>
      <div className="flex flex-col justify-center flex-grow text-center">
        <div className="text-xl font-light text-shadow-lg">
          {content.location}
        </div>
        <div className="text-xl font-light text-shadow-lg">
          PayFi Infrastructure Hackerhouse
        </div>
        <div className="text-xl font-light text-shadow-lg">
          2024-12-12
        </div>
      </div>
    </div>
  );
}
