// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import { supabaseDataManager as dataManager } from '@/lib/supabaseDataManager';
import ArticleRenderer from '@/components/ArticleRenderer';
import { Article } from '@/lib/supabase';

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        const articles = await dataManager.getAllArticles();
        // First try to find by slug, then fallback to id for backward compatibility
        const foundArticle = articles.find(a => a.slug === params.id || a.id === params.id);
        setArticle(foundArticle);
        
        // Get related articles (same category, exclude current)
        if (foundArticle) {
          const related = articles
            .filter(a => a.category === foundArticle.category && a.id !== foundArticle.id)
            .slice(0, 4);
          setRelatedArticles(related);
        }
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadArticle();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ca4bc] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
          <Link href="/pusat-belajar" className="text-[#1ca4bc] hover:text-[#159bb3]">
            ← Back to Pusat Belajar
          </Link>
        </div>
      </div>
    );
  }

  // Generate enhanced structured data for SEO
  const allTags = [
    article.category, "menjahit", "tutorial", "fashion", "kustom inspira", "sewing", "DIY", "handmade", "crafting",
    ...(article.tags || []),
    ...(article.seo_tags || []),
    article.difficulty_level,
    "indonesia", "tutorial menjahit", "belajar menjahit", "jahit sendiri", "fashion design", "keterampilan"
  ].filter(Boolean);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["Article", "HowTo"],
    "headline": article.title,
    "description": article.meta_description || article.excerpt || article.title,
    "image": article.image_url || article.image,
    "author": {
      "@type": "Person",
      "name": article.author || "Kustom Inspira Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Kustom Inspira",
      "logo": {
        "@type": "ImageObject",
        "url": "/assets/Kustom Inspira.png"
      }
    },
    "datePublished": article.published_at || article.created_at,
    "dateModified": article.updated_at || article.created_at,
    "articleSection": article.category,
    "keywords": allTags.join(", "),
    "about": allTags.slice(0, 5).map(tag => ({ "@type": "Thing", "name": tag })),
    "teaches": article.category + " techniques",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "IDR",
      "value": "50000-200000"
    },
    "totalTime": article.estimated_duration || "PT45M",
    "difficulty": article.difficulty_level || "beginner",
    "supply": (article.materials_needed || ["kain", "benang", "jarum", "gunting"]).map(item => ({
      "@type": "HowToSupply",
      "name": item
    })),
    "tool": (article.tools_required || ["mesin jahit", "gunting kain", "meteran"]).map(item => ({
      "@type": "HowToTool",
      "name": item
    })),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://kustominspira.com/pusat-belajar/artikel/${article.slug || article.id}`
    },
    "inLanguage": "id-ID",
    "audience": {
      "@type": "Audience",
      "audienceType": "sewing enthusiasts, fashion students, DIY crafters"
    }
  };

  return (
    <>
      <Head>
        <title>{article.title} | Kustom Inspira - Tutorial Menjahit & Fashion DIY</title>
        <meta name="description" content={article.meta_description || article.excerpt || `Pelajari ${article.title} dengan panduan lengkap step-by-step. Tutorial menjahit, fashion DIY, dan keterampilan crafting untuk pemula hingga mahir.`} />
        <meta name="keywords" content={allTags.join(', ')} />
        <meta name="author" content={article.author} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt || article.title} />
        <meta property="og:image" content={article.image_url || article.image} />
        <meta property="og:url" content={`https://kustominspira.com/pusat-belajar/artikel/${article.slug || article.id}`} />
        <meta property="og:site_name" content="Kustom Inspira" />
        <meta property="article:author" content={article.author} />
        <meta property="article:published_time" content={article.created_at} />
        <meta property="article:modified_time" content={article.updated_at || article.created_at} />
        <meta property="article:section" content={article.category} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt || article.title} />
        <meta name="twitter:image" content={article.image_url || article.image} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes animate-tilt {
            0%, 100% { transform: rotate(-1deg); }
            50% { transform: rotate(1deg); }
          }
          .animate-tilt {
            animation: animate-tilt 6s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(28, 164, 188, 0.4); }
            50% { box-shadow: 0 0 40px rgba(28, 164, 188, 0.8), 0 0 60px rgba(28, 164, 188, 0.4); }
          }
          .animate-glow {
            animation: glow 3s ease-in-out infinite;
          }
        `}</style>
        
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <img 
                    src="/assets/Kustom Inspira.png" 
                    alt="Kustom Inspira" 
                    className="h-8 w-auto"
                  />
                </Link>
              </div>
              
              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-700 hover:text-[#1ca4bc] transition-colors">
                  Home
                </Link>
                <Link href="/pusat-belajar" className="text-[#1ca4bc] font-medium">
                  Pusat Belajar
                </Link>
                <Link href="/temu-belajar" className="text-gray-700 hover:text-[#1ca4bc] transition-colors">
                  Temu Belajar
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Mobile Side Menu */}
        <div className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] z-50 bg-white shadow-2xl transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <img src="/assets/Kustom Inspira.png" alt="Kustom Inspira" className="h-8 w-auto" />
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6">
              <nav className="space-y-2 px-6">
                <Link href="/" className="block py-3 text-lg font-semibold text-gray-600 hover:text-[#1ca4bc] transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link href="/pusat-belajar" className="block py-3 text-lg font-semibold text-[#1ca4bc] transition-colors" onClick={() => setIsMenuOpen(false)}>Pusat Belajar</Link>
                <Link href="/temu-belajar" className="block py-3 text-lg font-semibold text-gray-600 hover:text-[#1ca4bc] transition-colors" onClick={() => setIsMenuOpen(false)}>Temu Belajar</Link>
                <a href="https://kustompedia.com" target="_blank" rel="noopener noreferrer" className="block py-3 text-lg font-semibold text-gray-600 hover:text-[#1ca4bc] transition-colors">Kustompedia</a>
              </nav>
            </div>

            {/* Contact Info & Ecosystem */}
            <div className="border-t border-gray-200 bg-gray-50">
              {/* Contact Section */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">HUBUNGI KAMI</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Jl. Sidosermo Indah Gg. III No. 37</p>
                  <p>Surabaya, 60239</p>
                  <p>+62 (851) 7311-2499</p>
                  <a href="mailto:kustompedia@gmail.com" className="text-[#1ca4bc] hover:underline">kustompedia@gmail.com</a>
                </div>
              </div>

              {/* Ecosystem Section */}
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">PART OF KUSTOMPEDIA</h3>
                
                {/* Logos Grid - 2x2 */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Row 1 */}
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <img 
                      src="/assets/Kustom Inspira.png" 
                      alt="Kustom Inspira" 
                      className="h-8 w-auto mx-auto object-contain"
                    />
                  </div>
                  <a 
                    href="https://kustomgarment.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <img 
                      src="/assets/KG.png" 
                      alt="Kustom Garment" 
                      className="h-8 w-auto mx-auto object-contain"
                    />
                  </a>
                  
                  {/* Row 2 */}
                  <a 
                    href="https://kustomproject.id" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <img 
                      src="/assets/KP.png" 
                      alt="Kustom Project" 
                      className="h-8 w-auto mx-auto object-contain"
                    />
                  </a>
                  <a 
                    href="https://care.kustompedia.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <img 
                      src="/assets/KC.png" 
                      alt="Kustom Care" 
                      className="h-8 w-auto mx-auto object-contain"
                    />
                  </a>
                </div>
              </div>
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

        {/* Header Banner Section */}
        <section className="relative h-96 flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            {article.image_url ? (
              <img 
                src={article.image_url} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1ca4bc] to-[#159bb3]"></div>
            )}
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            {/* Category Badge */}
            <div className="mb-6 mt-16">
              <span className="inline-flex items-center gap-2 bg-[#1ca4bc] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {article.category || 'Tutorial'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-wider">
              {article.title}
            </h1>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-white/90">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-8 h-8 bg-[#1ca4bc] rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {article.author?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <span className="font-medium">{article.author || 'Kustom Inspira'}</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{article.read_time || '5 Min Read'}</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(article.created_at || Date.now()).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}</span>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </section>

        {/* Main Content with Modern Design */}
        <main className="relative bg-gradient-to-b from-gray-50 to-white">
          {/* Content Container */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            
            {/* Article Stats & Interaction Bar */}
            <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#1ca4bc]/20 mb-12">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[#1ca4bc]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">{article.views || '1.2K'}</span>
                  <span className="text-sm text-gray-500">views</span>
                </div>
                
                <div className="flex items-center gap-2 text-[#1ca4bc]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">{article.likes || '89'}</span>
                  <span className="text-sm text-gray-500">likes</span>
                </div>
                
                <div className="flex items-center gap-2 text-[#1ca4bc]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="font-semibold">24</span>
                  <span className="text-sm text-gray-500">comments</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 bg-[#1ca4bc] text-white px-4 py-2 rounded-full hover:bg-[#159bb3] hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Like</span>
                </button>
                
                <button className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-full border border-[#1ca4bc]/30 hover:border-[#1ca4bc] hover:bg-[#1ca4bc]/5 transition-all duration-300 hover:scale-105">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </div>

            {/* Article Content with Enhanced Styling */}
            <article className="relative">
              {/* Reading Progress Bar */}
              <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
                <div className="h-full bg-gradient-to-r from-[#1ca4bc] to-[#159bb3] transition-all duration-300" style={{width: '0%'}} id="reading-progress"></div>
              </div>
              
              {/* Content */}
              <div className="prose prose-xl max-w-none bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
                <ArticleRenderer content={article.content} />
              </div>

              {/* SEO Tags Section - Moved after content */}
              {(article.tags && article.tags.length > 0) || (article.seo_tags && article.seo_tags.length > 0) ? (
                <div className="mt-12 p-6 bg-gradient-to-r from-[#1ca4bc]/5 to-[#159bb3]/10 rounded-2xl border border-[#1ca4bc]/20">
                  <h3 className="text-lg font-bold text-[#159bb3] mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[...(article.tags || []), ...(article.seo_tags || [])].map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#1ca4bc]/10 text-[#159bb3] hover:bg-[#1ca4bc]/20 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>


          {/* Share Buttons */}
          <div className="border-t border-gray-200 pt-8 mb-8">
            <div className="flex items-center justify-between">
              <Link 
                href="/pusat-belajar"
                className="inline-flex items-center gap-2 text-[#1ca4bc] hover:text-[#159bb3] transition-colors font-medium"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Pusat Belajar
              </Link>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Share:</span>
                <div className="flex gap-2">
                  <button 
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </button>
                  <button 
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button 
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + window.location.href)}`, '_blank')}
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles with Enhanced Design */}
          {relatedArticles.length > 0 && (
            <section className="relative mt-20">
              {/* Background with gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1ca4bc]/5 via-[#159bb3]/10 to-[#1ca4bc]/5 rounded-3xl"></div>
              
              <div className="relative p-8 md:p-12">
                <div className="text-center mb-12">
                  <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1ca4bc] to-[#159bb3] bg-clip-text text-transparent mb-4">
                    Discover More Amazing Tutorials
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Continue your creative journey with these handpicked articles
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedArticles.slice(0, 4).map((relatedArticle, index) => (
                    <Link 
                      key={relatedArticle.id}
                      href={`/pusat-belajar/artikel/${relatedArticle.slug || relatedArticle.id}`}
                      className="group relative"
                    >
                      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-glow">
                        {/* Article Image */}
                        <div className="relative aspect-video w-full overflow-hidden">
                          <img 
                            src={relatedArticle.image_url || relatedArticle.image} 
                            alt={relatedArticle.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          
                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="bg-gradient-to-r from-[#1ca4bc] to-[#159bb3] text-white text-xs font-semibold px-3 py-1 rounded-full">
                              {relatedArticle.category}
                            </span>
                          </div>
                          
                          {/* Read Time */}
                          <div className="absolute bottom-4 right-4">
                            <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                              {relatedArticle.read_time || '5 min read'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6">
                          <h4 className="font-bold text-lg text-gray-900 group-hover:text-[#1ca4bc] transition-colors duration-300 line-clamp-2 mb-3">
                            {relatedArticle.title}
                          </h4>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <div className="w-6 h-6 bg-gradient-to-r from-[#1ca4bc] to-[#159bb3] rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">
                                  {relatedArticle.author?.charAt(0)?.toUpperCase() || 'K'}
                                </span>
                              </div>
                              <span>{relatedArticle.author || 'Kustom Team'}</span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-orange-500">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-sm font-medium">4.8</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1ca4bc]/10 to-[#159bb3]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {/* View All Button */}
                <div className="text-center mt-12">
                  <Link 
                    href="/pusat-belajar"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1ca4bc] to-[#159bb3] text-white font-semibold px-8 py-4 rounded-full hover:from-[#159bb3] hover:to-[#1ca4bc] transition-all duration-300 transform hover:scale-105 animate-shimmer"
                  >
                    <span>Explore All Tutorials</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </section>
          )}
          
          </div>
        </main>

        {/* Part of Kustompedia Section */}
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
                  className="h-12 md:h-16 w-auto cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => window.open('https://kustompedia.com', '_blank')}
                />
              </div>
              <p className="text-white text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
                Kami membangun <span className="font-bold text-white">ekosistem</span> yang mendukung <span className="font-bold text-white">penjahit lokal</span>, mendorong <span className="font-bold text-white">inovasi produk</span>, dan mengutamakan <span className="font-bold text-white">keberlanjutan</span> di setiap langkah
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
                    className="h-28 w-28 mx-auto object-contain cursor-pointer"
                    onClick={() => window.open('https://kustomgarment.com', '_blank')}
                  />
                </div>
              </div>

              <div className="relative group cursor-pointer">
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300">
                  <img 
                    src="/assets/KP.png" 
                    alt="Kustom Pedia" 
                    className="h-28 w-28 mx-auto object-contain cursor-pointer"
                    onClick={() => window.open('https://kustomproject.id', '_blank')}
                  />
                </div>
              </div>

              <div className="relative group cursor-pointer">
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300">
                  <img 
                    src="/assets/KC.png" 
                    alt="Kustom Care" 
                    className="h-28 w-28 mx-auto object-contain cursor-pointer"
                    onClick={() => window.open('https://care.kustompedia.com', '_blank')}
                  />
                </div>
              </div>
            </div>

            <div className="mt-20">
              <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 tracking-wide">
                <span className="font-bold text-white">Inovasi</span> di Setiap <span className="font-bold text-white">Jahitan</span>
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
                  <span className="font-bold text-white">#DariKainJadiKarya</span><br />
                  Belajar dan praktek langsung di Kustominspira.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-4 text-white">Pusat Belajar</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/pusat-belajar" className="hover:text-white transition-colors">Artikel</Link></li>
                  <li><Link href="/pusat-belajar" className="hover:text-white transition-colors">Video Tutorial</Link></li>
                  <li><Link href="/pusat-belajar" className="hover:text-white transition-colors">E-Book</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4 text-white">Temu Belajar</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/temu-belajar" className="hover:text-white transition-colors">Workshop</Link></li>
                  <li><Link href="/temu-belajar" className="hover:text-white transition-colors">Seminar</Link></li>
                  <li><Link href="/temu-belajar" className="hover:text-white transition-colors">Forum</Link></li>
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
    </>
  );
}