interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export const Card = ({ children, className = '', gradient = true }: CardProps) => {
  const baseStyles = "rounded-lg shadow-lg overflow-hidden";
  const gradientStyles = gradient 
    ? "bg-gradient-to-br from-[#1a237e]/95 via-[#311b92]/90 to-[#4a148c]/85 backdrop-blur-sm" 
    : "bg-white/10";

  return (
    <div className={`${baseStyles} ${gradientStyles} ${className}`}>
      {children}
    </div>
  );
}; 