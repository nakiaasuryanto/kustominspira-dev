'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseDataManager as dataManager } from '@/lib/supabaseDataManager';
import ImageUpload from '@/components/SupabaseImageUpload';
import EnhancedRichTextEditor from '@/components/EnhancedRichTextEditor';

// Mock data storage (in production, this would be a database)
const initialData = {
  articles: [
    {
      id: 1,
      title: "Panduan Lengkap Menjahit untuk Pemula",
      category: "Tutorial",
      author: "Tim Kustom Inspira",
      read_time: "15 min",
      content: "Pelajari dasar-dasar menjahit dari nol hingga mahir...",
      image_url: "/assets/pusatbelajar.webp",
      status: "published",
      created_at: "2025-01-15"
    },
    {
      id: 2,
      title: "Teknik Pola Dasar Baju Wanita",
      category: "Pola",
      author: "Sarah Wijaya",
      read_time: "20 min",
      content: "Membuat pola dasar yang akurat adalah kunci sukses...",
      image_url: "/assets/temubelajar.webp",
      status: "published",
      created_at: "2025-01-14"
    }
  ],
  videos: [
    {
      id: 1,
      title: "Cara Menggunakan Mesin Jahit untuk Pemula",
      duration: "25:30",
      views: "15.2K",
      thumbnail_url: "/assets/pusatbelajar.webp",
      video_url: "https://youtube.com/watch?v=example",
      category: "Tutorial",
      status: "published",
      created_at: "2025-01-13"
    }
  ],
  events: [
    {
      id: 1,
      title: "Workshop Dasar Menjahit",
      date: "2025-01-15",
      time: "09:00 - 12:00",
      location: "Jakarta",
      category: "workshop",
      price: "Rp 150.000",
      spots: 20,
      description: "Workshop praktis untuk pemula",
      image_url: "/assets/temubelajar.webp",
      status: "upcoming"
    }
  ],
  ebooks: [
    {
      id: 1,
      title: "E-Book Pola Dasar Pakaian Wanita",
      description: "Koleksi lengkap pola dasar dari ukuran S hingga XXL",
      pages: "120 halaman",
      format: "PDF",
      size: "25 MB",
      download_count: 1250,
      file_url: "/ebooks/pola-dasar.pdf",
      status: "published"
    }
  ],
  gallery: [
    {
      id: 1,
      title: "Custom Batik Dress",
      category: "fashion",
      image_url: "/assets/kustominspira.webp",
      description: "Beautiful custom batik dress with modern touch",
      tags: ["batik", "dress", "fashion"],
      uploaded_at: "2025-01-12"
    }
  ]
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [data, setData] = useState(initialData);
  const router = useRouter();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
      if (isLoggedIn === 'true') {
        setIsAuthenticated(true);
        // Load data from dataManager (async)
        try {
          const [articles, videos, events, ebooks, gallery] = await Promise.all([
            dataManager.getAllArticles(),
            dataManager.getAllVideos(),
            dataManager.getAllEvents(),
            dataManager.getAllEbooks(),
            dataManager.getGalleryItems()
          ]);
          setData({ articles, videos, events, ebooks, gallery });
        } catch (error) {
          console.error('Error loading admin data:', error);
        }
      } else {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminEmail');
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
        case 'gallery':
          newItem = await dataManager.addGalleryItem(item);
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
        case 'gallery':
          result = await dataManager.updateGalleryItem(id, updatedItem);
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
        case 'gallery':
          success = await dataManager.deleteGalleryItem(id);
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
    { id: 'gallery', name: 'Gallery', icon: '🖼️' },
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
      case 'gallery':
        return <GalleryContent gallery={data.gallery} onAdd={(item) => addItem('gallery', item)} onUpdate={(id, item) => updateItem('gallery', id, item)} onDelete={(id) => deleteItem('gallery', id)} />;
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
                Welcome, Admin
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
function DashboardContent({ data }: { data: any }) {
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
        
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-pink-500">
          <div className="flex items-center">
            <div className="p-3 bg-pink-100 rounded-full">
              <span className="text-2xl">🖼️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Gallery</p>
              <p className="text-3xl font-bold text-gray-900">{data.gallery.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Articles</h3>
          <div className="space-y-3">
            {data.articles.slice(0, 3).map((article: any) => (
              <div key={article.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <img src={article.image} alt="" className="w-12 h-12 rounded-lg object-cover mr-3" />
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
            {data.events.slice(0, 3).map((event: any) => (
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
function ArticlesContent({ articles, onAdd, onUpdate, onDelete }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tutorial',
    author: 'Admin',
    read_time: '',
    content: '',
    image_url: '/assets/pusatbelajar.webp',
    status: 'published'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArticle) {
      onUpdate((editingArticle as any).id, { ...formData, updatedAt: new Date().toISOString().split('T')[0] });
      setEditingArticle(null);
    } else {
      onAdd({ ...formData, created_at: new Date().toISOString() });
    }
    setFormData({ title: '', category: 'Tutorial', author: 'Admin', read_time: '', content: '', excerpt: '', image_url: '/assets/pusatbelajar.webp', status: 'published' });
    setShowForm(false);
  };

  const handleEdit = (article: any) => {
    setFormData(article);
    setEditingArticle(article);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Articles Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingArticle(null);
            setFormData({ title: '', category: 'Tutorial', author: 'Admin', read_time: '', content: '', excerpt: '', image_url: '/assets/pusatbelajar.webp', status: 'published' });
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
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                  placeholder="Article title..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                >
                  <option>Tutorial</option>
                  <option>Tips</option>
                  <option>Pattern</option>
                  <option>Material</option>
                </select>
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
            
            {/* Enhanced Rich Text Editor with Image Upload */}
            <EnhancedRichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Write your article content here... Use markdown for formatting!"
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
            {articles.map((article: any) => (
              <div key={article.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <img src={article.image_url || article.image} alt="" className="w-16 h-16 rounded-lg object-cover mr-4" />
                  <div>
                    <h4 className="font-medium text-gray-900">{article.title}</h4>
                    <p className="text-sm text-gray-600">{article.status} • {article.category} • {article.read_time} • {article.created_at?.substring(0, 10)}</p>
                    <p className="text-sm text-gray-500 mt-1">By {article.author}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(article)}
                    className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDelete(article.id)}
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
function VideosContent({ videos, onAdd, onUpdate, onDelete }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    category: 'Tutorial',
    video_url: '',
    thumbnail_url: '/assets/pusatbelajar.webp',
    status: 'published'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVideo) {
      onUpdate((editingVideo as any).id, formData);
      setEditingVideo(null);
    } else {
      onAdd({ ...formData, views: '0', createdAt: new Date().toISOString().split('T')[0] });
    }
    setFormData({ title: '', duration: '', category: 'Tutorial', videoUrl: '', thumbnail: '/assets/pusatbelajar.webp', status: 'published' });
    setShowForm(false);
  };

  const handleEdit = (video: any) => {
    setFormData(video);
    setEditingVideo(video);
    setShowForm(true);
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
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                >
                  <option>Tutorial</option>
                  <option>Tips</option>
                  <option>Workshop</option>
                </select>
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
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
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
            {videos.map((video: any) => (
              <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="relative">
                  <img src={video.thumbnail} alt="" className="w-full h-48 object-cover" />
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
function EbooksContent({ ebooks, onAdd, onUpdate, onDelete }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingEbook, setEditingEbook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pages: '',
    format: 'PDF',
    size: '',
    fileUrl: '',
    status: 'published'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEbook) {
      onUpdate((editingEbook as any).id, formData);
      setEditingEbook(null);
    } else {
      onAdd({ ...formData, downloadCount: 0, uploadedAt: new Date().toISOString().split('T')[0] });
    }
    setFormData({ title: '', description: '', pages: '', format: 'PDF', size: '', fileUrl: '', status: 'published' });
    setShowForm(false);
  };

  const handleEdit = (ebook: any) => {
    setFormData(ebook);
    setEditingEbook(ebook);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">E-Books Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingEbook(null);
            setFormData({ title: '', description: '', pages: '', format: 'PDF', size: '', fileUrl: '', status: 'published' });
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
            {ebooks.map((ebook: any) => (
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
                    onClick={() => onDelete(ebook.id)}
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
function EventsContent({ events, onAdd, onUpdate, onDelete }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
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
      onUpdate((editingEvent as any).id, formData);
      setEditingEvent(null);
    } else {
      onAdd({ ...formData, created_at: new Date().toISOString() });
    }
    setFormData({ title: '', date: '', time: '', location: '', category: 'workshop', price: '', spots: '', description: '', image: '/assets/temubelajar.webp', status: 'upcoming' });
    setShowForm(false);
  };

  const handleEdit = (event: any) => {
    setFormData(event);
    setEditingEvent(event);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingEvent(null);
            setFormData({ title: '', date: '', time: '', location: '', category: 'workshop', price: '', spots: '', description: '', image: '/assets/temubelajar.webp', status: 'upcoming' });
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
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                >
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="webinar">Webinar</option>
                </select>
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
            {events.map((event: any) => (
              <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img src={event.image} alt="" className="w-full h-48 object-cover" />
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

// Gallery Management Component
function GalleryContent({ gallery, onAdd, onUpdate, onDelete }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'fashion',
    image_url: '/assets/kustominspira.webp',
    description: '',
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    if (editingItem) {
      onUpdate((editingItem as any).id, { ...formData, tags: tagsArray });
      setEditingItem(null);
    } else {
      onAdd({ ...formData, tags: tagsArray, uploadedAt: new Date().toISOString().split('T')[0] });
    }
    setFormData({ title: '', category: 'fashion', image: '/assets/kustominspira.webp', description: '', tags: '' });
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setFormData({ ...item, tags: item.tags?.join(', ') || '' });
    setEditingItem(item);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingItem(null);
            setFormData({ title: '', category: 'fashion', image: '/assets/kustominspira.webp', description: '', tags: '' });
          }}
          className="bg-[#1ca4bc] text-white px-6 py-2 rounded-lg hover:bg-[#159bb3] transition-colors"
        >
          {showForm ? 'Cancel' : 'Upload Images'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingItem ? 'Edit Gallery Item' : 'Upload New Image'}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
              >
                <option value="fashion">Fashion</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            
            {/* Gallery Image Upload */}
            <ImageUpload
              currentImage={formData.image_url}
              onImageUpload={(imageUrl) => setFormData({ ...formData, image_url: imageUrl })}
              folder="gallery"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-[#1ca4bc] text-gray-900"
                placeholder="batik, dress, fashion"
              />
            </div>
            <button
              type="submit"
              className="bg-[#1ca4bc] text-white px-6 py-2 rounded-lg hover:bg-[#159bb3] transition-colors"
            >
              {editingItem ? 'Update Item' : 'Upload Image'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery Items ({gallery.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gallery.map((item: any, index: number) => (
              <div key={item.id} className="group relative">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className={`relative overflow-hidden ${index % 4 === 0 ? 'h-64' : index % 4 === 1 ? 'h-48' : index % 4 === 2 ? 'h-72' : 'h-56'}`}>
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-white text-center">
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <span className="text-sm bg-[#1ca4bc] px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags?.map((tag: string, tagIndex: number) => (
                        <span key={tagIndex} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
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