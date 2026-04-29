import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500'],
})

const SITE_URL = 'https://cafezistacoffee.com'
const SITE_NAME = 'Cafezista'
const SITE_DESCRIPTION =
  'Specialty coffee, roasted in London. Coffee from our family farm in Cerrado Mineiro and the world\u2019s most expressive single origins. Subscribe & save 15%.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Cafezista \u2014 Coffee from seed to table',
    template: '%s \u2014 Cafezista',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'specialty coffee',
    'London coffee roaster',
    'Brazilian coffee',
    'single origin coffee',
    'coffee subscription',
    'wholesale coffee London',
    'Cerrado Mineiro',
    'direct trade coffee',
    'Cafezista',
  ],
  authors: [{ name: 'Cafezista', url: SITE_URL }],
  creator: 'Cafezista',
  publisher: 'Cafezista',
  category: 'Food & Drink',
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Cafezista \u2014 Coffee from seed to table',
    description: SITE_DESCRIPTION,
    images: [
      { url: '/og.jpg', width: 1200, height: 630, alt: 'Cafezista \u2014 specialty coffee roasted in London' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cafezista \u2014 Coffee from seed to table',
    description: SITE_DESCRIPTION,
    images: ['/og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: { icon: '/favicon.ico' },
  formatDetection: { email: false, address: false, telephone: false },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Cafezista',
  url: SITE_URL,
  logo: SITE_URL + '/logo.png',
  description: SITE_DESCRIPTION,
  email: 'Brew@cafezistacoffee.com',
  sameAs: ['https://instagram.com/cafezista'],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fraunces.variable + ' ' + inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
