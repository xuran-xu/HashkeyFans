"use client";

import { Inter, Noto_Sans_SC } from 'next/font/google'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

import '../globals.css'

const inter = Inter({ subsets: ['latin'] })
const notoSansSC = Noto_Sans_SC({ subsets: ['latin'] })

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return (
    <I18nextProvider i18n={i18n}>
      <html lang={lang} className={`${inter.className} ${notoSansSC.className}`}>
        <body className="relative min-h-screen font-sans flex flex-col">
          {/* 渐变背景层 */}
          <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
          {/* 纹理遮罩层 */}
          <div className="fixed inset-0 opacity-30 bg-[url('/img/noise.png')] mix-blend-soft-light"></div>
          
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <div className="min-w-screen flex-grow flex justify-center">
              {children}
            </div>
            <Footer />
          </div>
        </body>
      </html>
    </I18nextProvider>
  )
}
