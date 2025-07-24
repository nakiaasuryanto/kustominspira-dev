'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabaseDataManager as dataManager } from '@/lib/supabaseDataManager';
import { GalleryItem } from '@/lib/supabase';

export default function Gallery() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedImage) return;

      switch (event.key) {
        case 'Escape':
          setSelectedImage(null);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
          if (filteredItems[prevIndex]) {
            setSelectedImage(filteredItems[prevIndex]);
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          const currentIndexRight = filteredItems.findIndex(item => item.id === selectedImage.id);
          const nextIndex = currentIndexRight < filteredItems.length - 1 ? currentIndexRight + 1 : 0;
          if (filteredItems[nextIndex]) {
            setSelectedImage(filteredItems[nextIndex]);
          }
          break;
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Update URL with item parameter
      const newUrl = `${window.location.pathname}?item=${selectedImage.id}`;
      window.history.replaceState({}, '', newUrl);
    } else {
      document.body.style.overflow = 'unset';
      
      // Remove item parameter from URL when modal is closed
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, filteredItems]);

  useEffect(() => {
    // Load fresh data on component mount
    const loadData = async () => {
      try {
        setLoading(true);
        try {
          const galleryData = await dataManager.getGalleryItems();
          setGalleryItems(galleryData || []);
          
          // Check if there's a specific item to open from URL
          const urlParams = new URLSearchParams(window.location.search);
          const itemId = urlParams.get('item');
          if (itemId && galleryData) {
            const item = galleryData.find(item => item.id === itemId);
            if (item) {
              // Open the specific item in modal after a short delay to ensure UI is ready
              setTimeout(() => {
                setSelectedImage(item);
              }, 500);
            }
          }
        } catch (error) {
          console.error('Error loading gallery:', error);
          setGalleryItems([]);
        }
      } catch (error) {
        console.error('Error loading gallery:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter items based on category and search
  useEffect(() => {
    let filtered = galleryItems;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }
    
    setFilteredItems(filtered);
  }, [galleryItems, selectedCategory, searchQuery]);

  const categories = [
    { id: 'all', name: 'All Designs', count: galleryItems.length },
    { id: 'fashion', name: 'Fashion', count: galleryItems.filter(item => item.category === 'fashion').length },
    { id: 'accessories', name: 'Accessories', count: galleryItems.filter(item => item.category === 'accessories').length },
    { id: 'traditional', name: 'Traditional', count: galleryItems.filter(item => item.category === 'traditional').length },
    { id: 'modern', name: 'Modern', count: galleryItems.filter(item => item.category === 'modern').length },
    { id: 'sustainable', name: 'Sustainable', count: galleryItems.filter(item => item.category === 'sustainable').length }
  ];

  // Handle like functionality
  const handleLike = (itemId: string) => {
    if (likedItems.has(itemId)) {
      // Unlike
      setLikedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      setLikeCounts(prev => ({
        ...prev,
        [itemId]: Math.max(0, (prev[itemId] || 10) - 1)
      }));
    } else {
      // Like
      setLikedItems(prev => new Set([...prev, itemId]));
      setLikeCounts(prev => ({
        ...prev,
        [itemId]: (prev[itemId] || 10) + 1
      }));
    }
  };

  // Handle share functionality with debouncing
  const [isSharing, setIsSharing] = useState(false);
  
  const handleShare = async (item: GalleryItem) => {
    // Prevent multiple simultaneous share operations
    if (isSharing) return;
    
    setIsSharing(true);
    
    const shareData = {
      title: `${item.title} - Kustom Inspira Gallery`,
      text: item.description,
      url: `${window.location.origin}/gallery/${item.id}`
    };

    const shareText = `🎨 ${shareData.title}\n\n${shareData.text}\n\n🔗 View in Gallery: ${shareData.url}\n\n#KustomInspira #FashionDesign #Indonesian`;

    try {
      // Try native Web Share API first
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard with better error handling
        try {
          await navigator.clipboard.writeText(shareText);
          // Use a more subtle notification
          const notification = document.createElement('div');
          notification.textContent = '✅ Link copied to clipboard!';
          notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
          `;
          
          // Add animation styles
          const style = document.createElement('style');
          style.textContent = `
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `;
          document.head.appendChild(style);
          document.body.appendChild(notification);
          
          // Remove notification after 3 seconds
          setTimeout(() => {
            notification.remove();
            style.remove();
          }, 3000);
        } catch (clipboardError) {
          console.error('Clipboard error:', clipboardError);
          
          // Final fallback - create a temporary textarea for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = shareText;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          try {
            document.execCommand('copy');
            alert('Link copied to clipboard!');
          } catch (execError) {
            console.error('All copy methods failed:', execError);
            // Show the text in a prompt as last resort
            prompt('Copy this link manually:', shareText);
          } finally {
            document.body.removeChild(textArea);
          }
        }
      }
    } catch (error) {
      console.error('Share error:', error);
      
      // If native share fails, try clipboard as fallback
      if (error instanceof Error && (error.name === 'InvalidStateError' || error.name === 'NotAllowedError')) {
        try {
          const textArea = document.createElement('textarea');
          textArea.value = shareText;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('Link copied to clipboard!');
        } catch (fallbackError) {
          console.error('Fallback share failed:', fallbackError);
          prompt('Copy this link manually:', shareText);
        }
      }
    } finally {
      // Reset sharing state after a short delay
      setTimeout(() => setIsSharing(false), 1000);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1ca4bc] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Fixed Navigation */}
        <nav className="fixed top-0 w-full z-50 flex justify-between items-center p-4 md:p-6 text-gray-900 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/" className="h-8 md:h-12">
              <img 
                src="/assets/Kustom Inspira.png" 
                alt="Kustom Inspira Logo - Indonesian Fashion Design Platform"
                className="h-full w-auto"
              />
            </Link>
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">Fashion Gallery</h1>
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 flex flex-col justify-center items-center hover:scale-110 transition-transform"
          >
            <div className="w-4 h-px bg-gray-900 mb-1"></div>
            <div className="w-4 h-px bg-gray-900 mb-1"></div>
            <div className="w-4 h-px bg-gray-900"></div>
          </button>
        </nav>

        {/* Fullscreen Menu with Left & Right Sections */}
        <div className={`fixed inset-0 z-50 transform transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Background */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
          </div>

          {/* Content Grid */}
          <div className="relative z-10 h-full flex">
            {/* Left Section - Navigation */}
            <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16">
              {/* Close Button */}
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-6 right-6 md:top-8 md:right-8 w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Logo */}
              <div className="mb-16">
                <img 
                  src="/assets/Kustom Inspira - putih.png" 
                  alt="Kustom Inspira" 
                  className="h-12 md:h-16 w-auto"
                />
              </div>

              {/* Navigation */}
              <nav className="space-y-6 md:space-y-8">
                <Link 
                  href="/" 
                  className="block text-4xl md:text-6xl lg:text-7xl font-black text-white hover:text-[#1ca4bc] transition-all duration-300 transform hover:translate-x-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  HOME
                </Link>
                <Link 
                  href="/pusat-belajar" 
                  className="block text-4xl md:text-6xl lg:text-7xl font-black text-white hover:text-[#1ca4bc] transition-all duration-300 transform hover:translate-x-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  PUSAT BELAJAR
                </Link>
                <Link 
                  href="/temu-belajar" 
                  className="block text-4xl md:text-6xl lg:text-7xl font-black text-white hover:text-[#1ca4bc] transition-all duration-300 transform hover:translate-x-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  TEMU BELAJAR
                </Link>
                <Link 
                  href="/gallery" 
                  className="block text-4xl md:text-6xl lg:text-7xl font-black text-[#1ca4bc] transform translate-x-4 duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  GALLERY
                </Link>
                <a 
                  href="https://kustompedia.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-4xl md:text-6xl lg:text-7xl font-black text-white hover:text-[#1ca4bc] transition-all duration-300 transform hover:translate-x-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  KUSTOMPEDIA
                </a>
              </nav>
            </div>

            {/* Right Section - Contact & Info */}
            <div className="hidden md:flex w-1/2 flex-col justify-center p-16 bg-white/5 backdrop-blur-sm border-l border-white/10">
              <div className="space-y-8">
                {/* Contact */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">#DariKainJadiKarya</h3>
                  <div className="space-y-3 text-white/80">
                    <p className="text-lg">Hubungi Kami:</p>
                    <p>Jl. Sidosermo Indah Gg. III No. 37</p>
                    <p>Surabaya, 60239</p>
                    <p className="font-semibold">+62 (851) 7311-2499</p>
                    <a 
                      href="mailto:kustompedia@gmail.com" 
                      className="text-[#1ca4bc] hover:text-white transition-colors"
                    >
                      kustompedia@gmail.com
                    </a>
                  </div>
                </div>

                {/* Ecosystem */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Part of Kustompedia</h3>
                  
                  {/* Logos Grid - 2x2 */}
                  <div className="grid grid-cols-2 gap-4 max-w-xs">
                    {/* Row 1 */}
                    <div className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors">
                      <img 
                        src="/assets/Kustom Inspira - putih.png" 
                        alt="Kustom Inspira" 
                        className="h-12 w-auto mx-auto object-contain filter brightness-0 invert"
                      />
                    </div>
                    <a 
                      href="https://kustomgarment.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <img 
                        src="/assets/KG.png" 
                        alt="Kustom Garment" 
                        className="h-12 w-auto mx-auto object-contain"
                      />
                    </a>
                    
                    {/* Row 2 */}
                    <a 
                      href="https://kustomproject.id" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <img 
                        src="/assets/KP.png" 
                        alt="Kustom Project" 
                        className="h-12 w-auto mx-auto object-contain"
                      />
                    </a>
                    <a 
                      href="https://care.kustompedia.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <img 
                        src="/assets/KC.png" 
                        alt="Kustom Care" 
                        className="h-12 w-auto mx-auto object-contain"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <section className="pt-20 md:pt-24 pb-8 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search designs, styles, or materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1ca4bc] focus:border-transparent text-gray-900 placeholder-gray-500 shadow-sm text-sm md:text-base"
              />
              <svg className="absolute left-3 md:left-4 top-3.5 md:top-4.5 w-4 md:w-5 h-4 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 md:px-4 py-2 rounded-full font-medium text-xs md:text-sm transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-[#1ca4bc] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Content */}
        <div className="py-8 md:py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            {filteredItems.length === 0 ? (
              /* Empty State with Beautiful Design */
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  {/* Artistic Icon */}
                  <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#1ca4bc]/10 to-[#159bb3]/20 rounded-full flex items-center justify-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#1ca4bc] to-[#159bb3] rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-4 left-8 w-4 h-4 bg-[#1ca4bc]/20 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-8 right-4 w-6 h-6 bg-[#159bb3]/30 rounded-full animate-pulse delay-500"></div>
                    <div className="absolute top-12 right-12 w-3 h-3 bg-[#1ca4bc]/40 rounded-full animate-pulse delay-1000"></div>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {searchQuery || selectedCategory !== 'all' ? 'No matches found' : 'Your Gallery Awaits'}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    {searchQuery || selectedCategory !== 'all' 
                      ? 'Try adjusting your search or filters to find what you\'re looking for.'
                      : 'This space is ready for your amazing creations. Upload your first design to get started!'
                    }
                  </p>
                  
                  {/* Call to Action */}
                  {!searchQuery && selectedCategory === 'all' && (
                    <div className="space-y-4">
                      <button className="bg-gradient-to-r from-[#1ca4bc] to-[#159bb3] text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold text-lg">
                        Add Your First Design
                      </button>
                      <p className="text-sm text-gray-500">
                        or manage your gallery through the admin dashboard
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Gallery Grid with Hover Effects */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <div key={item.id} className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => setSelectedImage(item)}>
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Click to view indicator */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3">
                          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                      
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </div>
                      
                      {/* Hover Overlay with Details */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-xl font-bold mb-2 line-clamp-2">{item.title}</h3>
                          <p className="text-sm opacity-90 mb-4 line-clamp-3">{item.description}</p>
                          
                          {/* Tags */}
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {item.tags.slice(0, 3).map((tag, index) => (
                                <span 
                                  key={index} 
                                  className="px-2 py-1 bg-[#1ca4bc]/80 backdrop-blur-sm rounded-full text-xs font-medium"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {item.tags.length > 3 && (
                                <span className="px-2 py-1 bg-gray-600/80 backdrop-blur-sm rounded-full text-xs font-medium">
                                  +{item.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                          
                          {/* Action Buttons */}
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-3">
                              <button 
                                onClick={() => handleLike(item.id!)}
                                className={`flex items-center space-x-2 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-300 ${
                                  likedItems.has(item.id!) 
                                    ? 'bg-red-500/80 hover:bg-red-600/80 text-white shadow-lg' 
                                    : 'bg-white/20 hover:bg-white/30 text-white'
                                }`}
                              >
                                <svg className={`w-4 h-4 transition-all duration-300 ${likedItems.has(item.id!) ? 'fill-current scale-110' : ''}`} fill={likedItems.has(item.id!) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="text-sm font-medium">
                                  {likeCounts[item.id!] || 10}
                                </span>
                              </button>
                              <button 
                                onClick={() => handleShare(item)}
                                disabled={isSharing}
                                className={`flex items-center space-x-2 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors ${
                                  isSharing 
                                    ? 'bg-gray-400/50 cursor-not-allowed' 
                                    : 'bg-white/20 hover:bg-white/30'
                                }`}
                              >
                                {isSharing ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                  </svg>
                                )}
                                <span className="text-sm font-medium">
                                  {isSharing ? 'Sharing...' : 'Share'}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Info (Always Visible) */}
                    <div className="p-4">
                      <Link href={`/gallery/${item.id}`} className="block">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 hover:text-[#1ca4bc] transition-colors">{item.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image Popup Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-2 md:p-4" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-4xl max-h-[95vh] md:max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-8 md:-top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
                aria-label="Close modal"
              >
                <svg className="w-6 md:w-8 h-6 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image Container */}
              <div className="relative bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[60vh] md:max-h-[70vh] object-contain"
                />
                
                {/* Image Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 md:p-6 text-white">
                  <div className="max-w-2xl">
                    <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">{selectedImage.title}</h3>
                    <p className="text-gray-200 mb-2 md:mb-4 text-sm md:text-base">{selectedImage.description}</p>
                    
                    {/* Category and Tags */}
                    <div className="flex items-center flex-wrap gap-2 md:gap-3">
                      <span className="px-2 md:px-3 py-1 bg-[#1ca4bc] rounded-full text-xs md:text-sm font-medium">
                        {selectedImage.category.charAt(0).toUpperCase() + selectedImage.category.slice(1)}
                      </span>
                      {selectedImage.tags && selectedImage.tags.slice(0, 4).map((tag, index) => (
                        <span key={index} className="px-2 md:px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs md:text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-3 md:mt-6 gap-3 md:gap-0">
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(selectedImage.id!);
                        }}
                        className={`flex items-center space-x-1 md:space-x-2 backdrop-blur-sm px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 text-sm md:text-base ${
                          likedItems.has(selectedImage.id!) 
                            ? 'bg-red-500/80 hover:bg-red-600/80 text-white shadow-lg' 
                            : 'bg-white/20 hover:bg-white/30 text-white'
                        }`}
                      >
                        <svg className={`w-4 md:w-5 h-4 md:h-5 transition-all duration-300 ${likedItems.has(selectedImage.id!) ? 'fill-current scale-110' : ''}`} fill={likedItems.has(selectedImage.id!) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="font-medium">
                          {likeCounts[selectedImage.id!] || 10} Likes
                        </span>
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(selectedImage);
                        }}
                        disabled={isSharing}
                        className={`flex items-center space-x-1 md:space-x-2 backdrop-blur-sm px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl transition-colors text-sm md:text-base ${
                          isSharing 
                            ? 'bg-gray-400/50 cursor-not-allowed' 
                            : 'bg-white/20 hover:bg-white/30'
                        }`}
                      >
                        {isSharing ? (
                          <div className="w-4 md:w-5 h-4 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        )}
                        <span className="font-medium">
                          {isSharing ? 'Sharing...' : 'Share'}
                        </span>
                      </button>
                      
                      {/* View Details Button */}
                      <Link 
                        href={`/gallery/${selectedImage.id}`}
                        className="flex items-center space-x-1 md:space-x-2 bg-[#1ca4bc]/80 hover:bg-[#1ca4bc] text-white backdrop-blur-sm px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 font-medium text-sm md:text-base"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View Details</span>
                      </Link>
                    </div>
                    
                    {/* Copy Link Button */}
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        const currentUrl = `${window.location.origin}/gallery/${selectedImage.id}`;
                        try {
                          await navigator.clipboard.writeText(currentUrl);
                          // Show success notification
                          const notification = document.createElement('div');
                          notification.textContent = '🔗 Link copied!';
                          notification.style.cssText = `
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            background: #10b981;
                            color: white;
                            padding: 12px 20px;
                            border-radius: 8px;
                            font-size: 14px;
                            font-weight: 500;
                            z-index: 10001;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                          `;
                          document.body.appendChild(notification);
                          setTimeout(() => notification.remove(), 2000);
                        } catch {
                          // Fallback for older browsers
                          prompt('Copy this link:', currentUrl);
                        }
                      }}
                      className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl transition-colors"
                    >
                      <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span className="font-medium">Copy Link</span>
                    </button>
                    
                    {/* Download Button */}
                    <a
                      href={selectedImage.image_url}
                      download={`${selectedImage.title}.jpg`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-medium">Download</span>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Navigation Arrows */}
              {filteredItems.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
                      const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
                      setSelectedImage(filteredItems[prevIndex]);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
                    aria-label="Previous image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Next Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
                      const nextIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
                      setSelectedImage(filteredItems[nextIndex]);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* Image Counter */}
              {filteredItems.length > 1 && (
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                  {filteredItems.findIndex(item => item.id === selectedImage.id) + 1} of {filteredItems.length}
                </div>
              )}
            </div>
          </div>
        )}

      {/* Brand Showcase Section - Same as other pages */}
      <section className="py-20 bg-gradient-to-br from-[#1ca4bc] to-[#159bb3] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Part of
              </h2>
              <img 
                src="/assets/Kustompedia.png" 
                alt="Kustompedia" 
                className="h-12 md:h-16 w-auto"
              />
            </div>
            <p className="text-white text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
              Kami membangun <span className="font-semibold" style={{color: '#FF4B00'}}>ekosistem</span> yang mendukung <span className="font-semibold" style={{color: '#FF4B00'}}>penjahit lokal</span>, mendorong <span className="font-semibold" style={{color: '#FF4B00'}}>inovasi produk</span>, dan mengutamakan <span className="font-semibold" style={{color: '#FF4B00'}}>keberlanjutan</span> di setiap langkah
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center">
            <Link href="/" className="relative group cursor-pointer">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300">
                <img 
                  src="/assets/Kustom Inspira - putih.png" 
                  alt="Kustom Inspira" 
                  className="h-28 w-28 mx-auto object-contain filter brightness-0 invert"
                />
              </div>
            </Link>

            <div className="relative group cursor-pointer">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300">
                <img 
                  src="/assets/KG.png" 
                  alt="Kustom Gallery" 
                  className="h-28 w-28 mx-auto object-contain"
                />
              </div>
            </div>

            <div className="relative group cursor-pointer">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300">
                <img 
                  src="/assets/KP.png" 
                  alt="Kustom Pedia" 
                  className="h-28 w-28 mx-auto object-contain"
                />
              </div>
            </div>

            <div className="relative group cursor-pointer">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300">
                <img 
                  src="/assets/KC.png" 
                  alt="Kustom Care" 
                  className="h-28 w-28 mx-auto object-contain"
                />
              </div>
            </div>
          </div>

          <div className="mt-20">
            <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 tracking-wide">
              <span style={{color: '#FF4B00'}}>Inovasi</span> di Setiap <span style={{color: '#FF4B00'}}>Jahitan</span>
            </h3>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-white" style={{backgroundColor: '#021013'}}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/">
                <img 
                  src="/assets/Kustom Inspira - putih.png" 
                  alt="Kustom Inspira" 
                  className="h-12 w-auto mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
              <p className="text-gray-400">
                <span style={{color: '#FF4B00'}}>#DariKainJadiKarya</span><br />
                Belajar dan praktek langsung di Kustominspira.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4"><span style={{color: '#FF4B00'}}>Pusat Belajar</span></h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Artikel</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Video Tutorial</a></li>
                <li><a href="#" className="hover:text-white transition-colors">E-Book</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4"><span style={{color: '#FF4B00'}}>Temu Belajar</span></h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Workshop</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Seminar</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Webinar</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Kontak</h3>
              <p className="text-gray-400 mb-2">kustompedia@gmail.com</p>
              <p className="text-gray-400">+62 (851) 7311-2499</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Kustom Inspira. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}