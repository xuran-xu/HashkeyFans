import { Inter, Noto_Sans_SC } from 'next/font/google'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ClientProvider from './client-provider'
import type { Metadata } from 'next'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })
const notoSansSC = Noto_Sans_SC({ subsets: ['latin'] })

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

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang={lang} className={`${inter.className} ${notoSansSC.className}`}>
      <head>
        <link rel="icon" href="/img/logo.png" />
        <link rel="apple-touch-icon" href="/img/logo.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="relative min-h-screen font-sans flex flex-col">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="fixed inset-0 opacity-30 bg-[url('/img/noise.png')] mix-blend-soft-light"></div>
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <ClientProvider lang={lang}>
            <Header />
            <div className="min-w-screen flex-grow flex justify-center">
              {children}
            </div>
            <Footer />
          </ClientProvider>
        </div>
      </body>
    </html>
  )
}
