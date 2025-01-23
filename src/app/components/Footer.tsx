"use client"

import { useTranslation } from "react-i18next";
import { FaTelegram, FaDiscord, FaTwitter } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Footer() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // 或者返回一个加载占位符
  }

  return (
    <footer className="bg-gradient-to-b from-black/5 to-black/10 text-black py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-center md:text-left mb-4 md:mb-0">
            &copy; 2024 Hashkey Chain Fans. {t("All rights reserved.")}
          </p>
          <div className="flex space-x-6">
            <a href="https://t.me/HashKeyChainHSK" className="text-white hover:text-blue-500 transition-colors duration-200">
              <FaTelegram className="w-6 h-6" />
            </a>
            <a href="https://discord.gg/qvPkbrYY" className="text-white hover:text-indigo-500 transition-colors duration-200">
              <FaDiscord className="w-6 h-6" />
            </a>
            <a href="https://x.com/HashKeyHSK" className="text-white hover:text-gray-300 transition-colors duration-200">
              <FaTwitter className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
