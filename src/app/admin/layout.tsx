import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Kustom Inspira',
  description: 'Administrator dashboard for managing Kustom Inspira content',
  icons: {
    icon: '/assets/favicon.ico',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}