// @ts-nocheck
import { supabase } from './supabase';
import type { Article, Video, Event, Ebook, User } from './supabase';

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
      // Remove slug from the article data if it exists, since the database might not have this column
      const { slug: _, ...articleWithoutSlug } = article;
      
      const { data, error } = await supabase
        .from('articles')
        .insert([articleWithoutSlug])
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
      // Remove slug from updates if it exists, since the database might not have this column
      const { slug: _, ...updatesWithoutSlug } = updates;
      
      const { data, error } = await supabase
        .from('articles')
        .update({ ...updatesWithoutSlug, updated_at: new Date().toISOString() })
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
}

export const supabaseDataManager = SupabaseDataManager.getInstance();