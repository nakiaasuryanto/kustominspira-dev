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

  useEffect(() => {
    // Load fresh data on component mount
    const loadData = async () => {
      try {
        setLoading(true);
        // Create sample gallery data since we might not have database set up yet
        const sampleGalleryData: GalleryItem[] = [
          {
            id: '1',
            title: 'Elegant Batik Dress with Modern Twist - Traditional Indonesian Fashion',
            category: 'fashion',
            image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'Beautiful traditional batik dress redesigned with modern silhouette, perfect for formal events and cultural celebrations',
            tags: ['batik', 'traditional', 'modern', 'dress', 'indonesian', 'culture', 'fashion', 'elegant'],
            height: 'h-64'
          },
          {
            id: '2',
            title: 'Handcrafted Leather Handbag - Sustainable Fashion Accessory',
            category: 'accessories',
            image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'Premium handcrafted leather handbag made from sustainable materials, featuring unique Indonesian craftsmanship',
            tags: ['leather', 'handbag', 'sustainable', 'handcraft', 'accessory', 'premium', 'unique'],
            height: 'h-80'
          },
          {
            id: '3',
            title: 'Contemporary Kebaya Collection - Modern Indonesian Formal Wear',
            category: 'fashion',
            image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'Contemporary kebaya design blending traditional Indonesian elements with modern fashion trends',
            tags: ['kebaya', 'traditional', 'formal', 'contemporary', 'indonesian', 'cultural', 'blouse'],
            height: 'h-72'
          },
          {
            id: '4',
            title: 'Artisan Woven Tote Bag - Eco-Friendly Shopping Companion',
            category: 'accessories',
            image_url: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'Eco-friendly woven tote bag crafted by local artisans, perfect for everyday use and sustainable living',
            tags: ['tote bag', 'woven', 'eco-friendly', 'artisan', 'sustainable', 'daily use', 'natural'],
            height: 'h-64'
          },
          {
            id: '5',
            title: 'Traditional Songket Evening Gown - Luxury Cultural Fashion',
            category: 'fashion',
            image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'Luxurious evening gown featuring traditional songket patterns, designed for special occasions',
            tags: ['songket', 'evening gown', 'luxury', 'traditional', 'special occasion', 'patterns', 'cultural'],
            height: 'h-96'
          },
          {
            id: '6',
            title: 'Minimalist Cotton Scarf - Versatile Fashion Statement',
            category: 'accessories',
            image_url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            description: 'Soft cotton scarf with minimalist design, perfect for layering and creating versatile looks',
            tags: ['scarf', 'cotton', 'minimalist', 'versatile', 'layering', 'soft', 'fashion'],
            height: 'h-56'
          }
        ];
        
        try {
          const galleryData = await dataManager.getGalleryItems();
          setGalleryItems(galleryData.length > 0 ? galleryData : sampleGalleryData);
        } catch {
          setGalleryItems(sampleGalleryData);
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
    { id: 'accessories', name: 'Accessories', count: galleryItems.filter(item => item.category === 'accessories').length }
  ];



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1ca4bc] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/" className="h-8 md:h-10">
                <img 
                  src="/assets/Kustom Inspira.png" 
                  alt="Kustom Inspira Logo - Indonesian Fashion Design Platform"
                  className="h-full w-auto"
                />
              </Link>
              <h1 className="text-lg md:text-2xl font-bold text-gray-900">Fashion Gallery</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base">Home</Link>
              <Link href="/pusat-belajar" className="text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base">Pusat Belajar</Link>
              <Link href="/temu-belajar" className="text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base">Temu Belajar</Link>
              <Link href="/gallery" className="text-[#1ca4bc] font-medium text-sm lg:text-base">Gallery</Link>
              <a href="https://kustompedia.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base">Kustompedia</a>
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-8 h-8 flex flex-col justify-center items-center"
              aria-label="Toggle mobile menu"
            >
              <div className="w-4 h-px bg-gray-900 mb-1"></div>
              <div className="w-4 h-px bg-gray-900 mb-1"></div>
              <div className="w-4 h-px bg-gray-900"></div>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`fixed top-16 left-0 right-0 z-40 bg-white shadow-lg border-b border-gray-200 transform transition-transform duration-300 md:hidden ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-[#1ca4bc] transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link href="/pusat-belajar" className="text-gray-700 hover:text-[#1ca4bc] transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Pusat Belajar</Link>
              <Link href="/temu-belajar" className="text-gray-700 hover:text-[#1ca4bc] transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Temu Belajar</Link>
              <Link href="/gallery" className="text-[#1ca4bc] font-bold" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
              <a href="https://kustompedia.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#1ca4bc] transition-colors font-medium">Kustompedia</a>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="pt-20 md:pt-24 pb-12 md:pb-16 bg-gradient-to-br from-[#1ca4bc]/5 to-[#159bb3]/10">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Fashion <span className="text-[#1ca4bc]">Gallery</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover stunning Indonesian fashion designs, from traditional batik and kebaya to modern sustainable accessories. Get inspired by our creative community.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search designs, styles, or materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1ca4bc] focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                  <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-[#1ca4bc] text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Content */}
        <div className="pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            {/* Results Count */}
            <div className="mb-8">
              <p className="text-gray-600">
                Showing {filteredItems.length} of {galleryItems.length} designs
                {searchQuery && (
                  <span className="ml-2">
                    for "<span className="font-semibold text-gray-900">{searchQuery}</span>"
                  </span>
                )}
              </p>
            </div>

            {/* Masonry Gallery Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
              {filteredItems.map((item) => (
                <article key={item.id} className="break-inside-avoid">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
                    <div className={`relative overflow-hidden ${item.height}`}>
                      <img 
                        src={item.image_url}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <h3 className="font-semibold text-sm md:text-lg mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-xs md:text-sm text-gray-200 mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.tags?.slice(0, 3).map((tag, index) => (
                            <span key={index} className="inline-block px-2 py-1 bg-white/20 rounded-full text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <span className="inline-block px-2 md:px-3 py-1 bg-[#1ca4bc] rounded-full text-xs font-medium capitalize">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                      <button 
                        className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        aria-label="Save to favorites"
                      >
                        <svg className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <button 
                        className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        aria-label="Share design"
                      >
                        <svg className="w-5 h-5 text-gray-700 hover:text-[#1ca4bc] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No designs found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters</p>
              </div>
            )}

            {/* Load More Button */}
            {filteredItems.length > 0 && (
              <div className="text-center mt-16">
                <button className="bg-[#1ca4bc] text-white px-8 py-4 rounded-lg hover:bg-[#159bb3] transition-colors font-medium shadow-lg">
                  Load More Inspirations
                </button>
              </div>
            )}
          </div>
        </div>

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
            <div className="relative group cursor-pointer">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300">
                <img 
                  src="/assets/Kustom Inspira - putih.png" 
                  alt="Kustom Inspira" 
                  className="h-28 w-28 mx-auto object-contain filter brightness-0 invert"
                />
              </div>
            </div>

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
              <img 
                src="/assets/Kustom Inspira - putih.png" 
                alt="Kustom Inspira" 
                className="h-12 w-auto mb-4"
              />
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