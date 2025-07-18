'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Write your content here...",
  className = '' 
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (val?: string) => {
    onChange(val || '');
  };

  if (!mounted) {
    return (
      <div className={`space-y-3 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <p className="text-gray-500">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Content
      </label>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <MDEditor
          value={value}
          onChange={handleChange}
          preview="edit"
          hideToolbar={false}
          data-color-mode="light"
          height={300}
          textareaProps={{
            placeholder: placeholder,
            style: {
              fontSize: 14,
              lineHeight: 1.5,
              fontFamily: 'inherit',
            },
          }}
        />
      </div>
      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 <strong>Formatting tips:</strong></p>
        <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
          <li><code>**bold text**</code> for <strong>bold</strong></li>
          <li><code>*italic text*</code> for <em>italic</em></li>
          <li><code># Heading</code> for headings</li>
          <li><code>- item</code> for bullet points</li>
          <li><code>[link text](url)</code> for links</li>
        </ul>
      </div>
    </div>
  );
}