import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pusat Belajar - Kustom Inspira | Tutorial Menjahit & Panduan Lengkap',
  description: 'Belajar menjahit dari nol hingga mahir dengan tutorial video, artikel panduan, dan e-book gratis. Platform pembelajaran menjahit terlengkap di Indonesia.',
  keywords: [
    'belajar menjahit',
    'tutorial menjahit',
    'panduan menjahit',
    'kursus menjahit online',
    'video tutorial menjahit',
    'e-book menjahit',
    'pola baju',
    'teknik menjahit',
    'kustom inspira',
    'menjahit pemula'
  ],
  authors: [{ name: 'Kustom Inspira' }],
  creator: 'Kustom Inspira',
  publisher: 'Kustom Inspira',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Pusat Belajar - Kustom Inspira',
    description: 'Belajar menjahit dari nol hingga mahir dengan tutorial video, artikel panduan, dan e-book gratis.',
    url: '/pusat-belajar',
    siteName: 'Kustom Inspira',
    images: [
      {
        url: '/assets/pusatbelajar.webp',
        width: 1200,
        height: 630,
        alt: 'Pusat Belajar Kustom Inspira',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pusat Belajar - Kustom Inspira',
    description: 'Belajar menjahit dari nol hingga mahir dengan tutorial video, artikel panduan, dan e-book gratis.',
    images: ['/assets/pusatbelajar.webp'],
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
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: '/pusat-belajar',
  },
};

export default function PusatBelajarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalWebsite',
            name: 'Pusat Belajar Kustom Inspira',
            description: 'Platform pembelajaran menjahit online dengan tutorial video, artikel, dan e-book gratis',
            url: 'https://kustominspira.com/pusat-belajar',
            provider: {
              '@type': 'Organization',
              name: 'Kustom Inspira',
              url: 'https://kustominspira.com',
              logo: 'https://kustominspira.com/assets/Kustom Inspira - putih.png',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+62-851-7311-2499',
                contactType: 'customer service',
                email: 'kustompedia@gmail.com'
              }
            },
            audience: {
              '@type': 'Audience',
              audienceType: 'People interested in sewing and fashion design'
            },
            educationalLevel: 'Beginner to Advanced',
            teaches: [
              'Basic sewing techniques',
              'Pattern making',
              'Fashion design',
              'Garment construction',
              'Fabric selection'
            ],
            inLanguage: 'id-ID',
            about: [
              {
                '@type': 'Thing',
                name: 'Sewing'
              },
              {
                '@type': 'Thing',
                name: 'Fashion Design'
              },
              {
                '@type': 'Thing',
                name: 'Pattern Making'
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}