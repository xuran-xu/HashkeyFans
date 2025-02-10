"use client"

import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import Link from 'next/link';
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

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
  }, [i18n.language]);

  return (
    <div className="relative h-[calc(100vh-8rem)] flex items-center justify-center">
      <BackgroundH />
      <div className="container mx-auto text-center px-4 relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 font-sora text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.7)] tracking-wide">
          {content.slogan}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider">
          {content.description}
        </p>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-10">
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
      </div>
    </div>
  );
}; 