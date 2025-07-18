import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Temu Belajar - Kustom Inspira | Workshop, Seminar & Webinar Menjahit',
  description: 'Bergabunglah dalam workshop praktis, seminar inspiratif, dan webinar interaktif bersama komunitas penjahit dan desainer fashion terbaik di Indonesia.',
  keywords: [
    'workshop menjahit',
    'seminar fashion',
    'webinar menjahit',
    'komunitas penjahit',
    'event menjahit',
    'pelatihan menjahit',
    'temu belajar',
    'kustom inspira',
    'belajar menjahit bersama',
    'acara fashion'
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
    title: 'Temu Belajar - Kustom Inspira',
    description: 'Bergabunglah dalam workshop praktis, seminar inspiratif, dan webinar interaktif bersama komunitas penjahit dan desainer fashion terbaik.',
    url: '/temu-belajar',
    siteName: 'Kustom Inspira',
    images: [
      {
        url: '/assets/temubelajar.webp',
        width: 1200,
        height: 630,
        alt: 'Temu Belajar Kustom Inspira',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Temu Belajar - Kustom Inspira',
    description: 'Bergabunglah dalam workshop praktis, seminar inspiratif, dan webinar interaktif bersama komunitas penjahit dan desainer fashion terbaik.',
    images: ['/assets/temubelajar.webp'],
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
    canonical: '/temu-belajar',
  },
};

export default function TemuBelajarLayout({
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
            '@type': 'EventWebsite',
            name: 'Temu Belajar Kustom Inspira',
            description: 'Platform acara pembelajaran menjahit dengan workshop, seminar, dan webinar',
            url: 'https://kustominspira.com/temu-belajar',
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
              audienceType: 'People interested in sewing and fashion design events'
            },
            about: [
              {
                '@type': 'Thing',
                name: 'Sewing Workshops'
              },
              {
                '@type': 'Thing',
                name: 'Fashion Seminars'
              },
              {
                '@type': 'Thing',
                name: 'Online Webinars'
              }
            ],
            inLanguage: 'id-ID'
          })
        }}
      />
      {children}
    </>
  );
}