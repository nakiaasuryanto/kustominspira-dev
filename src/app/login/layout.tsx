import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login - Kustom Inspira',
  description: 'Login page for Kustom Inspira administrators',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}