"use client";

import { Fira_Code, Noto_Sans_SC } from 'next/font/google'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n';
import './globals.css'

const firaCode = Fira_Code({ subsets: ['latin'] })
const notoSansSC = Noto_Sans_SC({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${firaCode.className} ${notoSansSC.className}`}>
      <I18nextProvider i18n={i18n}>
        <body className="relative min-h-screen font-sans">
          <div 
            className="fixed inset-0 bg-cover bg-center bg-no-repeat blur-sm z-[-1]"
            style={{ backgroundImage: "url('/img/bg.png')" }}
          ></div>
          <div className="relative z-10">
            <Header />
            {children}
            <Footer />
          </div>
        </body>
      </I18nextProvider>
    </html>
  )
}
