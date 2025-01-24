interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md'
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg transition-all duration-300";
  const variantStyles = {
    primary: "bg-gradient-to-br from-[#1a237e]/95 via-[#311b92]/90 to-[#4a148c]/85 text-white",
    secondary: "bg-white/10 text-white hover:bg-white/20"
  };
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
}; 