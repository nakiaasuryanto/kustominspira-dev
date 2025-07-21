// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabaseDataManager as dataManager } from '@/lib/supabaseDataManager';
import { GalleryItem } from '@/lib/supabase';

export default function GalleryItemPage() {
  const params = useParams();
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [relatedItems, setRelatedItems] = useState<GalleryItem[]>([]);
  
  // Interactive counters
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        const items = await dataManager.getAllGalleryItems();
        // Find by slug, then fallback to id for backward compatibility
        const foundItem = items.find(i => i.slug === params.slug || i.id === params.slug);
        setItem(foundItem);
        
        // Get related items (same category, exclude current)
        if (foundItem) {
          const related = items
            .filter(i => i.category === foundItem.category && i.id !== foundItem.id)
            .slice(0, 6);
          setRelatedItems(related);
          
          // Initialize like count with random base value (70-400)
          const baseLikes = Math.floor(Math.random() * 331) + 70;
          setLikeCount(baseLikes);
        }
      } catch (error) {
        console.error('Error loading gallery item:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      loadItem();
    }
  }, [params.slug]);

  // Handle like button click
  const handleLike = () => {
    if (!hasLiked) {
      setLikeCount(prev => prev + 1);
      setHasLiked(true);
    }
  };

  // Handle share functionality
  const handleShare = async () => {
    if (isSharing || !item) return;
    setIsSharing(true);
    
    const shareData = {
      title: `${item.title} - Kustom Inspira Gallery`,
      text: item.description,
      url: `${window.location.origin}/gallery/${item.slug || item.id}`
    };

    const shareText = `🎨 ${shareData.title}\n\n${shareData.text}\n\n🔗 View in Gallery: ${shareData.url}\n\n#KustomInspira #FashionDesign #Indonesian`;
    
    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      if (error instanceof Error && (error.name === 'InvalidStateError' || error.name === 'NotAllowedError')) {
        // Additional fallbacks
        try {
          const textArea = document.createElement('textarea');
          textArea.value = shareText;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('Link copied to clipboard!');
        } catch (fallbackError) {
          console.error('All sharing methods failed:', fallbackError);
          alert('Unable to share. Please copy the URL manually.');
        }
      }
    } finally {
      setTimeout(() => setIsSharing(false), 1000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ca4bc] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery item...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Gallery item not found</h1>
          <Link href="/gallery" className="text-[#1ca4bc] hover:text-[#159bb3]">
            ← Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <Link href="/" className="h-8 md:h-10">
            <img 
              src="/assets/Kustom Inspira.png" 
              alt="Kustom Inspira" 
              className="h-full w-auto"
            />
          </Link>
          
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

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50" 
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="relative h-96 md:h-[32rem] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={item.image_url} 
              alt={item.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 bg-[#1ca4bc] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                </svg>
                {item.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {item.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-white/90">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>{likeCount} likes</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date().toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-[#1ca4bc]/20 mb-8 md:mb-12 gap-4 md:gap-0">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2 text-[#1ca4bc]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">{likeCount}</span>
                  <span className="text-sm text-gray-500">likes</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <button 
                  onClick={handleLike}
                  disabled={hasLiked}
                  className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm md:text-base ${
                    hasLiked 
                      ? 'bg-red-500 text-white cursor-not-allowed' 
                      : 'bg-[#1ca4bc] text-white hover:bg-[#159bb3]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs md:text-sm font-medium">{hasLiked ? 'Liked!' : 'Like'}</span>
                </button>
                
                <button 
                  onClick={handleShare}
                  disabled={isSharing}
                  className="flex items-center gap-1 md:gap-2 bg-white text-gray-700 px-3 md:px-4 py-2 rounded-full border border-[#1ca4bc]/30 hover:border-[#1ca4bc] hover:bg-[#1ca4bc]/5 transition-all duration-300 hover:scale-105 disabled:opacity-50 text-sm md:text-base"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span className="text-xs md:text-sm font-medium">{isSharing ? 'Sharing...' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-xl border border-gray-100 mb-8 md:mb-12">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">About This Design</h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">{item.description}</p>
              
              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#1ca4bc]/10 text-[#159bb3] hover:bg-[#1ca4bc]/20 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Back to Gallery */}
            <div className="text-center">
              <Link 
                href="/gallery"
                className="inline-flex items-center gap-2 text-[#1ca4bc] hover:text-[#159bb3] transition-colors font-medium"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Gallery
              </Link>
            </div>
          </div>
        </section>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <section className="py-20 bg-gradient-to-r from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1ca4bc] to-[#159bb3] bg-clip-text text-transparent mb-4">
                  More from {item.category}
                </h3>
                <p className="text-gray-600 text-lg">
                  Explore more amazing designs in this category
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedItems.map((relatedItem) => (
                  <Link 
                    key={relatedItem.id}
                    href={`/gallery/${relatedItem.slug || relatedItem.id}`}
                    className="group relative"
                  >
                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                      <div className="relative aspect-square w-full overflow-hidden">
                        <img 
                          src={relatedItem.image_url} 
                          alt={relatedItem.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-all duration-300 flex items-end">
                          <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <h4 className="font-semibold text-lg mb-2">{relatedItem.title}</h4>
                            <p className="text-sm opacity-90 line-clamp-2">{relatedItem.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="px-2 py-1 bg-[#1ca4bc] rounded-full text-xs">
                                {relatedItem.category}
                              </span>
                              {relatedItem.tags && relatedItem.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="px-2 py-1 bg-gray-600 rounded-full text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-2 truncate">{relatedItem.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{relatedItem.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

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
                <span className="font-bold text-white">#DariKainJadiKarya</span><br />
                Galeri inspirasi fashion dan design terbaik.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-white">Gallery</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/gallery" className="hover:text-white transition-colors">Browse Designs</Link></li>
                <li><Link href="/gallery" className="hover:text-white transition-colors">Categories</Link></li>
                <li><Link href="/gallery" className="hover:text-white transition-colors">Latest</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-white">Learn</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/pusat-belajar" className="hover:text-white transition-colors">Pusat Belajar</Link></li>
                <li><Link href="/temu-belajar" className="hover:text-white transition-colors">Temu Belajar</Link></li>
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