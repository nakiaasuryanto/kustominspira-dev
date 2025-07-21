// @ts-nocheck
import { supabase } from './supabase';
import type { Article, Video, Event, Ebook, User, GalleryItem } from './supabase';

export class SupabaseDataManager {
  private static instance: SupabaseDataManager;

  private constructor() {}

  public static getInstance(): SupabaseDataManager {
    if (!SupabaseDataManager.instance) {
      SupabaseDataManager.instance = new SupabaseDataManager();
    }
    return SupabaseDataManager.instance;
  }

  // Articles
  async getArticles(): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting articles:', error);
      return [];
    }
  }

  async getAllArticles(): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting all articles:', error);
      return [];
    }
  }

  async addArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<Article> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .insert([article])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding article:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Error message:', error?.message);
      throw error;
    }
  }

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating article:', error);
      return null;
    }
  }

  async deleteArticle(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting article:', error);
      return false;
    }
  }

  // Videos
  async getVideos(): Promise<Video[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting videos:', error);
      return [];
    }
  }

  async getAllVideos(): Promise<Video[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting all videos:', error);
      return [];
    }
  }

  async addVideo(video: Omit<Video, 'id' | 'created_at' | 'updated_at'>): Promise<Video> {
    try {
      console.log('Adding video with data:', video);
      const { data, error } = await supabase
        .from('videos')
        .insert([video])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error hint:', error.hint);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error adding video:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  async updateVideo(id: string, updates: Partial<Video>): Promise<Video | null> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating video:', error);
      return null;
    }
  }

  async deleteVideo(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
  }

  // Events
  async getEvents(): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'upcoming')
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  }

  async getAllEvents(): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting all events:', error);
      return [];
    }
  }

  async addEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([event])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating event:', error);
      return null;
    }
  }

  async deleteEvent(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  }

  // Ebooks
  async getEbooks(): Promise<Ebook[]> {
    try {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting ebooks:', error);
      return [];
    }
  }

  async getAllEbooks(): Promise<Ebook[]> {
    try {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting all ebooks:', error);
      return [];
    }
  }

  async addEbook(ebook: Omit<Ebook, 'id' | 'created_at' | 'updated_at'>): Promise<Ebook> {
    try {
      const { data, error } = await supabase
        .from('ebooks')
        .insert([ebook])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding ebook:', error);
      throw error;
    }
  }

  async updateEbook(id: string, updates: Partial<Ebook>): Promise<Ebook | null> {
    try {
      const { data, error } = await supabase
        .from('ebooks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating ebook:', error);
      return null;
    }
  }

  async deleteEbook(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ebooks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting ebook:', error);
      return false;
    }
  }

  // Users
  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, first_name, last_name, full_name, role, created_at, is_active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  async addUser(user: Omit<User, 'id' | 'created_at' | 'updated_at' | 'full_name'>): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select('id, username, first_name, last_name, full_name, role, created_at, is_active')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select('id, username, first_name, last_name, full_name, role, created_at, is_active')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Gallery Items
  async getGalleryItems(): Promise<GalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting gallery items:', error);
      return [];
    }
  }

  async getAllGalleryItems(): Promise<GalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting all gallery items:', error);
      return [];
    }
  }

  async addGalleryItem(item: Omit<GalleryItem, 'id' | 'uploaded_at'>): Promise<GalleryItem> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding gallery item:', error);
      throw error;
    }
  }

  async updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | null> {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating gallery item:', error);
      return null;
    }
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      return false;
    }
  }

  // Spotlight functionality
  async toggleArticleSpotlight(id: string, featured: boolean): Promise<Article | null> {
    try {
      // If setting as featured, remove spotlight from other articles
      if (featured) {
        await supabase
          .from('articles')
          .update({ featured: false })
          .neq('id', id);
      }

      const { data, error } = await supabase
        .from('articles')
        .update({ featured })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error toggling article spotlight:', error);
      return null;
    }
  }

  async toggleVideoSpotlight(id: string, featured: boolean): Promise<Video | null> {
    try {
      // If setting as featured, remove spotlight from other videos
      if (featured) {
        await supabase
          .from('videos')
          .update({ featured: false })
          .neq('id', id);
      }

      const { data, error } = await supabase
        .from('videos')
        .update({ featured })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error toggling video spotlight:', error);
      return null;
    }
  }

  async toggleEbookSpotlight(id: string, featured: boolean): Promise<Ebook | null> {
    try {
      // If setting as featured, remove spotlight from other ebooks
      if (featured) {
        await supabase
          .from('ebooks')
          .update({ featured: false })
          .neq('id', id);
      }

      const { data, error } = await supabase
        .from('ebooks')
        .update({ featured })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error toggling ebook spotlight:', error);
      return null;
    }
  }
}

export const supabaseDataManager = SupabaseDataManager.getInstance();