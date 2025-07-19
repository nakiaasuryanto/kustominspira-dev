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

  // Enhanced markdown-to-HTML conversion with proper header parsing
  const formatContent = (text: string) => {
    if (!text) return '';
    
    let processed = text;
    
    // First, handle code blocks to preserve them
    const codeBlocks: string[] = [];
    processed = processed.replace(/```([\s\S]*?)```/g, (match, code) => {
      const index = codeBlocks.length;
      codeBlocks.push(`<pre class="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto mb-4 text-sm"><code>${code.trim()}</code></pre>`);
      return `__CODE_BLOCK_${index}__`;
    });
    
    // Handle inline code
    processed = processed.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-900 px-2 py-1 rounded text-sm">$1</code>');
    
    // Convert headers with proper styling
    processed = processed.replace(/^### (.*$)/gm, '<h3 class="text-2xl font-bold text-black mb-4 mt-8 border-l-4 border-orange-500 pl-4 bg-orange-50 py-2">$1</h3>');
    processed = processed.replace(/^## (.*$)/gm, '<h2 class="text-3xl font-bold text-black mb-6 mt-10 pb-2 border-b-2 border-gray-200">$1</h2>');
    processed = processed.replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold text-black mb-6 mt-8 text-center bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">$1</h1>');
    
    // Convert blockquotes
    processed = processed.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 mb-4 italic text-gray-800">$1</blockquote>');
    
    // Convert images with captions
    processed = processed.replace(/!\[(.*?)\]\((.*?)\)/g, '<figure class="mb-6"><img src="$2" alt="$1" class="w-full rounded-lg shadow-lg" /><figcaption class="text-sm text-gray-600 text-center mt-2 italic">$1</figcaption></figure>');
    
    // Convert links
    processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Convert ordered lists
    processed = processed.replace(/^\d+\. (.*$)/gm, '<li class="text-black mb-2 ml-4">$1</li>');
    processed = processed.replace(/(<li class="text-black mb-2 ml-4">[\s\S]*?<\/li>)/g, '<ol class="list-decimal list-inside mb-6 space-y-2 bg-gray-50 p-4 rounded-lg">$1</ol>');
    
    // Convert unordered lists
    processed = processed.replace(/^- (.*$)/gm, '<li class="text-black mb-2 flex items-start"><span class="text-orange-500 mr-2">•</span><span>$1</span></li>');
    processed = processed.replace(/(<li class="text-black mb-2 flex items-start">[\s\S]*?<\/li>)/g, '<ul class="mb-6 space-y-2 bg-gray-50 p-4 rounded-lg">$1</ul>');
    
    // Convert bold and italic
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-black bg-yellow-100 px-1 rounded">$1</strong>');
    processed = processed.replace(/\*(.*?)\*/g, '<em class="italic text-black">$1</em>');
    
    // Handle horizontal rules
    processed = processed.replace(/^---$/gm, '<hr class="my-8 border-t-2 border-gray-200" />');
    
    // Split into paragraphs and process
    const paragraphs = processed.split('\n\n');
    const formattedParagraphs = paragraphs.map(para => {
      para = para.trim();
      if (!para) return '';
      
      // Skip if already processed as header, list, blockquote, etc.
      if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<ol') || 
          para.startsWith('<blockquote') || para.startsWith('<figure') || 
          para.startsWith('<hr') || para.startsWith('<pre') ||
          para.includes('__CODE_BLOCK_')) {
        return para;
      }
      
      // Regular paragraph
      return `<p class="text-black mb-4 leading-relaxed text-lg">${para.replace(/\n/g, '<br>')}</p>`;
    });
    
    processed = formattedParagraphs.join('\n');
    
    // Restore code blocks
    codeBlocks.forEach((codeBlock, index) => {
      processed = processed.replace(`__CODE_BLOCK_${index}__`, codeBlock);
    });
    
    return processed;
  };

  return (
    <div 
      className={`prose prose-lg max-w-none text-black ${className}`}
      style={{ 
        color: '#000000 !important',
        '--tw-prose-body': '#000000',
        '--tw-prose-headings': '#000000',
        '--tw-prose-lead': '#000000',
        '--tw-prose-links': '#1ca4bc',
        '--tw-prose-bold': '#000000',
        '--tw-prose-counters': '#000000',
        '--tw-prose-bullets': '#000000',
        '--tw-prose-hr': '#e5e7eb',
        '--tw-prose-quotes': '#000000',
        '--tw-prose-quote-borders': '#1ca4bc',
        '--tw-prose-captions': '#6b7280',
        '--tw-prose-code': '#000000',
        '--tw-prose-pre-code': '#ffffff',
        '--tw-prose-pre-bg': '#374151',
        '--tw-prose-th-borders': '#d1d5db',
        '--tw-prose-td-borders': '#d1d5db'
      } as React.CSSProperties}
      dangerouslySetInnerHTML={{ __html: formatContent(content) }}
    />
  );
}