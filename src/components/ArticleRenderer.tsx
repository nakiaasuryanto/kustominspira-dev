'use client';
import { useState, useEffect } from 'react';

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

  // Simple markdown-to-HTML conversion
  const formatContent = (text: string) => {
    if (!text) return '';
    
    return text
      // Convert headers
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold text-black mb-4 mt-6">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-black mb-4 mt-6">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-black mb-4 mt-6">$1</h1>')
      // Convert line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      // Convert bullet points
      .replace(/^- (.*$)/gm, '<li class="text-black mb-2">$1</li>')
      .replace(/(<li.*<\/li>)/g, '<ul class="list-disc list-inside mb-4 space-y-2">$1</ul>')
      // Convert bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-black">$1</strong>')
      // Convert italic
      .replace(/\*(.*?)\*/g, '<em class="italic text-black">$1</em>')
      // Wrap in paragraphs
      .replace(/^(?!<[h|u|l])/gm, '<p class="text-black mb-4 leading-relaxed">')
      .replace(/(?<!>)$/gm, '</p>')
      // Clean up extra paragraph tags
      .replace(/<p[^>]*><\/p>/g, '')
      .replace(/<p[^>]*>(<[h|u])/g, '$1')
      .replace(/(<\/[h|u]>)<\/p>/g, '$1');
  };

  return (
    <div 
      className={`prose prose-lg max-w-none ${className}`}
      style={{ 
        color: 'black !important',
        '--tw-prose-body': 'black',
        '--tw-prose-headings': 'black',
        '--tw-prose-lead': 'black',
        '--tw-prose-links': 'black',
        '--tw-prose-bold': 'black',
        '--tw-prose-counters': 'black',
        '--tw-prose-bullets': 'black',
        '--tw-prose-hr': 'black',
        '--tw-prose-quotes': 'black',
        '--tw-prose-quote-borders': 'black',
        '--tw-prose-captions': 'black',
        '--tw-prose-code': 'black',
        '--tw-prose-pre-code': 'black',
        '--tw-prose-pre-bg': 'black',
        '--tw-prose-th-borders': 'black',
        '--tw-prose-td-borders': 'black'
      } as React.CSSProperties}
      dangerouslySetInnerHTML={{ __html: formatContent(content) }}
    />
  );
}