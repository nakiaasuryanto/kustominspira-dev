'use client';
import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface SupabaseImageUploadProps {
  currentImage?: string;
  onImageUpload: (imageUrl: string) => void;
  folder: string; // 'articles', 'videos', 'events', 'gallery'
  className?: string;
}

export default function SupabaseImageUpload({ 
  currentImage, 
  onImageUpload, 
  folder, 
  className = '' 
}: SupabaseImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase Storage
    uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      console.log('Starting upload for file:', file.name);
      
      // Test Supabase connection first
      console.log('Testing Supabase connection...');
      console.log('Supabase client:', supabase);
      
      // Test if we can access storage
      try {
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        console.log('Available buckets:', buckets);
        if (bucketsError) {
          console.error('Error accessing buckets:', bucketsError);
        }
      } catch (bucketError) {
        console.error('Failed to list buckets:', bucketError);
      }
      
      // Create unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `${folder}/${filename}`;
      
      console.log('Uploading to path:', filePath);
      console.log('Using bucket: images');
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      console.log('Upload response:', { uploadData, uploadError });

      if (uploadError) {
        console.error('Upload error occurred:', uploadError);
        throw uploadError;
      }

      console.log('Upload completed:', uploadData);
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      console.log('Public URL obtained:', publicUrl);
      
      // Call parent callback
      onImageUpload(publicUrl);
      
      setPreview(publicUrl);
    } catch (error) {
      console.error('Detailed upload error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Error message:', error?.message);
      
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
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Cover Image
      </label>
      
      {/* Image Preview */}
      <div 
        onClick={handleClick}
        className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#1ca4bc] transition-colors cursor-pointer group"
      >
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <span className="text-white font-medium">Click to change image</span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400 group-hover:text-[#1ca4bc] transition-colors" 
              stroke="currentColor" 
              fill="none" 
              viewBox="0 0 48 48"
            >
              <path 
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                strokeWidth={2} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            <div className="mt-4">
              <p className="text-sm text-gray-600 group-hover:text-[#1ca4bc] transition-colors">
                Click to upload image
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
        )}
        
        {uploading && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <span className="text-sm">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
      
      {preview && (
        <p className="text-xs text-gray-500">
          ✅ Image uploaded successfully
        </p>
      )}
    </div>
  );
}