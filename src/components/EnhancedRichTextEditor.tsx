'use client';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface EnhancedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function EnhancedRichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Write your content here...",
  className = '' 
}: EnhancedRichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      console.log('Starting article image upload for file:', file.name);
      
      // Create unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `article-images/${filename}`;
      
      console.log('Uploading to path:', filePath);
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      console.log('Upload completed:', uploadData);
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      console.log('Public URL obtained:', publicUrl);
      
      // Insert markdown image syntax
      const imageMarkdown = `\n\n![Image Description](${publicUrl})\n\n`;
      const newValue = value + imageMarkdown;
      onChange(newValue);
      
      return publicUrl;
    } catch (error) {
      console.error('Detailed article image upload error:', error);
      
      let errorMessage = 'Failed to upload image. ';
      if (error instanceof Error) {
        if (error.message.includes('storage')) {
          errorMessage += 'Storage not configured. Please enable Supabase Storage.';
        } else if (error.message.includes('network')) {
          errorMessage += 'Network error. Please check your connection.';
        } else if (error.message.includes('bucket')) {
          errorMessage += 'Storage bucket not found. Please create "images" bucket.';
        } else {
          errorMessage += error.message;
        }
      }
      
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    handleImageUpload(file);
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

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
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <button
          type="button"
          onClick={triggerImageUpload}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-[#1ca4bc] text-white rounded-md hover:bg-[#159bb3] transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Uploading...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add Image
            </>
          )}
        </button>
      </div>
      
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <MDEditor
          value={value}
          onChange={handleChange}
          preview="edit"
          hideToolbar={false}
          data-color-mode="light"
          height={400}
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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 <strong>Formatting tips:</strong></p>
        <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
          <li><code>**bold text**</code> for <strong>bold</strong></li>
          <li><code>*italic text*</code> for <em>italic</em></li>
          <li><code># Heading</code> for headings</li>
          <li><code>- item</code> for bullet points</li>
          <li><code>[link text](url)</code> for links</li>
          <li><code>![alt text](image-url)</code> for images</li>
          <li><strong>Click &quot;Add Image&quot; button</strong> to upload images directly</li>
        </ul>
      </div>
    </div>
  );
}