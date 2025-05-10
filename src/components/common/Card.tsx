interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export const Card = ({ children, className = '', gradient = true }: CardProps) => {
  const baseStyles = "rounded-xl shadow-xl overflow-hidden relative";
  
  // 更现代的科技感渐变背景
  const gradientStyles = gradient 
    ? "bg-[#0a1323] before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#10203a]/90 before:via-[#0d192b]/85 before:to-[#071019]/90 before:backdrop-blur-sm before:border before:border-[#2a4775]/15" 
    : "bg-black/30 backdrop-blur-sm border border-white/10";

  return (
    <div className={`${baseStyles} ${gradientStyles} ${className} group hover:translate-y-[-4px] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.6)] flex flex-col`}>
      {/* 科技感装饰元素 */}
      <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden z-0 pointer-events-none">
        <div className="absolute rotate-45 top-4 -right-10 w-[1px] h-20 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent group-hover:via-blue-400/60 transition-colors duration-300"></div>
        <div className="absolute rotate-45 top-6 -right-12 w-[1px] h-20 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent group-hover:via-cyan-400/40 transition-colors duration-300"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 overflow-hidden z-0 pointer-events-none">
        <div className="absolute rotate-45 -bottom-10 left-4 w-[1px] h-20 bg-gradient-to-t from-transparent via-blue-400/30 to-transparent group-hover:via-blue-400/60 transition-colors duration-300"></div>
        <div className="absolute rotate-45 -bottom-12 left-6 w-[1px] h-20 bg-gradient-to-t from-transparent via-cyan-400/20 to-transparent group-hover:via-cyan-400/40 transition-colors duration-300"></div>
      </div>
      
      {/* 右下角装饰点 */}
      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500/40 z-0 group-hover:bg-blue-500/70 transition-colors duration-300"></div>
      <div className="absolute bottom-2 right-6 w-1 h-1 rounded-full bg-cyan-500/30 z-0 group-hover:bg-cyan-500/60 transition-colors duration-300"></div>
      
      {/* 悬停时的发光边框效果 */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 z-0"></div>
      
      {/* 科技感网格覆盖 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(70,130,240,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(70,130,240,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 mix-blend-overlay z-0 group-hover:opacity-60 transition-opacity duration-500"></div>
      
      {/* 内容容器 - 确保文本不会溢出 */}
      <div className="relative z-10 flex-grow flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}; 