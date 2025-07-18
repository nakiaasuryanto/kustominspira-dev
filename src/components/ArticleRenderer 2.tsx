'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MDPreview = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  { ssr: false }
);

interface ArticleRendererProps {
  content: string;
  className?: string;
}

export default function ArticleRenderer({ content, className = '' }: ArticleRendererProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`prose max-w-none ${className}`}>
        <p>Loading content...</p>
      </div>
    );
  }

  return (
    <div className={`prose prose-lg max-w-none ${className}`} data-color-mode="light">
      <MDPreview source={content || ''} />
    </div>
  );
}