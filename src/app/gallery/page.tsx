// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabaseDataManager as dataManager } from '@/lib/supabaseDataManager';
import { GalleryItem } from '@/lib/supabase';

export default function Gallery() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load fresh data on component mount
    const loadData = async () => {
      try {
        setLoading(true);
        const galleryData = await dataManager.getGalleryItems();
        setGalleryItems(galleryData);
      } catch (error) {
        console.error('Error loading gallery:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);



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
                alt="Kustom Inspira" 
                className="h-full w-auto"
              />
            </Link>
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">Gallery</h1>
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
          >
            <div className="w-4 h-px bg-gray-900 mb-1"></div>
            <div className="w-4 h-px bg-gray-900 mb-1"></div>
            <div className="w-4 h-px bg-gray-900"></div>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 md:pt-24 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          {/* Masonry Gallery Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
            {galleryItems.map((item) => (
              <div key={item.id} className="break-inside-avoid">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <div className={`relative overflow-hidden ${item.height}`}>
                    <img 
                      src={item.image_url || item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <h3 className="font-semibold text-sm md:text-lg mb-1">{item.title}</h3>
                      <span className="inline-block px-2 md:px-3 py-1 bg-[#1ca4bc] rounded-full text-xs font-medium">
                        {item.category === 'fashion' ? 'Fashion' : 'Accessories'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Love/Save Button */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <svg className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-16">
            <button className="bg-[#1ca4bc] text-white px-8 py-4 rounded-lg hover:bg-[#159bb3] transition-colors font-medium">
              Load More Inspirations
            </button>
          </div>
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