import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery - Kustom Inspira | Galeri Inspirasi Fashion & Kreativitas',
  description: 'Temukan inspirasi dari karya-karya terbaik komunitas Kustom Inspira. Galeri fashion, aksesori, dan kreativitas yang menginspirasi.',
  keywords: [
    'galeri fashion',
    'inspirasi menjahit',
    'karya fashion',
    'kreativitas menjahit',
    'galeri aksesori',
    'desain fashion',
    'kustom inspira gallery',
    'fashion inspiration',
    'handmade fashion',
    'indonesian fashion'
  ],
  icons: {
    icon: '/public/assets/favicon.ico',
  },
  authors: [{ name: 'Kustom Inspira' }],
  creator: 'Kustom Inspira',
  publisher: 'Kustom Inspira',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Gallery - Kustom Inspira',
    description: 'Temukan inspirasi dari karya-karya terbaik komunitas Kustom Inspira. Galeri fashion, aksesori, dan kreativitas yang menginspirasi.',
    url: '/gallery',
    siteName: 'Kustom Inspira',
    images: [
      {
        url: '/assets/kustominspira.webp',
        width: 1200,
        height: 630,
        alt: 'Gallery Kustom Inspira',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gallery - Kustom Inspira',
    description: 'Temukan inspirasi dari karya-karya terbaik komunitas Kustom Inspira. Galeri fashion, aksesori, dan kreativitas yang menginspirasi.',
    images: ['/assets/kustominspira.webp'],
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
    canonical: '/gallery',
  },
};

export default function GalleryLayout({
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
            '@type': 'ImageGallery',
            name: 'Gallery Kustom Inspira',
            description: 'Galeri inspirasi fashion dan kreativitas dari komunitas Kustom Inspira',
            url: 'https://kustominspira.com/gallery',
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
              audienceType: 'People interested in fashion design and creativity'
            },
            about: [
              {
                '@type': 'Thing',
                name: 'Fashion Design'
              },
              {
                '@type': 'Thing',
                name: 'Creative Inspiration'
              },
              {
                '@type': 'Thing',
                name: 'Handmade Fashion'
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