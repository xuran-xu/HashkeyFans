"use client"

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { Mail, FileText, Send } from 'lucide-react';
import React from "react";
import { FaDiscord } from "react-icons/fa";

const sponsorContent = {
  zh: {
    title: "申请赞助",
    description: "选择您喜欢的方式联系我们",
    email: "邮件",
    form: "表单",
    telegram: "Telegram",
    discord: "Discord",
    emailSubject: "太初 Hackerhouse 赞助申请"
  },
  en: {
    title: "Apply for Sponsorship",
    description: "Choose your preferred way to contact us",
    email: "Email",
    form: "Form",
    telegram: "Telegram",
    discord: "Discord",
    emailSubject: "Taichu Hackerhouse Sponsorship Application"
  }
};

export default function SponsorPage() {
  const { i18n } = useTranslation();
  const [content, setContent] = useState(sponsorContent.zh);

  useEffect(() => {
    const language = i18n.language as keyof typeof sponsorContent;
    setContent(sponsorContent[language] || sponsorContent.zh);
  }, [i18n.language]);

  const renderContactOption = (
    icon: React.ReactNode,
    title: string,
    link: string,
    isDark: boolean
  ) => (
    <Link href={link} className={`flex flex-col items-center justify-center p-6 rounded-lg transition-all duration-300 hover:opacity-80 ${
      isDark 
        ? 'bg-black/70 text-white' 
        : 'bg-white/70 text-gray-800'
    }`}>
      <div className="mb-4">
        {React.cloneElement(icon as React.ReactElement, { className: isDark ? 'text-white' : 'text-gray-800' })}
      </div>
      <span className="text-lg font-semibold">{title}</span>
    </Link>
  );

  // 创建带有主题的邮件链接
  const emailLink = `mailto:francis.li@hashkey.com?subject=${encodeURIComponent(content.emailSubject)}`;

  return (
    <div className="flex flex-grow items-center bg-gradient-to-b from-white/10 to-white/5 min-h-[calc(100vh-90px)]">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{content.title}</h1>
        <p className="text-xl text-center text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] mb-12">{content.description}</p>
        
        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
          {renderContactOption(
            <Mail size={48} />,
            content.email,
            emailLink,
            true
          )}
          {renderContactOption(
            <FileText size={48} />,
            content.form,
            "/sponsor-form",
            false
          )}
          {renderContactOption(
            <Send size={48} />,
            content.telegram,
            "https://t.me/bitfrancis",
            true
          )}
          {renderContactOption(
            <FaDiscord size={48} />,
            content.discord,
            "https://discord.gg/qvPkbrYY",
            false
          )}
        </div>
      </div>
    </div>
  );
}
