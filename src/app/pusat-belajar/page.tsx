'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { supabaseDataManager as dataManager } from '@/lib/supabaseDataManager';

export default function PusatBelajar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const logosRef = useRef<HTMLDivElement>(null);
  const logoRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [ebooks, setEbooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load fresh data on component mount
    const loadData = async () => {
      try {
        setLoading(true);
        const [articlesData, videosData, ebooksData] = await Promise.all([
          dataManager.getArticles(),
          dataManager.getVideos(),
          dataManager.getEbooks()
        ]);
        setArticles(articlesData);
        setVideos(videosData);
        setEbooks(ebooksData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // GSAP animations for logos
    const logos = logoRefs.current.filter(Boolean);
    
    // Initial animation on mount
    gsap.fromTo(logos, 
      { 
        opacity: 0, 
        scale: 0.5,
        y: 50 
      },
      { 
        opacity: 1, 
        scale: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "back.out(1.7)",
        delay: 0.5
      }
    );

    // Simple hover animation
    logos.forEach((logo) => {
      if (logo) {
        logo.addEventListener('mouseenter', () => {
          gsap.to(logo, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        logo.addEventListener('mouseleave', () => {
          gsap.to(logo, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      }
    });

    return () => {
      // Cleanup event listeners
      logos.forEach(logo => {
        if (logo) {
          logo.removeEventListener('mouseenter', () => {});
          logo.removeEventListener('mouseleave', () => {});
        }
      });
    };
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1ca4bc] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
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
            <Link href="/pusat-belajar" className="text-[#1ca4bc] font-medium text-sm lg:text-base">Pusat Belajar</Link>
            <Link href="/temu-belajar" className="text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base">Temu Belajar</Link>
            <Link href="/gallery" className="text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base">Gallery</Link>
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

      {/* Hero Section */}
      <section className="pt-20 md:pt-24 pb-12 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/assets/pusatbelajar.webp" 
            alt="Pusat Belajar" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-left max-w-3xl py-12 md:py-20">
            <span className="text-[#FF4B00] text-sm md:text-lg font-semibold tracking-wide">#DariKainJadiKarya</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-2 mb-4 md:mb-6">
              <span className="text-[#1ca4bc]">Pusat</span> Belajar
            </h1>
            <p className="text-base md:text-xl text-white/90 leading-relaxed mb-6 md:mb-8">
              Di <span className="font-semibold text-[#FF4B00]">Pusat Belajar Kustominspira</span>, kamu bisa belajar dengan cara yang kamu suka. Mulai dari membaca <span className="font-semibold text-[#FF4B00]">artikel ringan</span>, menonton <span className="font-semibold text-[#FF4B00]">video tutorial</span>, sampai mengunduh <span className="font-semibold text-[#FF4B00]">panduan (e-book)</span> yang bisa dipelajari kapan saja.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <a href="#articles" className="bg-[#1ca4bc] text-white px-4 md:px-8 py-2 md:py-3 rounded-lg hover:bg-[#159bb3] transition-colors text-sm md:text-base">
                Lihat Artikel
              </a>
              <a href="#videos" className="bg-[#1ca4bc] text-white px-4 md:px-8 py-2 md:py-3 rounded-lg hover:bg-[#159bb3] transition-colors text-sm md:text-base">
                Tonton Video
              </a>
              <a href="#ebooks" className="bg-[#1ca4bc] text-white px-4 md:px-8 py-2 md:py-3 rounded-lg hover:bg-[#159bb3] transition-colors text-sm md:text-base">
                Unduh E-Book
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Artikel Terbaru</h2>
              <p className="text-gray-600 text-sm md:text-base">Panduan dan tips menjahit yang mudah dipahami</p>
            </div>
            <button className="text-[#1ca4bc] hover:text-[#159bb3] font-medium text-sm md:text-base">
              Lihat Semua →
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {/* Spotlight Article */}
            {articles.length > 0 ? (
              <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
                  <img 
                    src={articles[0].image_url || articles[0].image} 
                    alt={articles[0].title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 md:p-8">
                  <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
                    <span className="bg-[#1ca4bc]/10 text-[#1ca4bc] px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium">
                      {articles[0].category}
                    </span>
                    <span className="text-gray-400 text-xs md:text-sm">{articles[0].read_time}</span>
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 line-clamp-2">
                    {articles[0].title}
                  </h3>
                  <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-lg leading-relaxed line-clamp-3">
                    {articles[0].excerpt}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="text-xs md:text-sm text-gray-500">
                      Oleh {articles[0].author}
                    </span>
                    <button 
                      onClick={() => window.location.href = `/pusat-belajar/artikel/${articles[0].id}`}
                      className="bg-[#1ca4bc] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-[#159bb3] transition-colors font-medium text-sm md:text-base"
                    >
                      Baca Artikel →
                    </button>
                  </div>
                </div>
              </article>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 md:p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-12 md:w-16 h-12 md:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm md:text-base">Belum ada artikel. Silakan tambahkan melalui admin panel.</p>
              </div>
            )}

            {/* Regular Articles */}
            <div className="space-y-6">
              {articles.slice(1).map((article) => (
                <article key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex">
                  <div className="w-32 h-32 bg-gray-200 overflow-hidden flex-shrink-0">
                    <img 
                      src={article.image_url || article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-[#1ca4bc]/10 text-[#1ca4bc] px-3 py-1 rounded-full text-xs font-medium">
                        {article.category}
                      </span>
                      <span className="text-gray-400 text-xs">{article.read_time}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Oleh {article.author}
                      </span>
                      <button 
                        onClick={() => window.location.href = `/pusat-belajar/artikel/${article.id}`}
                        className="text-[#1ca4bc] hover:text-[#159bb3] font-medium text-sm"
                      >
                        Baca →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section id="videos" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Video Tutorial</h2>
              <p className="text-gray-600">Belajar menjahit dengan panduan video step-by-step</p>
            </div>
            <button className="text-[#1ca4bc] hover:text-[#159bb3] font-medium">
              Lihat Semua →
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Spotlight Video */}
            {videos.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <img 
                    src={videos[0].thumbnail} 
                    alt={videos[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-6 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded text-lg font-medium">
                    {videos[0].duration}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {videos[0].title}
                  </h3>
                  <div className="flex items-center justify-between text-lg text-gray-500">
                    <span>{videos[0].views} views</span>
                    <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium">
                      Video Tutorial
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-600">Belum ada video. Silakan tambahkan melalui admin panel.</p>
              </div>
            )}

            {/* Regular Videos */}
            <div className="space-y-6">
              {videos.slice(1).map((video) => (
                <div key={video.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer flex">
                  <div className="w-48 aspect-video bg-gray-200 relative overflow-hidden flex-shrink-0">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-3 border-l-gray-900 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-6 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{video.views} views</span>
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
                        Video Tutorial
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* E-books Section */}
      <section id="ebooks" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">E-Book Gratis</h2>
              <p className="text-gray-600">Download panduan lengkap dalam format PDF</p>
            </div>
            <button className="text-[#1ca4bc] hover:text-[#159bb3] font-medium">
              Lihat Semua →
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Spotlight E-book */}
            {ebooks.length > 0 ? (
              <div className="bg-gradient-to-br from-[#1ca4bc]/5 to-[#1ca4bc]/10 rounded-xl p-10 hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 bg-[#1ca4bc] rounded-lg flex items-center justify-center mb-8">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {ebooks[0].title}
                </h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  {ebooks[0].description}
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-500">Halaman:</span>
                    <span className="text-gray-900 font-medium">{ebooks[0].pages}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-500">Format:</span>
                    <span className="text-gray-900 font-medium">{ebooks[0].format}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-500">Ukuran:</span>
                    <span className="text-gray-900 font-medium">{ebooks[0].size}</span>
                  </div>
                </div>
                <button className="w-full bg-[#1ca4bc] text-white py-4 rounded-lg hover:bg-[#159bb3] transition-colors text-lg font-medium">
                  Download Gratis
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#1ca4bc]/5 to-[#1ca4bc]/10 rounded-xl p-10 text-center">
                <div className="w-20 h-20 bg-[#1ca4bc]/20 rounded-lg flex items-center justify-center mb-8 mx-auto">
                  <svg className="w-10 h-10 text-[#1ca4bc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-600">Belum ada e-book. Silakan tambahkan melalui admin panel.</p>
              </div>
            )}

            {/* Regular E-books */}
            <div className="space-y-6">
              {ebooks.slice(1).map((ebook) => (
                <div key={ebook.id} className="bg-gradient-to-br from-[#1ca4bc]/5 to-[#1ca4bc]/10 rounded-xl p-6 hover:shadow-lg transition-shadow flex items-center">
                  <div className="w-16 h-16 bg-[#1ca4bc] rounded-lg flex items-center justify-center mr-6 flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {ebook.title}
                    </h3>
                    <p className="text-gray-600 mb-3 text-sm">
                      {ebook.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span>{ebook.pages}</span>
                      <span>•</span>
                      <span>{ebook.format}</span>
                      <span>•</span>
                      <span>{ebook.size}</span>
                    </div>
                    <button className="bg-[#1ca4bc] text-white px-6 py-2 rounded-lg hover:bg-[#159bb3] transition-colors text-sm font-medium">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brand Showcase Section */}
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

          <div ref={logosRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center">
            <div className="relative group cursor-pointer">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300">
                <img 
                  ref={(el) => { logoRefs.current[0] = el; }}
                  src="/assets/Kustom Inspira - putih.png" 
                  alt="Kustom Inspira" 
                  className="h-28 w-28 mx-auto object-contain filter brightness-0 invert"
                />
              </div>
            </div>

            <div className="relative group cursor-pointer">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300">
                <img 
                  ref={(el) => { logoRefs.current[1] = el; }}
                  src="/assets/KG.png" 
                  alt="Kustom Gallery" 
                  className="h-28 w-28 mx-auto object-contain"
                />
              </div>
            </div>

            <div className="relative group cursor-pointer">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300">
                <img 
                  ref={(el) => { logoRefs.current[2] = el; }}
                  src="/assets/KP.png" 
                  alt="Kustom Pedia" 
                  className="h-28 w-28 mx-auto object-contain"
                />
              </div>
            </div>

            <div className="relative group cursor-pointer">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300">
                <img 
                  ref={(el) => { logoRefs.current[3] = el; }}
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
                <li><a href="#" className="hover:text-white transition-colors">Forum</a></li>
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