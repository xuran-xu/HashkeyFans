"use client"

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { projectsData, Project, tagConfig } from "@/app/data/projectsData";
import { FaDiscord, FaTelegram, FaExternalLinkAlt } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoCopy, IoShield, IoTrophy, IoFlash } from "react-icons/io5";

const projectsContent = {
  zh: {
    title: "项目展示",
    loading: "加载中...",
    copySuccess: "已复制",
    points: "积分",
    extraPoints: "额外积分",
    verifiedWallet: "合作钱包",
    verifiedProject: "已验证项目",
    interactionReward: "交互奖励",
  },
  en: {
    title: "Projects",
    loading: "Loading...",
    copySuccess: "Copied",
    points: "Points",
    extraPoints: "Extra Points",
    verifiedWallet: "Verified Wallet",
    verifiedProject: "Verified Project",
    interactionReward: "Interaction Reward",
  }
};

export default function Projects({ params }: { params: { lang: string } }) {
  const { i18n } = useTranslation();
  const [content] = useState(projectsContent[params.lang as keyof typeof projectsContent]);
  const [copyMsg, setCopyMsg] = useState("");

  useEffect(() => {
    i18n.changeLanguage(params.lang);
  }, [params.lang, i18n]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopyMsg(content.copySuccess);
    setTimeout(() => setCopyMsg(""), 2000);
  };

  const handleCustomAction = (action: string) => {
    switch (action) {
      case 'connectOKXWallet':
        // 实现OKX钱包连接逻辑
        console.log('Connecting to OKX wallet...');
        break;
      // 添加其他自定义动作
      default:
        console.log(`No handler for action: ${action}`);
    }
  };

  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'x':
        return <FaSquareXTwitter className="w-6 h-6" />;
      case 'discord':
        return <FaDiscord className="w-6 h-6" />;
      case 'telegram':
        return <FaTelegram className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const renderProjectCard = (project: Project) => (
    <div className="bg-white/90 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="px-6 pt-4 pb-1 relative">
        <div className="flex items-center justify-between mb-4">
          <img 
            src={project.logo}
            alt={project.name} 
            className={`object-contain ${project.imgClassName || 'h-12 w-auto'}`}
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {project.isVerified && (
                <div 
                  className="bg-green-100/50 p-1.5 rounded-full group relative"
                  title={content.verifiedProject}
                >
                  <IoShield className="w-4 h-4 text-green-600" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[60]">
                    {content.verifiedProject}
                  </div>
                </div>
              )}

              {project.pointsBonus && (
                <>
                  <div 
                    className="bg-green-100/50 p-1.5 rounded-full group relative"
                    title={content.interactionReward}
                  >
                    <IoTrophy className="w-4 h-4 text-green-600" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[60]">
                      {content.interactionReward}
                    </div>
                  </div>

                  {project.pointsBonus.hasExtraPoints && (
                    <div 
                      className="bg-green-100/50 p-1.5 rounded-full group relative"
                      title={content.extraPoints}
                    >
                      <IoFlash className="w-4 h-4 text-green-600" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[60]">
                        {content.extraPoints}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaExternalLinkAlt className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${tagConfig[tag].color}`}
            >
              {tagConfig[tag].name[i18n.language as 'en' | 'zh']}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-bold mb-2 text-gray-800">{project.name}</h3>
        {project.description && (
          <p className="text-sm text-gray-500 mb-4">
            {project.description[i18n.language as keyof typeof project.description]}
          </p>
        )}

        {project.contractAddress && (
          <div className="flex items-center space-x-2 mb-4 bg-gray-50 p-2 rounded">
            <code className="text-xs text-gray-500 flex-1 truncate">
              {project.contractAddress}
            </code>
            <button
              onClick={() => handleCopy(project.contractAddress!)}
              className="text-gray-400 hover:text-gray-600"
            >
              <IoCopy className="w-4 h-4" />
            </button>
          </div>
        )}

        {project.socials && project.socials.length > 0 && (
          <div className="flex items-center space-x-3 mb-4">
            {project.socials.map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-700 transition-colors duration-200"
              >
                {renderSocialIcon(social.platform)}
              </a>
            ))}
          </div>
        )}

        {project.buttons && project.buttons.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.buttons.map((button, index) => (
              button.link ? (
                <a
                  key={index}
                  href={button.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow h-10 bg-white text-black text-sm font-medium rounded-lg overflow-hidden group relative shadow-md hover:shadow-lg transition-shadow duration-300 inline-flex items-center justify-center"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-black via-gray-700 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-700 tracking-wide">
                    {button.text}
                  </span>
                </a>
              ) : (
                <button
                  key={index}
                  onClick={() => button.action && handleCustomAction(button.action)}
                  className="flex-grow h-10 bg-white text-black text-sm font-medium rounded-lg overflow-hidden group relative shadow-md hover:shadow-lg transition-shadow duration-300 inline-flex items-center justify-center"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-black via-gray-700 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-700 tracking-wide">
                    {button.text}
                  </span>
                </button>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full py-12 bg-gradient-to-b from-white/10 to-white/5">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          {content.title}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.map((project) => (
            <div key={project.id}>
              {renderProjectCard(project)}
            </div>
          ))}
        </div>

        {copyMsg && (
          <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow">
            {copyMsg}
          </div>
        )}
      </div>
    </div>
  );
} 