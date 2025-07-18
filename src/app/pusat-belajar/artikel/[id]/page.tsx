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
        const foundArticle = articles.find(a => a.id === params.id);
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

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt || article.title,
    "image": article.image_url || article.image,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Kustom Inspira",
      "logo": {
        "@type": "ImageObject",
        "url": "/assets/Kustom Inspira.png"
      }
    },
    "datePublished": article.created_at,
    "dateModified": article.updated_at || article.created_at,
    "articleSection": article.category,
    "keywords": [article.category, "menjahit", "tutorial", "fashion", "kustom inspira"],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://kustominspira.com/pusat-belajar/artikel/${article.id}`
    }
  };

  return (
    <>
      <Head>
        <title>{article.title} | Kustom Inspira</title>
        <meta name="description" content={article.excerpt || article.title} />
        <meta name="keywords" content={`${article.category}, menjahit, tutorial, fashion, kustom inspira`} />
        <meta name="author" content={article.author} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt || article.title} />
        <meta property="og:image" content={article.image_url || article.image} />
        <meta property="og:url" content={`https://kustominspira.com/pusat-belajar/artikel/${article.id}`} />
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
                <Link href="/gallery" className="text-gray-700 hover:text-[#1ca4bc] transition-colors">
                  Gallery
                </Link>
              </nav>

              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-[#1ca4bc]">
                  Home
                </Link>
                <Link href="/pusat-belajar" className="block px-3 py-2 text-[#1ca4bc] font-medium">
                  Pusat Belajar
                </Link>
                <Link href="/temu-belajar" className="block px-3 py-2 text-gray-700 hover:text-[#1ca4bc]">
                  Temu Belajar
                </Link>
                <Link href="/gallery" className="block px-3 py-2 text-gray-700 hover:text-[#1ca4bc]">
                  Gallery
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Social Share */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Share Article</h3>
                  <div className="space-y-3">
                    <button 
                      className="w-full flex items-center gap-3 p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                      <span className="text-sm">Twitter</span>
                    </button>
                    
                    <button 
                      className="w-full flex items-center gap-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="text-sm">Facebook</span>
                    </button>
                    
                    <button 
                      className="w-full flex items-center gap-3 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + window.location.href)}`, '_blank')}
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      <span className="text-sm">WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Article Content */}
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <nav className="mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  <li>
                    <Link href="/" className="hover:text-[#1ca4bc]">Home</Link>
                  </li>
                  <li>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </li>
                  <li>
                    <Link href="/pusat-belajar" className="hover:text-[#1ca4bc]">Pusat Belajar</Link>
                  </li>
                  <li>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </li>
                  <li className="text-gray-900 font-medium" aria-current="page">
                    {article.title}
                  </li>
                </ol>
              </nav>

              {/* Article */}
              <article className="bg-white">
                {/* Article Header */}
                <header className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-[#1ca4bc]/10 text-[#1ca4bc] px-3 py-1 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                    <time className="text-gray-600 text-sm" dateTime={article.created_at}>
                      {new Date(article.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 leading-tight">
                    {article.title}
                  </h1>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                    <span>By <span className="font-medium">{article.author}</span></span>
                    <span>•</span>
                    <span>{article.read_time}</span>
                  </div>

                  {/* Article Image - Header Style */}
                  {article.image_url && (
                    <figure className="relative mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
                      <img 
                        src={article.image_url || article.image} 
                        alt={article.title}
                        className="w-full h-96 md:h-[500px] object-cover"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </figure>
                  )}
                </header>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  <ArticleRenderer content={article.content} />
                </div>

                {/* Article Footer */}
                <footer className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex justify-between items-center">
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
                      </div>
                    </div>
                  </div>
                </footer>
              </article>
            </div>

            {/* Right Sidebar - Related Articles */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedArticles.map((relatedArticle) => (
                      <Link 
                        key={relatedArticle.id}
                        href={`/pusat-belajar/artikel/${relatedArticle.id}`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          <img 
                            src={relatedArticle.image_url || relatedArticle.image} 
                            alt={relatedArticle.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#1ca4bc] transition-colors line-clamp-2">
                              {relatedArticle.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {relatedArticle.read_time} • {relatedArticle.category}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                  <span style={{color: '#FF4B00'}}>#DariKainJadiKarya</span><br />
                  Belajar dan praktek langsung di Kustominspira.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4"><span style={{color: '#FF4B00'}}>Pusat Belajar</span></h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/pusat-belajar" className="hover:text-white transition-colors">Artikel</Link></li>
                  <li><Link href="/pusat-belajar" className="hover:text-white transition-colors">Video Tutorial</Link></li>
                  <li><Link href="/pusat-belajar" className="hover:text-white transition-colors">E-Book</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4"><span style={{color: '#FF4B00'}}>Temu Belajar</span></h3>
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