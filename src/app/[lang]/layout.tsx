import { Sora } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import ClientProvider from './client-provider'
import type { Metadata } from 'next'
import '../globals.css'
import { Footer } from '@/components/layout/Footer'
import { ReactNode } from 'react'
import { ParticleConnectkit } from '@/context'
import '@rainbow-me/rainbowkit/styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../globals.css';

const sora = Sora({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sora'
})

export const metadata: Metadata = {
  title: 'Hash Fans',
  description: 'HashKey Chain - Web3 Voyage, How Blockchain Shapes Humanity\'s Main Narrative',
  keywords: 'HashKey, Blockchain, Web3, Crypto, DeFi, NFT, DAO',
  authors: [{ name: 'Hash Fans' }],
  openGraph: {
    title: 'Hash Fans',
    description: 'Web3 Voyage, How Blockchain Shapes Humanity\'s Main Narrative',
    url: 'https://hashkey.com',
    siteName: 'Hash Fans',
    images: [
      {
        url: '/img/logo.png',
        width: 800,
        height: 800,
        alt: 'Hash Fans Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hash Fans',
    description: 'Web3 Voyage, How Blockchain Shapes Humanity\'s Main Narrative',
    creator: '@HashKeyHSK',
    images: ['/img/logo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/img/logo.png', type: 'image/png', sizes: '32x32' },
      { url: '/img/logo.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [
      { url: '/img/logo.png' },
      { url: '/img/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/img/logo.png',
      },
    ],
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#000000',
};

interface RootLayoutProps {
  children: ReactNode;
  params: {
    lang: string;
  };
}

export default function RootLayout({ children, params: { lang } }: RootLayoutProps) {
  console.log('RootLayout rendered with lang:', lang);

  return (
    <html lang={lang} className={`${sora.variable}`}>
      <head>
        <link rel="icon" href="/img/logo.png" />
        <link rel="apple-touch-icon" href="/img/logo.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`relative min-h-screen flex flex-col ${lang === 'en' ? 'font-sora' : 'font-noto'}`}>
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>        
        <div className="relative z-10 flex flex-col min-h-screen">
          <ClientProvider lang={lang}>
            <ParticleConnectkit >
              <div className='flex flex-col min-h-screen'>
                <Header />
                <main className="flex-1 flex flex-col">
                  {children}
                </main>
                <Footer />
              </div>
            </ParticleConnectkit>
          </ClientProvider>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'zh' }];
}
