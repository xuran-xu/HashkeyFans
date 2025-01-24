import Link from 'next/link';
import { Icon } from './Icon';

interface NavLinkProps {
  href: string;
  icon: "calendar" | "news" | "grid";
  text: string;
}

export const NavLink = ({ href, icon, text }: NavLinkProps) => (
  <Link 
    href={href} 
    className="flex items-center space-x-2 text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
  >
    <Icon name={icon} />
    <span>{text}</span>
  </Link>
); 