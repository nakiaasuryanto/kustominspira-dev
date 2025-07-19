// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseDataManager as dataManager } from '@/lib/supabaseDataManager';
import ImageUpload from '@/components/SupabaseImageUpload';
import PowerfulMarkdownEditor from '@/components/PowerfulMarkdownEditor';
import { Article, Video, Event, Ebook } from '@/lib/supabase';
import SimpleUsersContent from '@/components/admin/SimpleUsersContent';

// Utility function to generate slug from title
const generateSlug = (title: string): string => {
  // Convert to lowercase and remove special characters
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();

  // Split into words
  const words = slug.split('-').filter(word => word.length > 0);
  
  // Take minimum 2 words, but if first 2 words are the same, take 3 words
  if (words.length >= 2) {
    if (words.length >= 3 && words[0] === words[1]) {
      return words.slice(0, 3).join('-');
    } else {
      return words.slice(0, 2).join('-');
    }
  }
  
  // If less than 2 words, return the whole slug
  return slug;
};

// Helper function to load data with refresh
const loadData = async () => {
  try {
    const [articles, videos, events, ebooks, users] = await Promise.all([
      dataManager.getAllArticles(),
      dataManager.getAllVideos(),
      dataManager.getAllEvents(),
      dataManager.getAllEbooks(),
      dataManager.getAllUsers()
    ]);
    return { articles, videos, events, ebooks, users };
  } catch (error) {
    console.error('Error in loadData:', error);
    // Return empty data if there's an error
    return { articles: [], videos: [], events: [], ebooks: [], users: [] };
  }
};

// Types for admin data
interface AdminData {
  articles: any[];
  videos: any[];
  events: any[];
  ebooks: any[];
  users: any[];
}

// Props interfaces for components
interface ContentProps<T> {
  onAdd: (item: Omit<T, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdate: (id: string, item: Partial<T>) => void;
  onDelete: (id: string) => void;
}

interface ArticlesContentProps extends ContentProps<Article> {
  articles: Article[];
}

interface VideosContentProps extends ContentProps<Video> {
  videos: Video[];
}

interface EbooksContentProps extends ContentProps<Ebook> {
  ebooks: Ebook[];
}

interface EventsContentProps extends ContentProps<Event> {
  events: Event[];
}

// interface UsersContentProps extends ContentProps<User> {
//   users: User[];
// }


// Mock data storage (in production, this would be a database)
const initialData: AdminData = {
  articles: [],
  videos: [],
  events: [],
  ebooks: [],
  users: []
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [data, setData] = useState<AdminData>(initialData);
  const [adminName, setAdminName] = useState('Admin');
  const router = useRouter();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log('Checking authentication...');
        const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
        console.log('isLoggedIn:', isLoggedIn);
        
        if (isLoggedIn === 'true') {
          console.log('User is authenticated');
          setIsAuthenticated(true);
          // Set admin name
          const name = localStorage.getItem('adminName') || localStorage.getItem('adminUsername') || 'Admin';
          setAdminName(name);
          console.log('Admin name set to:', name);
          
          // Load data in background (with timeout to prevent hanging)
          console.log('Starting to load admin data with timeout...');
          Promise.race([
            loadData(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
          ]).then(data => {
            console.log('Admin data loaded successfully:', data);
            setData(data);
          }).catch(error => {
            console.error('Error loading admin data (using empty data):', error);
            setData({ articles: [], videos: [], events: [], ebooks: [], users: [] });
          });
        } else {
          console.log('User not authenticated, redirecting to login');
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      }
    };

    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
      // Add small delay to ensure localStorage is available
      setTimeout(checkAuth, 100);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminName');
    router.push('/login');
  };

  const addItem = async (type: string, item: any) => {
    try {
      let newItem;
      switch(type) {
        case 'articles':
          newItem = await dataManager.addArticle(item);
          break;
        case 'videos':
          newItem = await dataManager.addVideo(item);
          break;
        case 'events':
          newItem = await dataManager.addEvent(item);
          break;
        case 'ebooks':
          newItem = await dataManager.addEbook(item);
          break;
        case 'users':
          newItem = await dataManager.addUser(item);
          break;
        default:
          return;
      }
      
      // Update local state
      setData(prev => ({
        ...prev,
        [type]: [...prev[type as keyof typeof prev], newItem]
      }));
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      // Show user-friendly error message
      alert(`Failed to add ${type}. Please check the console for details. Error: ${error?.message || 'Unknown error'}`);
    }
  };

  const updateItem = async (type: string, id: string, updatedItem: any) => {
    try {
      let result;
      switch(type) {
        case 'articles':
          result = await dataManager.updateArticle(id, updatedItem);
          break;
        case 'videos':
          result = await dataManager.updateVideo(id, updatedItem);
          break;
        case 'events':
          result = await dataManager.updateEvent(id, updatedItem);
          break;
        case 'ebooks':
          result = await dataManager.updateEbook(id, updatedItem);
          break;
        case 'users':
          result = await dataManager.updateUser(id, updatedItem);
          break;
        default:
          return;
      }
      
      if (result) {
        // Update local state
        setData(prev => ({
          ...prev,
          [type]: prev[type as keyof typeof prev].map((item: any) => 
            item.id === id ? result : item
          )
        }));
        // Refresh data to ensure consistency
        await loadData();
      }
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    }
  };

  const deleteItem = async (type: string, id: string) => {
    try {
      let success;
      switch(type) {
        case 'articles':
          success = await dataManager.deleteArticle(id);
          break;
        case 'videos':
          success = await dataManager.deleteVideo(id);
          break;
        case 'events':
          success = await dataManager.deleteEvent(id);
          break;
        case 'ebooks':
          success = await dataManager.deleteEbook(id);
          break;
        case 'users':
          success = await dataManager.deleteUser(id);
          break;
        default:
          return;
      }
      
      if (success) {
        // Update local state
        setData(prev => ({
          ...prev,
          [type]: prev[type as keyof typeof prev].filter((item: any) => item.id !== id)
        }));
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  // Don't render anything until authentication is checked
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ca4bc] mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'articles', name: 'Articles', icon: '📝' },
    { id: 'videos', name: 'Videos', icon: '🎥' },
    { id: 'ebooks', name: 'E-Books', icon: '📚' },
    { id: 'events', name: 'Events', icon: '📅' },
    { id: 'users', name: 'Users', icon: '👥' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent data={data} />;
      case 'articles':
        return <ArticlesContent articles={data.articles} onAdd={(item) => addItem('articles', item)} onUpdate={(id, item) => updateItem('articles', id, item)} onDelete={(id) => deleteItem('articles', id)} />;
      case 'videos':
        return <VideosContent videos={data.videos} onAdd={(item) => addItem('videos', item)} onUpdate={(id, item) => updateItem('videos', id, item)} onDelete={(id) => deleteItem('videos', id)} />;
      case 'ebooks':
        return <EbooksContent ebooks={data.ebooks} onAdd={(item) => addItem('ebooks', item)} onUpdate={(id, item) => updateItem('ebooks', id, item)} onDelete={(id) => deleteItem('ebooks', id)} />;
      case 'events':
        return <EventsContent events={data.events} onAdd={(item) => addItem('events', item)} onUpdate={(id, item) => updateItem('events', id, item)} onDelete={(id) => deleteItem('events', id)} />;
      case 'users':
        return <SimpleUsersContent users={data.users} onAdd={(item) => addItem('users', item)} onUpdate={(id, item) => updateItem('users', id, item)} onDelete={(id) => deleteItem('users', id)} />;
      default:
        return <DashboardContent data={data} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <div className="flex items-center">
              <img 
                src="/assets/Kustom Inspira.png" 
                alt="Kustom Inspira" 
                className="h-6 md:h-8 w-auto mr-2 md:mr-4"
              />
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="text-xs md:text-sm text-gray-500 hidden sm:block">
                Welcome, {adminName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg hover:bg-red-700 transition-colors text-xs md:text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Mobile Menu Button */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <span className="mr-2">☰</span>
            Menu
          </button>
        </div>

        {/* Sidebar */}
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white shadow-sm min-h-screen border-r border-gray-200`}>
          <div className="p-2 md:p-4">
            <ul className="space-y-1 md:space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false); // Close mobile menu after selection
                    }}
                    className={`w-full flex items-center px-3 md:px-4 py-2 md:py-3 text-left rounded-lg transition-colors text-sm md:text-base ${
                      activeTab === item.id
                        ? 'bg-[#1ca4bc] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2 md:mr-3 text-base md:text-lg">{item.icon}</span>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// Dashboard Overview Component
function DashboardContent({ data }: { data: AdminData }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      
      {/* Supabase Connection Status */}
      <div className="mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-3">
              <span className="text-green-600">✅</span>
            </div>
            <div>
              <h3 className="font-medium text-green-900">Supabase Connected</h3>
              <p className="text-sm text-green-700">Database and storage are running smoothly</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Articles</p>
              <p className="text-3xl font-bold text-gray-900">{data.articles.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">🎥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Videos</p>
              <p className="text-3xl font-bold text-gray-900">{data.videos.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Events</p>
              <p className="text-3xl font-bold text-gray-900">{data.events.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">E-Books</p>
              <p className="text-3xl font-bold text-gray-900">{data.ebooks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-indigo-500">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Users</p>
              <p className="text-3xl font-bold text-gray-900">{data.users.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Articles</h3>
          <div className="space-y-3">
            {data.articles.slice(0, 3).map((article: Article) => (
              <div key={article.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <img src={article.image_url} alt="" className="w-12 h-12 rounded-lg object-cover mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">{article.title}</h4>
                  <p className="text-sm text-gray-600">{article.category} • {article.read_time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {data.events.slice(0, 3).map((event: Event) => (
              <div key={event.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-[#1ca4bc] rounded-lg mr-3">
                  <span className="text-white text-sm font-bold">{new Date(event.date).getDate()}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600">{event.location} • {event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Articles Management Component
function ArticlesContent({ articles, onAdd, onUpdate, onDelete }: ArticlesContentProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categories, setCategories] = useState(['Tutorial', 'Tips', 'Pattern', 'Material']);
  const [newCategory, setNewCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Tutorial',
    author: 'Admin',
    read_time: '',
    content: '',
    excerpt: '',
    image_url: '/assets/pusatbelajar.webp',
    status: 'published'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArticle) {
      onUpdate(editingArticle.id!, { ...formData, updated_at: new Date().toISOString() });
      setEditingArticle(null);
    } else {
      onAdd(formData);
    }
    setFormData({ title: '', slug: '', category: 'Tutorial', author: 'Admin', read_time: '', content: '', excerpt: '', image_url: '/assets/pusatbelajar.webp', status: 'published' });
    setShowForm(false);
  };

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      slug: article.slug || generateSlug(article.title),
      category: article.category,
      author: article.author,
      read_time: article.read_time,
      content: article.content,
      excerpt: article.excerpt || '',
      image_url: article.image_url || '/assets/pusatbelajar.webp',
      status: article.status
    });
    setEditingArticle(article);
    setShowForm(true);
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setShowCategoryForm(false);
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    if (categories.length > 1) { // Keep at least one category
      setCategories(categories.filter(cat => cat !== categoryToRemove));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Articles Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingArticle(null);
            setFormData({ title: '', slug: '', category: 'Tutorial', author: 'Admin', read_time: '', content: '', excerpt: '', image_url: '/assets/pusatbelajar.webp', status: 'published' });
          }}
          className="bg-[#1ca4bc] text-white px-6 py-2 rounded-lg hover:bg-[#159bb3] transition-colors"
        >
          {showForm ? 'Cancel' : 'Add New Article'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingArticle ? 'Edit Article' : 'Create New Article'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setFormData({ 
                      ...formData, 
                      title: newTitle,
                      slug: newTitle ? generateSlug(newTitle) : ''
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  placeholder="Article title..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  placeholder="article-slug"
                  required
                />
                {formData.slug && (
                  <p className="text-xs text-gray-500 mt-1">
                    URL: /pusat-belajar/artikel/{formData.slug}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="flex gap-2">
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(!showCategoryForm)}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    title="Manage Categories"
                  >
                    +
                  </button>
                </div>
                
                {/* Category Management */}
                {showCategoryForm && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Manage Categories</h4>
                    
                    {/* Add New Category */}
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New category name..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                      />
                      <button
                        type="button"
                        onClick={addCategory}
                        className="px-3 py-2 bg-[#1ca4bc] text-white rounded hover:bg-[#159bb3] transition-colors text-sm"
                      >
                        Add
                      </button>
                    </div>
                    
                    {/* Existing Categories */}
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600">Existing categories:</p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                          <div key={cat} className="flex items-center gap-1 bg-white px-2 py-1 rounded border text-sm">
                            <span>{cat}</span>
                            {categories.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeCategory(cat)}
                                className="text-red-500 hover:text-red-700 ml-1"
                                title="Remove category"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
                <input
                  type="text"
                  value={formData.read_time}
                  onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  placeholder="15 min"
                  required
                />
              </div>
            </div>
            {/* Image Upload */}
            <ImageUpload
              currentImage={formData.image_url}
              onImageUpload={(imageUrl) => setFormData({ ...formData, image_url: imageUrl })}
              folder="articles"
            />
            
            {/* Powerful Markdown Editor with Enhanced Features */}
            <PowerfulMarkdownEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Tulis konten artikel Anda di sini... Gunakan markdown untuk formatting yang keren!"
            />
            
            {/* Excerpt Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt (Summary)</label>
              <textarea
                rows={3}
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                placeholder="Brief summary of the article (will be shown on the main page)..."
              ></textarea>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-[#1ca4bc] text-white px-6 py-2 rounded-lg hover:bg-[#159bb3] transition-colors"
              >
                {editingArticle ? 'Update Article' : 'Publish Article'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Articles ({articles.length})</h3>
          <div className="space-y-4">
            {articles.map((article: Article) => (
              <div key={article.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <img src={article.image_url || '/assets/pusatbelajar.webp'} alt="" className="w-16 h-16 rounded-lg object-cover mr-4" />
                  <div>
                    <h4 className="font-medium text-gray-900">{article.title}</h4>
                    <p className="text-sm text-gray-600">{article.status} • {article.category} • {article.read_time} • {article.created_at?.substring(0, 10)}</p>
                    <p className="text-sm text-gray-500 mt-1">By {article.author}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      // Use slug if available, otherwise use id
                      const urlParam = article.slug || article.id;
                      window.open(`/pusat-belajar/artikel/${urlParam}`, '_blank');
                    }}
                    className="text-green-600 hover:text-green-800 px-3 py-1 rounded-md hover:bg-green-50"
                    title="View article"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => handleEdit(article)}
                    className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => article.id && onDelete(article.id)}
                    className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Videos Management Component
function VideosContent({ videos, onAdd, onUpdate, onDelete }: VideosContentProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categories, setCategories] = useState(['Tutorial', 'Tips', 'Workshop']);
  const [newCategory, setNewCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    category: 'Tutorial',
    videoUrl: '',
    thumbnail: '/assets/pusatbelajar.webp',
    status: 'published'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVideo) {
      onUpdate(editingVideo.id!, formData);
      setEditingVideo(null);
    } else {
      onAdd({ ...formData, views: '0' });
    }
    setFormData({ title: '', duration: '', category: 'Tutorial', videoUrl: '', thumbnail: '/assets/pusatbelajar.webp', status: 'published' });
    setShowForm(false);
  };

  const handleEdit = (video: any) => {
    setFormData({
      title: video.title,
      duration: video.duration,
      category: video.category,
      videoUrl: video.videoUrl || '',
      thumbnail: video.thumbnail || '/assets/pusatbelajar.webp',
      status: video.status
    });
    setEditingVideo(video);
    setShowForm(true);
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setShowCategoryForm(false);
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    if (categories.length > 1) {
      setCategories(categories.filter(cat => cat !== categoryToRemove));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Videos Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingVideo(null);
            setFormData({ title: '', duration: '', category: 'Tutorial', videoUrl: '', thumbnail: '/assets/pusatbelajar.webp', status: 'published' });
          }}
          className="bg-[#1ca4bc] text-white px-6 py-2 rounded-lg hover:bg-[#159bb3] transition-colors"
        >
          {showForm ? 'Cancel' : 'Add New Video'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingVideo ? 'Edit Video' : 'Add New Video'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  placeholder="25:30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="flex gap-2">
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(!showCategoryForm)}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    title="Manage Categories"
                  >
                    +
                  </button>
                </div>
                
                {/* Category Management */}
                {showCategoryForm && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Manage Categories</h4>
                    
                    {/* Add New Category */}
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New category name..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                      />
                      <button
                        type="button"
                        onClick={addCategory}
                        className="px-3 py-2 bg-[#1ca4bc] text-white rounded hover:bg-[#159bb3] transition-colors text-sm"
                      >
                        Add
                      </button>
                    </div>
                    
                    {/* Existing Categories */}
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600">Existing categories:</p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                          <div key={cat} className="flex items-center gap-1 bg-white px-2 py-1 rounded border text-sm">
                            <span>{cat}</span>
                            {categories.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeCategory(cat)}
                                className="text-red-500 hover:text-red-700 ml-1"
                                title="Remove category"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Thumbnail Upload */}
            <ImageUpload
              currentImage={formData.thumbnail}
              onImageUpload={(imageUrl) => setFormData({ ...formData, thumbnail: imageUrl })}
              folder="videos"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                placeholder="https://youtube.com/watch?v=..."
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#1ca4bc] text-white px-6 py-2 rounded-lg hover:bg-[#159bb3] transition-colors"
            >
              {editingVideo ? 'Update Video' : 'Add Video'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Videos ({videos.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video: Video) => (
              <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="relative">
                  <img src={video.thumbnail || '/assets/pusatbelajar.webp'} alt="" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-4 border-l-gray-900 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{video.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{video.views} views • {video.category}</p>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(video)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(video.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// E-books Management Component
function EbooksContent({ ebooks, onAdd, onUpdate, onDelete }: EbooksContentProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categories, setCategories] = useState(['Panduan', 'Pattern', 'Tutorial', 'Reference']);
  const [newCategory, setNewCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Panduan',
    pages: '',
    format: 'PDF',
    size: '',
    fileUrl: '',
    status: 'published'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEbook) {
      onUpdate(editingEbook.id!, formData);
      setEditingEbook(null);
    } else {
      onAdd({ ...formData, downloadCount: 0 });
    }
    setFormData({ title: '', description: '', category: 'Panduan', pages: '', format: 'PDF', size: '', fileUrl: '', status: 'published' });
    setShowForm(false);
  };

  const handleEdit = (ebook: any) => {
    setFormData({
      ...ebook,
      category: ebook.category || 'Panduan'
    });
    setEditingEbook(ebook);
    setShowForm(true);
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setShowCategoryForm(false);
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    if (categories.length > 1) {
      setCategories(categories.filter(cat => cat !== categoryToRemove));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">E-Books Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingEbook(null);
            setFormData({ title: '', description: '', category: 'Panduan', pages: '', format: 'PDF', size: '', fileUrl: '', status: 'published' });
          }}
          className="bg-[#1ca4bc] text-white px-6 py-2 rounded-lg hover:bg-[#159bb3] transition-colors"
        >
          {showForm ? 'Cancel' : 'Upload New E-Book'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingEbook ? 'Edit E-Book' : 'Upload New E-Book'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="flex gap-2">
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(!showCategoryForm)}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Manage Categories"
                >
                  +
                </button>
              </div>
              
              {/* Category Management */}
              {showCategoryForm && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Manage Categories</h4>
                  
                  {/* Add New Category */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="New category name..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                    />
                    <button
                      type="button"
                      onClick={addCategory}
                      className="px-3 py-2 bg-[#1ca4bc] text-white rounded hover:bg-[#159bb3] transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Existing Categories */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">Existing categories:</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <div key={cat} className="flex items-center gap-1 bg-white px-2 py-1 rounded border text-sm">
                          <span>{cat}</span>
                          {categories.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCategory(cat)}
                              className="text-red-500 hover:text-red-700 ml-1"
                              title="Remove category"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pages</label>
                <input
                  type="text"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  placeholder="120 halaman"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <select 
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                >
                  <option>PDF</option>
                  <option>EPUB</option>
                  <option>DOCX</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Size</label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  placeholder="25 MB"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">File URL</label>
              <input
                type="text"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                placeholder="/ebooks/filename.pdf"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#1ca4bc] text-white px-6 py-2 rounded-lg hover:bg-[#159bb3] transition-colors"
            >
              {editingEbook ? 'Update E-Book' : 'Upload E-Book'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All E-Books ({ebooks.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ebooks.map((ebook: Ebook) => (
              <div key={ebook.id} className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6">
                <div className="w-16 h-16 bg-[#1ca4bc] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{ebook.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{ebook.description}</p>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Pages:</span>
                    <span>{ebook.pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span>{ebook.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{ebook.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Downloads:</span>
                    <span>{ebook.downloadCount || 0}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(ebook)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => ebook.id && onDelete(ebook.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Events Management Component
function EventsContent({ events, onAdd, onUpdate, onDelete }: EventsContentProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categories, setCategories] = useState(['workshop', 'seminar', 'webinar', 'bootcamp']);
  const [newCategory, setNewCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    category: 'workshop',
    price: '',
    spots: '',
    description: '',
    image_url: '/assets/temubelajar.webp',
    status: 'upcoming'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      onUpdate(editingEvent.id!, formData);
      setEditingEvent(null);
    } else {
      onAdd(formData);
    }
    setFormData({ title: '', date: '', time: '', location: '', category: 'workshop', price: '', spots: '', description: '', image_url: '/assets/temubelajar.webp', status: 'upcoming' });
    setShowForm(false);
  };

  const handleEdit = (event: any) => {
    setFormData(event);
    setEditingEvent(event);
    setShowForm(true);
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setShowCategoryForm(false);
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    if (categories.length > 1) {
      setCategories(categories.filter(cat => cat !== categoryToRemove));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingEvent(null);
            setFormData({ title: '', date: '', time: '', location: '', category: 'workshop', price: '', spots: '', description: '', image_url: '/assets/temubelajar.webp', status: 'upcoming' });
          }}
          className="bg-[#1ca4bc] text-white px-6 py-2 rounded-lg hover:bg-[#159bb3] transition-colors"
        >
          {showForm ? 'Cancel' : 'Create New Event'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  placeholder="09:00 - 12:00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="flex gap-2">
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(!showCategoryForm)}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    title="Manage Categories"
                  >
                    +
                  </button>
                </div>
                
                {/* Category Management */}
                {showCategoryForm && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Manage Categories</h4>
                    
                    {/* Add New Category */}
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New category name..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                      />
                      <button
                        type="button"
                        onClick={addCategory}
                        className="px-3 py-2 bg-[#1ca4bc] text-white rounded hover:bg-[#159bb3] transition-colors text-sm"
                      >
                        Add
                      </button>
                    </div>
                    
                    {/* Existing Categories */}
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600">Existing categories:</p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                          <div key={cat} className="flex items-center gap-1 bg-white px-2 py-1 rounded border text-sm">
                            <span>{cat}</span>
                            {categories.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeCategory(cat)}
                                className="text-red-500 hover:text-red-700 ml-1"
                                title="Remove category"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  placeholder="Rp 150.000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Spots</label>
                <input
                  type="number"
                  value={formData.spots}
                  onChange={(e) => setFormData({ ...formData, spots: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  required
                />
              </div>
            </div>
            
            {/* Event Image Upload */}
            <ImageUpload
              currentImage={formData.image_url}
              onImageUpload={(imageUrl) => setFormData({ ...formData, image_url: imageUrl })}
              folder="events"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-[#1ca4bc] text-white px-6 py-2 rounded-lg hover:bg-[#159bb3] transition-colors"
            >
              {editingEvent ? 'Update Event' : 'Create Event'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Events ({events.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: Event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img src={event.image_url} alt="" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.category === 'workshop' ? 'bg-blue-100 text-blue-600' :
                      event.category === 'seminar' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </span>
                    <span className="text-[#FF4B00] font-semibold">{event.price}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <div>📅 {event.date}</div>
                    <div>🕒 {event.time}</div>
                    <div>📍 {event.location}</div>
                    <div>👥 {event.spots} spots available</div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(event)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(event.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

