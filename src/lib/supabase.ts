import { createClient } from '@supabase/supabase-js'

// Your Supabase project credentials
const supabaseUrl = 'https://urgwvqsubzrbqoptfelj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZ3d2cXN1YnpyYnFvcHRmZWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NTMzMzAsImV4cCI6MjA2ODIyOTMzMH0.nwahP7JsVCSNHv6KJyPK34d7d1QYPcPy6jWKbtlJ5C4'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Article {
  id?: string;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  category: string;
  tags?: string[];
  seo_tags?: string[];
  meta_description?: string;
  meta_keywords?: string;
  author: string;
  image_url?: string;
  image?: string;
  read_time?: string;
  status: 'draft' | 'published' | 'archived';
  views?: number;
  likes?: number;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  featured?: boolean;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration?: string;
  materials_needed?: string[];
  tools_required?: string[];
}

export interface Video {
  id?: string;
  title: string;
  duration: string;
  category: string;
  videoUrl?: string;
  video_url?: string; // snake_case alternative
  thumbnail?: string;
  views?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface Ebook {
  [key: string]: any;
}

export interface User {
  id?: string;
  username: string;
  password_hash?: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  role: 'admin' | 'writer';
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface Event {
  [key: string]: any;
}

export interface Ebook {
  id?: string;
  title: string;
  description: string;
  category?: string;
  pages: string;
  format: string;
  size: string;
  download_count?: number;
  file_url?: string;
  status: string;
  created_at?: string;
}

export interface GalleryItem {
  id?: string;
  title: string;
  category: string;
  image_url: string;
  description: string;
  tags?: string[];
  uploaded_at?: string;
  height?: string;
}