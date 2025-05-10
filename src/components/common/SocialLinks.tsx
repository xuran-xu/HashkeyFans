import { Icon } from './Icon';

interface SocialLinksProps {
  className?: string;
}

export const SocialLinks = ({ className = '' }: SocialLinksProps) => (
  <>
    <a href="https://t.me/HashKeyChainHSK" className={`text-white hover:text-white transition-colors duration-200 ${className}`}>
      <Icon name="telegram" className="text-white" />
    </a>
    <a href="https://discord.gg/qvPkbrYY" className={`text-white hover:text-white transition-colors duration-200 ${className}`}>
      <Icon name="discord" className="text-white" />
    </a>
    <a href="https://x.com/HashKeyHSK" className={`text-white hover:text-white transition-colors duration-200 ${className}`}>
      <Icon name="twitter" className="text-white" />
    </a>
  </>
); 