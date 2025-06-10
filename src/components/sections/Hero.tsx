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

    // Set canvas size
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr); // Scale for retina displays
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particle properties
    const particleCount = window.innerWidth < 768 ? 60 : 150;
    const connectionDistance = window.innerWidth < 768 ? 100 : 150;
    const particleSize = window.innerWidth < 768 ? 1.5 : 2;
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    const mouseRadius = 150;
    
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if ('touches' in e) {
        // Touch event
        if (e.touches.length > 0) {
          mouseX = e.touches[0].clientX - rect.left;
          mouseY = e.touches[0].clientY - rect.top;
        }
      } else {
        // Mouse event
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      }
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove, { passive: true });
    
    // Create particles
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      connectedTo: Particle[] = [];
      
      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * particleSize + 0.5;
        
        // Create futuristic colors
        const hue = Math.floor(Math.random() * 60) + 200; // Blue to purple range
        const saturation = Math.floor(Math.random() * 20) + 70; // High saturation
        const lightness = Math.floor(Math.random() * 20) + 50; // Medium lightness
        this.color = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.7)`;
      }
      
      update() {
        // Add mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouseRadius) {
          const force = (mouseRadius - dist) / mouseRadius;
          this.vx -= (dx / dist) * force * 0.2;
          this.vy -= (dy / dist) * force * 0.2;
        }
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges
        if (this.x < 0 || this.x > window.innerWidth) this.vx = -this.vx;
        if (this.y < 0 || this.y > window.innerHeight) this.vy = -this.vy;
        
        // Dampen velocity
        this.vx *= 0.99;
        this.vy *= 0.99;
        
        // Add small random movement for organic feel
        this.vx += (Math.random() - 0.5) * 0.05;
        this.vy += (Math.random() - 0.5) * 0.05;
      }
      
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      
      connectParticles(particles: Particle[]) {
        this.connectedTo = [];
        for (const particle of particles) {
          if (this === particle) continue;
          
          const dx = this.x - particle.x;
          const dy = this.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            this.connectedTo.push(particle);
            const opacity = 1 - (distance / connectionDistance);
            
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(100, 180, 255, ${opacity * 0.2})`;
            ctx!.lineWidth = opacity * 1.5;
            ctx!.moveTo(this.x, this.y);
            ctx!.lineTo(particle.x, particle.y);
            ctx!.stroke();
          }
        }
      }
    }
    
    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw glowing background
      const gradient = ctx.createRadialGradient(
        window.innerWidth / 2,
        window.innerHeight / 2,
        0,
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerWidth / 1.5
      );
      gradient.addColorStop(0, 'rgba(30, 40, 70, 0.2)');
      gradient.addColorStop(1, 'rgba(10, 20, 40, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Update and draw particles
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      
      // Connect particles
      for (const particle of particles) {
        particle.connectParticles(particles);
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 transition-opacity duration-500"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
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
    <div className="relative min-h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] flex items-center justify-center py-8 md:pt-8 md:py-0">
      <BackgroundH />
      <div className="container mx-auto text-center px-4 relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 font-sora text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.7)] tracking-wide">
          {content.slogan}
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-white font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider">
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
            <div className="absolute -left-2 top-10 w-1 h-20 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent blur-sm hidden md:block"></div>
            <div className="absolute -right-2 top-10 w-1 h-20 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent blur-sm hidden md:block"></div>
            
            <div className="relative">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8 text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.7)] inline-flex items-center">
                <div className="w-4 h-4 md:w-5 md:h-5 mr-2 relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-sm rotate-45"></div>
                  <div className="absolute inset-1 bg-blue-500/40 rounded-sm rotate-45"></div>
                </div>
                <span className="relative">
                  {t('events.current')}
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
                </span>
              </h2>
              
              <div className={`grid grid-cols-1 ${content.events.length === 1 ? 'md:grid-cols-1 max-w-lg mx-auto' : 'md:grid-cols-2'} gap-4 md:gap-6`}>
                {content.events.map((event) => (
                  <Link 
                    key={event.id} 
                    href={event.link}
                    className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-md border border-white/10 rounded-xl p-4 md:p-6 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group"
                  >
                    {/* 添加发光背景效果 */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    {/* 添加科技线条装饰 */}
                    <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden hidden md:block">
                      <div className="absolute rotate-45 top-5 -right-10 w-[2px] h-20 bg-gradient-to-b from-transparent via-blue-400/40 to-transparent"></div>
                      <div className="absolute rotate-45 top-8 -right-12 w-[1px] h-20 bg-gradient-to-b from-transparent via-purple-400/30 to-transparent"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 overflow-hidden hidden md:block">
                      <div className="absolute rotate-45 -bottom-10 left-5 w-[2px] h-20 bg-gradient-to-t from-transparent via-blue-400/40 to-transparent"></div>
                      <div className="absolute rotate-45 -bottom-12 left-8 w-[1px] h-20 bg-gradient-to-t from-transparent via-purple-400/30 to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-2 md:mb-3">
                        <h3 className="text-base md:text-lg lg:text-xl font-bold text-white group-hover:text-blue-400 transition-colors max-w-full group-hover:text-shadow-glow">
                          {event.title}
                        </h3>
                      </div>
                      <p className="text-gray-300 mb-3 md:mb-4 line-clamp-3 md:line-clamp-2 text-sm md:text-base">{event.description}</p>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs md:text-sm text-blue-100/80 bg-blue-900/50 border border-blue-500/20 px-2 py-1 rounded-md whitespace-nowrap flex items-center">
                          <div className="w-2 h-2 md:w-3 md:h-3 mr-1 relative">
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