"use client"

import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
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
    description: ""
  });

  useEffect(() => {
    setContent({
      slogan: t('home.slogan'),
      description: t('home.description')
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
        {/* DeFi和Staking按钮区域 */}
        <DeFiStakingButtons />
      </div>
    </div>
  );
};

const DeFiStakingButtons = () => {
  const [activeButton, setActiveButton] = useState<'defi' | 'staking' | null>(null);

  const handleDeFiClick = () => {
    setActiveButton(activeButton === 'defi' ? null : 'defi');
  };

  const handleStakingClick = () => {
    window.open('https://hskhodlium.xyz', '_blank');
  };

  const handleBackClick = () => {
    setActiveButton(null);
  };

  return (
    <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8 mb-8 md:mb-12">
      {activeButton === null ? (
        <>
          <Button 
            size="lg" 
            variant="primary" 
            onClick={handleDeFiClick}
            className="px-8 py-4 text-xl font-normal shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <Icon name="globe" className="w-6 h-6" />
              <span>DeFi</span>
            </div>
          </Button>
          
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={handleStakingClick}
            className="px-8 py-4 text-xl font-normal shadow-2xl hover:shadow-gray-500/50 transform hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <Icon name="ethereum" className="w-6 h-6" />
              <span>Staking</span>
            </div>
          </Button>
        </>
      ) : activeButton === 'defi' ? (
        <>
          <Button 
            size="lg" 
            variant="primary" 
            onClick={() => window.open('https://hyperindex.trade', '_blank')}
            className="px-6 py-3 text-lg font-normal shadow-xl hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <Icon name="grid" className="w-5 h-5" />
              <span>Dex</span>
            </div>
          </Button>
          
          <Button 
            size="lg" 
            variant="primary" 
            onClick={() => window.open('https://dev.hashprime.xyz/', '_blank')}
            className="px-6 py-3 text-lg font-normal shadow-xl hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <Icon name="wallet" className="w-5 h-5" />
              <span>Lending</span>
            </div>
          </Button>
          
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={handleBackClick}
            className="px-6 py-3 text-lg font-normal shadow-xl hover:shadow-gray-500/40 transform hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <Icon name="chevronLeft" className="w-5 h-5" />
              <span>返回</span>
            </div>
          </Button>
        </>
      ) : null}
    </div>
  );
}; 