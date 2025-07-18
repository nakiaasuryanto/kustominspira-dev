'use client';
import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const titleRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // GSAP animations on mount
    
    // Animate titles on load
    titleRefs.current.forEach((title, index) => {
      if (title) {
        gsap.fromTo(title, 
          { 
            opacity: 0, 
            y: 100,
            scale: 0.8
          },
          { 
            opacity: 1, 
            y: 0,
            scale: 1,
            duration: 1.5,
            delay: index * 0.3,
            ease: "power3.out"
          }
        );
      }
    });

    // Floating animation for buttons
    gsap.to(".floating-btn", {
      y: -10,
      duration: 2,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true
    });

    // Pulse animation for circle
    gsap.to(".pulse-circle", {
      scale: 1.1,
      duration: 1.5,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true
    });

  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // GSAP scroll animations
      if (typeof window !== 'undefined') {
        const sectionHeight = window.innerHeight;
        const scrollProgress = window.scrollY / sectionHeight;
        
        // Parallax effect for titles
        titleRefs.current.forEach((title, index) => {
          if (title) {
            const offset = (scrollProgress - index) * 50;
            gsap.to(title, {
              y: offset,
              duration: 0.3,
              ease: "none"
            });
          }
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getOpacity = (sectionIndex: number) => {
    if (typeof window === 'undefined') return 1; // SSR safety
    
    const sectionHeight = window.innerHeight;
    const currentSection = Math.floor(scrollY / sectionHeight);
    const scrollProgress = (scrollY % sectionHeight) / sectionHeight;
    
    if (sectionIndex < currentSection) {
      return 0.2; // Covered sections become very transparent
    } else if (sectionIndex === currentSection && scrollProgress > 0.3) {
      // Start fading earlier (at 30% instead of 50%)
      return 1 - (scrollProgress - 0.3) * 1.8; // Fade out more aggressively
    }
    return 1; // Visible section stays opaque
  };

  return (
    <div className="relative">

      {/* Fixed Navigation */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center p-4 md:p-6 text-white">
        <div className="h-8 md:h-12">
          <img 
            src="/assets/Kustom Inspira - putih.png" 
            alt="Kustom Inspira Logo" 
            className="h-full w-auto"
          />
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-8 h-8 flex flex-col justify-center items-center hover:scale-110 transition-transform"
        >
          <div className="w-4 h-px bg-white mb-1"></div>
          <div className="w-4 h-px bg-white mb-1"></div>
          <div className="w-4 h-px bg-white"></div>
        </button>
      </nav>

      {/* Modern Mobile Menu */}
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
              <a href="#" className="block py-3 text-lg font-semibold text-gray-900 hover:text-[#1ca4bc] transition-colors" onClick={() => setIsMenuOpen(false)}>Home</a>
              <a href="/pusat-belajar" className="block py-3 text-lg font-semibold text-gray-600 hover:text-[#1ca4bc] transition-colors" onClick={() => setIsMenuOpen(false)}>Pusat Belajar</a>
              <a href="/temu-belajar" className="block py-3 text-lg font-semibold text-gray-600 hover:text-[#1ca4bc] transition-colors" onClick={() => setIsMenuOpen(false)}>Temu Belajar</a>
              <a href="https://kustompedia.com" target="_blank" rel="noopener noreferrer" className="block py-3 text-lg font-semibold text-gray-600 hover:text-[#1ca4bc] transition-colors">Kustompedia</a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">HUBUNGI KAMI</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Jl. Sidosermo Indah Gg. III No. 37</p>
              <p>Surabaya, 60239</p>
              <p>+62 (851) 7311-2499</p>
              <a href="mailto:kustompedia@gmail.com" className="text-[#1ca4bc] hover:underline">kustompedia@gmail.com</a>
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

      {/* Fixed Description Text */}
      <div className="fixed top-16 md:top-24 left-1/2 transform -translate-x-1/2 z-40 text-center text-white px-4">
        <div className="text-sm md:text-lg tracking-[0.2em] md:tracking-[0.3em] opacity-80">
          #DariKainJadiKarya
        </div>
      </div>

      {/* Fixed Bottom Elements */}
      <div className="fixed bottom-4 md:bottom-6 left-4 md:left-6 text-xs opacity-60 z-40 text-white">
        Part of Kustompedia
      </div>

      {/* Section 1: CRAFTING BRANDS */}
      <section className="h-screen relative flex items-center justify-center z-10">
        <div className="absolute inset-0 bg-[url('/assets/kustominspira.webp')] bg-cover bg-center bg-fixed"></div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div ref={section1Ref} className="relative z-10 text-center mt-16 md:mt-16 text-white transition-opacity duration-500 px-4" style={{ opacity: getOpacity(0) }}>
          <h1 ref={(el) => { titleRefs.current[0] = el; }} className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-wider">
            KUSTOM
            <br />
            INSPIRA
          </h1>
        </div>
      </section>

      {/* Section 2: PUSAT BELAJAR */}
      <Link href="/pusat-belajar">
        <section className="h-screen relative flex items-center justify-center z-20 cursor-pointer">
          <div className="absolute inset-0 bg-[url('/assets/pusatbelajar.webp')] bg-cover bg-center bg-fixed"></div>
          <div className="absolute inset-0 bg-black/60"></div>
          <div ref={section2Ref} className="relative z-10 text-center mt-16 md:mt-16 text-white transition-opacity duration-500 px-4" style={{ opacity: getOpacity(1) }}>
            <h1 ref={(el) => { titleRefs.current[1] = el; }} className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-wider mb-8 md:mb-12">
              PUSAT
              <br />
              BELAJAR
            </h1>
          <div className="flex justify-center gap-4 md:gap-8 flex-wrap max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 md:px-8 py-4 md:py-6 rounded-lg hover:bg-white/20 transition-all duration-300 floating-btn hover:scale-105 flex-1 min-w-[150px] max-w-[200px]">
              <h3 className="text-sm md:text-lg font-semibold mb-2">ARTIKEL</h3>
              <p className="text-xs md:text-sm opacity-80">Panduan lengkap menjahit</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 md:px-8 py-4 md:py-6 rounded-lg hover:bg-white/20 transition-all duration-300 floating-btn hover:scale-105 flex-1 min-w-[150px] max-w-[200px]">
              <h3 className="text-sm md:text-lg font-semibold mb-2">VIDEO TUTORIAL</h3>
              <p className="text-xs md:text-sm opacity-80">Belajar step by step</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 md:px-8 py-4 md:py-6 rounded-lg hover:bg-white/20 transition-all duration-300 floating-btn hover:scale-105 flex-1 min-w-[150px] max-w-[200px]">
              <h3 className="text-sm md:text-lg font-semibold mb-2">E-BOOK</h3>
              <p className="text-xs md:text-sm opacity-80">Koleksi pola dan teknik</p>
            </div>
          </div>
          </div>
        </section>
      </Link>

      {/* Section 3: TEMU BELAJAR */}
      <Link href="/temu-belajar">
        <section className="h-screen relative flex items-center justify-center z-30 cursor-pointer">
          <div className="absolute inset-0 bg-[url('/assets/temubelajar.webp')] bg-cover bg-center bg-fixed"></div>
          <div className="absolute inset-0 bg-black/60"></div>
          <div ref={section3Ref} className="relative z-10 text-center mt-16 md:mt-16 text-white transition-opacity duration-500 px-4" style={{ opacity: getOpacity(2) }}>
            <h1 ref={(el) => { titleRefs.current[2] = el; }} className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-wider mb-8 md:mb-12">
              TEMU
              <br />
              BELAJAR
            </h1>
            <div className="flex justify-center gap-4 md:gap-8 flex-wrap max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 md:px-8 py-4 md:py-6 rounded-lg hover:bg-white/20 transition-all duration-300 floating-btn hover:scale-105 flex-1 min-w-[150px] max-w-[200px]">
                <h3 className="text-sm md:text-lg font-semibold mb-2">WORKSHOP</h3>
                <p className="text-xs md:text-sm opacity-80">Praktik langsung</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 md:px-8 py-4 md:py-6 rounded-lg hover:bg-white/20 transition-all duration-300 floating-btn hover:scale-105 flex-1 min-w-[150px] max-w-[200px]">
                <h3 className="text-sm md:text-lg font-semibold mb-2">SEMINAR</h3>
                <p className="text-xs md:text-sm opacity-80">Diskusi dan sharing</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 md:px-8 py-4 md:py-6 rounded-lg hover:bg-white/20 transition-all duration-300 floating-btn hover:scale-105 flex-1 min-w-[150px] max-w-[200px]">
                <h3 className="text-sm md:text-lg font-semibold mb-2">WEBINAR</h3>
                <p className="text-xs md:text-sm opacity-80">Belajar online</p>
              </div>
            </div>
          </div>
        </section>
      </Link>
    </div>
  );
}
