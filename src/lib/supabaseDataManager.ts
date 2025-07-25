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
      
      // If featured column doesn't exist in database, add it from localStorage (client-side only)
      const articles = data || [];
      
      if (typeof window !== 'undefined') {
        const featuredArticles = JSON.parse(localStorage.getItem('featuredArticles') || '[]');
        return articles.map(article => ({
          ...article,
          featured: article.featured !== undefined ? article.featured : featuredArticles.includes(article.id)
        }));
      }
      
      return articles;
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
      
      // If featured column doesn't exist in database, add it from localStorage (client-side only)
      const articles = data || [];
      
      if (typeof window !== 'undefined') {
        const featuredArticles = JSON.parse(localStorage.getItem('featuredArticles') || '[]');
        return articles.map(article => ({
          ...article,
          featured: article.featured !== undefined ? article.featured : featuredArticles.includes(article.id)
        }));
      }
      
      return articles;
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
      console.log('Toggling article spotlight:', { id, featured });
      
      // First, try the proper database approach
      const { error: testError } = await supabase
        .from('articles')
        .select('id, featured')
        .eq('id', id)
        .single();

      // If the column doesn't exist, use localStorage fallback
      if (testError && testError.message.includes('column') && testError.message.includes('featured')) {
        console.log('Featured column does not exist, using localStorage fallback');
        
        if (typeof window !== 'undefined') {
          // Get current featured articles from localStorage
          const featuredArticles = JSON.parse(localStorage.getItem('featuredArticles') || '[]');
          
          if (featured) {
            // Remove all other featured articles
            localStorage.setItem('featuredArticles', JSON.stringify([id]));
          } else {
            // Remove this article from featured
            const filtered = featuredArticles.filter((featuredId: string) => featuredId !== id);
            localStorage.setItem('featuredArticles', JSON.stringify(filtered));
          }
        }
        
        // Get the article data without featured column
        const { data: articleData, error: articleError } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();
          
        if (articleError) throw articleError;
        
        // Add the featured property manually
        return {
          ...articleData,
          featured
        };
      }

      if (testError) {
        throw testError;
      }

      // If setting as featured, remove spotlight from other articles
      if (featured) {
        const { error: updateError } = await supabase
          .from('articles')
          .update({ featured: false })
          .neq('id', id);
        
        if (updateError) {
          console.error('Error removing spotlight from other articles:', updateError);
        }
      }

      const { data, error } = await supabase
        .from('articles')
        .update({ featured })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Detailed error toggling article spotlight:', error);
        throw error;
      }
      
      console.log('Successfully updated article spotlight:', data);
      return data;
    } catch (error) {
      console.error('Error toggling article spotlight:', error);
      alert(`Failed to toggle spotlight: ${error?.message || 'Unknown error'}`);
      return null;
    }
  }

  async toggleVideoSpotlight(id: string, featured: boolean): Promise<Video | null> {
    try {
      console.log('Toggling video spotlight:', { id, featured });
      
      // If setting as featured, remove spotlight from other videos
      if (featured) {
        const { error: updateError } = await supabase
          .from('videos')
          .update({ featured: false })
          .neq('id', id);
        
        if (updateError) {
          console.error('Error removing spotlight from other videos:', updateError);
        }
      }

      const { data, error } = await supabase
        .from('videos')
        .update({ featured })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Detailed error toggling video spotlight:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error toggling video spotlight:', error);
      if (error?.message?.includes('column') || error?.message?.includes('featured')) {
        alert('Spotlight feature requires database schema update. Please contact administrator.');
      }
      return null;
    }
  }

  async toggleEbookSpotlight(id: string, featured: boolean): Promise<Ebook | null> {
    try {
      console.log('Toggling ebook spotlight:', { id, featured });
      
      // If setting as featured, remove spotlight from other ebooks
      if (featured) {
        const { error: updateError } = await supabase
          .from('ebooks')
          .update({ featured: false })
          .neq('id', id);
        
        if (updateError) {
          console.error('Error removing spotlight from other ebooks:', updateError);
        }
      }

      const { data, error } = await supabase
        .from('ebooks')
        .update({ featured })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Detailed error toggling ebook spotlight:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error toggling ebook spotlight:', error);
      if (error?.message?.includes('column') || error?.message?.includes('featured')) {
        alert('Spotlight feature requires database schema update. Please contact administrator.');
      }
      return null;
    }
  }
}

export const supabaseDataManager = SupabaseDataManager.getInstance();