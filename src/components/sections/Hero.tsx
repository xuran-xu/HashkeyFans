"use client"

import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import Link from 'next/link';
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

// 添加事件类型定义
interface Event {
  id: number;
  title: string;
  description: string;
  link: string;
  date: string;
}

const BackgroundH = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const drawH = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const h = canvas.height * 0.7;
      const w = h * 0.8;
      const thickness = h * 0.15;
      const x = (canvas.width - w) / 2;
      const y = (canvas.height - h) / 2;

      // Create 3D effect with multiple layers
      const layers = 30;
      const layerSpacing = 1.5;
      const shadowBlur = 40;

      // Draw shadow first
      ctx.shadowColor = 'rgba(255, 255, 255, 0.15)';
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw each layer from back to front
      for (let i = layers; i >= 0; i--) {
        const depth = i * layerSpacing;
        const opacity = 0.01 + (i / layers) * 0.04;
        
        const gradient = ctx.createLinearGradient(
          x - depth, 
          y - depth, 
          x + w + depth, 
          y + h + depth
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.5})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity * 0.5})`);

        ctx.fillStyle = gradient;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
        ctx.lineWidth = 0.5;

        // Left vertical bar
        ctx.beginPath();
        ctx.rect(
          x - depth, 
          y - depth, 
          thickness, 
          h
        );
        ctx.fill();
        if (i % 3 === 0) ctx.stroke();

        // Right vertical bar
        ctx.beginPath();
        ctx.rect(
          x + w - thickness - depth, 
          y - depth, 
          thickness, 
          h
        );
        ctx.fill();
        if (i % 3 === 0) ctx.stroke();

        // Horizontal bar
        ctx.beginPath();
        ctx.rect(
          x - depth, 
          y + (h - thickness) / 2 - depth, 
          w, 
          thickness
        );
        ctx.fill();
        if (i % 3 === 0) ctx.stroke();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const rotateX = -(e.clientY - centerY) / 30;
      const rotateY = (e.clientX - centerX) / 30;
      const translateZ = Math.abs(rotateX + rotateY) * 2;

      container.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateZ(${translateZ}px)
      `;
    };

    drawH();
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 hidden md:block transition-transform duration-100 ease-out"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ 
          zIndex: 0,
          backfaceVisibility: 'hidden'
        }}
      />
    </div>
  );
};

export const Hero = () => {
  const { i18n, t } = useTranslation();
  const [content, setContent] = useState({
    slogan: "",
    description: "",
    buttonJoin: { text: "", link: "" },
    buttonReview: { text: "", link: "" },
    events: [] as Event[]  // 指定类型为 Event[]
  });

  useEffect(() => {
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
      },
      events: (t('home.events', { returnObjects: true }) || []) as Event[]  // 类型断言
    });
  }, [i18n.language, t]);

  return (
    <div className="relative h-[calc(100vh-8rem)] flex items-center justify-center pt-8 md:pt-0">
      <BackgroundH />
      <div className="container mx-auto text-center px-4 relative z-10 mt-8 md:mt-0">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 font-sora text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.7)] tracking-wide">
          {content.slogan}
        </h1>
        <p className="text-xl md:text-2xl mb-6 md:mb-8 text-white font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider">
          {content.description}
        </p>
        <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-10 mb-8 md:mb-12">
          <Button size="lg" variant="primary">
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
        
        {/* 事件展示区域 */}
        {content.events && content.events.length > 0 && (
          <div className="mt-8 md:mt-12 max-w-4xl mx-auto relative">
            {/* 科技感背景装饰 */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm"></div>
            <div className="absolute -left-2 top-10 w-1 h-20 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent blur-sm"></div>
            <div className="absolute -right-2 top-10 w-1 h-20 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent blur-sm"></div>
            
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.7)] inline-flex items-center">
                <div className="w-5 h-5 mr-2 relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-sm rotate-45"></div>
                  <div className="absolute inset-1 bg-blue-500/40 rounded-sm rotate-45"></div>
                </div>
                <span className="relative">
                  {t('events.current')}
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
                </span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {content.events.map((event) => (
                  <Link 
                    key={event.id} 
                    href={event.link}
                    className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-md border border-white/10 rounded-xl p-4 md:p-6 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group"
                  >
                    {/* 添加发光背景效果 */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    {/* 添加科技线条装饰 */}
                    <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                      <div className="absolute rotate-45 top-5 -right-10 w-[2px] h-20 bg-gradient-to-b from-transparent via-blue-400/40 to-transparent"></div>
                      <div className="absolute rotate-45 top-8 -right-12 w-[1px] h-20 bg-gradient-to-b from-transparent via-purple-400/30 to-transparent"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 overflow-hidden">
                      <div className="absolute rotate-45 -bottom-10 left-5 w-[2px] h-20 bg-gradient-to-t from-transparent via-blue-400/40 to-transparent"></div>
                      <div className="absolute rotate-45 -bottom-12 left-8 w-[1px] h-20 bg-gradient-to-t from-transparent via-purple-400/30 to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-2 md:mb-3">
                        <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate max-w-[100%] group-hover:text-shadow-glow">
                          {event.title}
                        </h3>
                      </div>
                      <p className="text-gray-300 mb-3 md:mb-4 line-clamp-2 h-10 md:h-12 text-sm md:text-base">{event.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-blue-100/80 bg-blue-900/50 border border-blue-500/20 px-2 py-1 rounded-md whitespace-nowrap flex items-center">
                          <div className="w-3 h-3 mr-1 relative">
                            <div className="absolute inset-0 bg-blue-500/30 rounded-full"></div>
                          </div>
                          {event.date}
                        </span>
                        <span className="text-blue-400 flex items-center text-xs md:text-sm font-medium group-hover:translate-x-1 transition-transform">
                          {t('common.readMore')} 
                          <div className="relative ml-1 flex items-center">
                            <Icon name="chevronRight" className="w-3 h-3 md:w-4 md:h-4 relative z-10" />
                            <div className="absolute inset-0 bg-blue-400/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 