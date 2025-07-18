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

      {/* Slide-out Menu */}
      <div className={`fixed inset-0 z-50 transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex h-full flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-12 text-white overflow-y-auto" style={{backgroundColor: '#021012'}}>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl sm:text-3xl hover:rotate-90 transition-transform duration-300 z-10"
            >
              ×
            </button>
            
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8 mt-12 sm:mt-14 lg:mt-16">Berikan kami<br />saran dan kritik</h2>
            
            <a href="mailto:kustompedia@gmail.com" className="border border-white px-3 sm:px-4 lg:px-6 py-2 lg:py-3 text-xs sm:text-sm tracking-wider mb-6 sm:mb-8 lg:mb-16 hover:bg-white hover:text-gray-900 transition-colors inline-block">
              Hubungi Kami
            </a>
            
            <div className="space-y-4 sm:space-y-6 lg:space-y-12">
              <div>
                <h3 className="text-xs tracking-wider text-gray-400 mb-2 sm:mb-4">MAIN OFFICE</h3>
                <p className="text-sm lg:text-lg">Jl. Sidosermo Indah Gg. III No. 37,<br />Surabaya, 60239</p>
                <p className="text-sm lg:text-lg mt-2">+62 (851) 7311-2499</p>
              </div>
              
              <div>
                <h3 className="text-xs tracking-wider text-gray-400 mb-2 sm:mb-4">OUR BRANDS</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-2 sm:mt-4">
                  <img src="/assets/Kustom Inspira - putih.png" alt="Kustom Inspira" className="h-8 sm:h-12 lg:h-16 w-auto hover:scale-110 transition-transform duration-300 cursor-pointer" />
                  <img src="/assets/KG.png" alt="KG" className="h-8 sm:h-12 lg:h-16 w-auto hover:scale-110 transition-transform duration-300 cursor-pointer" />
                  <img src="/assets/KP.png" alt="KP" className="h-8 sm:h-12 lg:h-16 w-auto hover:scale-110 transition-transform duration-300 cursor-pointer" />
                  <img src="/assets/KC.png" alt="KC" className="h-8 sm:h-12 lg:h-16 w-auto hover:scale-110 transition-transform duration-300 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-12 flex flex-col justify-center overflow-y-auto" style={{backgroundColor: '#1ca4bc'}}>
            <nav className="space-y-3 sm:space-y-4 lg:space-y-8">
              <a href="#" className="block text-2xl sm:text-3xl lg:text-6xl font-bold text-white hover:font-black transition-all" onClick={() => setIsMenuOpen(false)}>Home</a>
              <a href="/pusat-belajar" className="block text-2xl sm:text-3xl lg:text-6xl font-bold text-gray-300 hover:text-white hover:font-black transition-all" onClick={() => setIsMenuOpen(false)}>Pusat Belajar</a>
              <a href="/temu-belajar" className="block text-2xl sm:text-3xl lg:text-6xl font-bold text-gray-300 hover:text-white hover:font-black transition-all" onClick={() => setIsMenuOpen(false)}>Temu Belajar</a>
              <a href="https://kustompedia.com" target="_blank" rel="noopener noreferrer" className="block text-2xl sm:text-3xl lg:text-6xl font-bold text-gray-300 hover:text-white hover:font-black transition-all">Kustompedia</a>
            </nav>
          </div>
        </div>
      </div>

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
