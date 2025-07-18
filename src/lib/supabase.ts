import { createClient } from '@supabase/supabase-js'

// Your Supabase project credentials
const supabaseUrl = 'https://urgwvqsubzrbqoptfelj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZ3d2cXN1YnpyYnFvcHRmZWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NTMzMzAsImV4cCI6MjA2ODIyOTMzMH0.nwahP7JsVCSNHv6KJyPK34d7d1QYPcPy6jWKbtlJ5C4'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Article {
  [key: string]: any;
}

export interface Video {
  [key: string]: any;
}

export interface Ebook {
  [key: string]: any;
}

export interface Event {
  [key: string]: any;
}

export interface Ebook {
  id?: string;
  title: string;
  description: string;
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