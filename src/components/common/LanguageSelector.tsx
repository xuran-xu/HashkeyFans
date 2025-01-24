import { Icon } from './Icon';
import { IoChevronDownOutline } from 'react-icons/io5';

interface LanguageSelectorProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (lang: string) => void;
}

const languages = [
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "en", name: "English", flag: "🇺🇸" },
];

export const LanguageSelector = ({ isOpen, onToggle, onSelect }: LanguageSelectorProps) => (
  <div className="relative">
    <button
      onClick={onToggle}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
    >
      <Icon name="language" />
      <IoChevronDownOutline className="w-4 h-4" />
    </button>
    {isOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-[#1a237e]/95 via-[#311b92]/90 to-[#4a148c]/85 rounded-lg shadow-lg py-1 z-10">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-all duration-200"
          >
            {lang.flag} {lang.name}
          </button>
        ))}
      </div>
    )}
  </div>
); 