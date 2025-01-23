"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里添加订阅逻辑
    console.log("Subscribed:", email);
    setEmail("");
  };

  if (!isClient) {
    return null; // 或者返回一个加载指示器
  }

  return (
    <div className="py-20 bg-gradient-to-b bg-white/5">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.7)] tracking-wide">
          {t("Subscribe to Our Newsletter")}
        </h2>
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("Enter your email")}
            className="flex-grow px-4 py-3 rounded-l-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
            required
          />
          <button type="submit" className="w-40 bg-white text-black font-semibold text-lg rounded-r-lg overflow-hidden group relative shadow-md hover:shadow-lg transition-all duration-300">
            <span className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 opacity-0 group-hover:opacity-80 transition-all duration-1000 ease-in-out transform scale-105 group-hover:scale-100"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-700 tracking-wide">
              {t("Subscribe")}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
