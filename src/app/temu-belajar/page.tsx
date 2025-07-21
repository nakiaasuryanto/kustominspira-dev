'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabaseDataManager as dataManager } from '@/lib/supabaseDataManager';
import { Event } from '@/lib/supabase';

export default function TemuBelajar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<(Event & { dateObj: Date })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load fresh data on component mount
    const loadData = async () => {
      try {
        setLoading(true);
        const eventsData = await dataManager.getEvents();
        // Convert date strings to Date objects for calendar functionality
        const eventsWithDateObj = eventsData.map(event => ({
          ...event,
          dateObj: new Date(event.date)
        }));
        setEvents(eventsWithDateObj);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);


  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date: Date) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[date.getMonth()];
  };

  const isSameDay = (date1: Date, date2: Date) => {
    if (!date1 || !date2) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const hasEventOnDate = (date: Date) => {
    return events.some(event => isSameDay(event.dateObj, date));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.dateObj, date));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const filteredEvents = activeFilter === 'all' 
    ? events 
    : events.filter(event => event.category === activeFilter);

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'workshop': return 'bg-blue-100 text-blue-600';
      case 'seminar': return 'bg-green-100 text-green-600';
      case 'webinar': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'workshop': return 'Workshop';
      case 'seminar': return 'Seminar';
      case 'webinar': return 'Webinar';
      default: return 'Event';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1ca4bc] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
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
            <Link href="/temu-belajar" className="text-[#1ca4bc] font-medium text-sm lg:text-base">Temu Belajar</Link>
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

      {/* Mobile Menu */}
      <div className={`fixed top-16 left-0 right-0 z-40 bg-white shadow-lg border-b border-gray-200 transform transition-transform duration-300 md:hidden ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="text-gray-700 hover:text-[#1ca4bc] transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/pusat-belajar" className="text-gray-700 hover:text-[#1ca4bc] transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Pusat Belajar</Link>
            <Link href="/temu-belajar" className="text-[#1ca4bc] font-bold" onClick={() => setIsMenuOpen(false)}>Temu Belajar</Link>
            <Link href="/gallery" className="text-gray-700 hover:text-[#1ca4bc] transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
            <a href="https://kustompedia.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#1ca4bc] transition-colors font-medium">Kustompedia</a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-20 md:pt-24 pb-12 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/assets/temubelajar.webp" 
            alt="Temu Belajar" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-left max-w-3xl py-12 md:py-20">
            <span className="text-white font-bold text-sm md:text-lg tracking-wide">#DariKainJadiKarya</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-2 mb-4 md:mb-6">
              <span className="text-[#1ca4bc]">Temu</span> Belajar
            </h1>
            <p className="text-base md:text-xl text-white/90 leading-relaxed mb-6 md:mb-8">
              Bergabunglah dalam <span className="font-bold text-white">workshop</span> praktis, <span className="font-bold text-white">seminar</span> inspiratif, dan <span className="font-bold text-white">webinar</span> interaktif bersama komunitas penjahit dan desainer fashion terbaik.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <button 
                onClick={() => setActiveTab('events')}
                className="bg-[#1ca4bc] text-white px-4 md:px-8 py-2 md:py-3 rounded-lg hover:bg-[#159bb3] transition-colors text-sm md:text-base"
              >
                Daftar Event
              </button>
              <button 
                onClick={() => setActiveTab('calendar')}
                className="bg-[#1ca4bc] text-white px-4 md:px-8 py-2 md:py-3 rounded-lg hover:bg-[#159bb3] transition-colors text-sm md:text-base"
              >
                Lihat Jadwal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Tabs */}
          <div className="flex justify-center mb-8 md:mb-12 overflow-x-auto">
            <div className="bg-white rounded-lg p-1 md:p-2 shadow-sm border min-w-max">
              <button
                onClick={() => setActiveTab('events')}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-md font-medium transition-colors text-sm md:text-base ${
                  activeTab === 'events' 
                    ? 'bg-[#1ca4bc] text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Events
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'calendar' 
                    ? 'bg-[#1ca4bc] text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Calendar
              </button>
            </div>
          </div>

          {activeTab === 'events' && (
            <>
              {/* Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-[#1ca4bc] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFilter('workshop')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    activeFilter === 'workshop'
                      ? 'bg-[#1ca4bc] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Workshop
                </button>
                <button
                  onClick={() => setActiveFilter('seminar')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    activeFilter === 'seminar'
                      ? 'bg-[#1ca4bc] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Seminar
                </button>
                <button
                  onClick={() => setActiveFilter('webinar')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    activeFilter === 'webinar'
                      ? 'bg-[#1ca4bc] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Webinar
                </button>
              </div>

              {/* Events Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={event.image_url || event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                          {getCategoryLabel(event.category)}
                        </span>
                        <span className="text-white font-bold text-lg">
                          {event.price}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">{event.date}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm">{event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm">{event.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {event.spots}
                        </span>
                        <button 
                          onClick={() => {
                            if (event.registration_url) {
                              window.open(event.registration_url, '_blank');
                            } else {
                              // Default registration action - could open a modal or redirect
                              alert(`Pendaftaran untuk ${event.title} akan segera dibuka!`);
                            }
                          }}
                          className="bg-[#1ca4bc] text-white px-6 py-2 rounded-lg hover:bg-[#159bb3] transition-colors font-medium"
                        >
                          Daftar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'calendar' && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Calendar */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Calendar Header */}
                  <div className="bg-[#1ca4bc] text-white p-6">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => navigateMonth('prev')}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <h2 className="text-2xl font-bold">
                        {getMonthName(currentDate)} {currentDate.getFullYear()}
                      </h2>
                      <button
                        onClick={() => navigateMonth('next')}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="p-6">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 mb-4">
                      {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                        <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {/* Empty cells for days before month starts */}
                      {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, index) => (
                        <div key={`empty-${index}`} className="h-12"></div>
                      ))}
                      
                      {/* Days of the month */}
                      {Array.from({ length: getDaysInMonth(currentDate) }).map((_, index) => {
                        const day = index + 1;
                        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const hasEvent = hasEventOnDate(date);
                        const isSelected = selectedDate && isSameDay(date, selectedDate);
                        const isToday = isSameDay(date, new Date());

                        return (
                          <button
                            key={day}
                            onClick={() => setSelectedDate(date)}
                            className={`h-12 rounded-lg flex items-center justify-center text-sm font-medium transition-all relative ${
                              isSelected
                                ? 'bg-[#1ca4bc] text-white'
                                : isToday
                                ? 'bg-white text-black font-bold'
                                : hasEvent
                                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            {day}
                            {hasEvent && (
                              <div className={`absolute bottom-1 w-1 h-1 rounded-full ${
                                isSelected || isToday ? 'bg-white' : 'bg-[#1ca4bc]'
                              }`}></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Details for Selected Date */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {selectedDate ? (
                      `Events - ${selectedDate.getDate()} ${getMonthName(selectedDate)}`
                    ) : (
                      'Pilih Tanggal'
                    )}
                  </h3>
                  
                  {selectedDate ? (
                    <div className="space-y-4">
                      {getEventsForDate(selectedDate).length > 0 ? (
                        getEventsForDate(selectedDate).map(event => (
                          <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#1ca4bc] transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                                {getCategoryLabel(event.category)}
                              </span>
                              <span className="text-white font-bold text-sm">
                                {event.price}
                              </span>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {event.time}
                              </div>
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {event.location}
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                if (event.registration_url) {
                                  window.open(event.registration_url, '_blank');
                                } else {
                                  alert(`Pendaftaran untuk ${event.title} akan segera dibuka!`);
                                }
                              }}
                              className="w-full mt-3 bg-[#1ca4bc] text-white py-2 rounded-lg hover:bg-[#159bb3] transition-colors text-sm"
                            >
                              Daftar Sekarang
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-gray-500">Tidak ada event pada tanggal ini</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500">Klik pada tanggal untuk melihat event</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section - Same as Pusat Belajar */}
      <section className="py-20 bg-gradient-to-br from-[#1ca4bc] to-[#159bb3] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Part of
              </h2>
              <img 
                src="/assets/kustompedia.png" 
                alt="Kustompedia" 
                className="h-12 md:h-16 w-auto cursor-pointer hover:scale-105 transition-transform duration-300 bg-white/20 px-4 py-2 rounded-lg"
                onClick={() => window.open('https://kustompedia.com', '_blank')}
              />
            </div>
            <p className="text-white text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
              Kami membangun <span className="font-bold text-white">ekosistem</span> yang mendukung <span className="font-bold text-white">penjahit lokal</span>, mendorong <span className="font-bold text-white">inovasi produk</span>, dan mengutamakan <span className="font-bold text-white">keberlanjutan</span> di setiap langkah
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
              <Link href="/">
                <img 
                  src="/assets/Kustom Inspira - putih.png" 
                  alt="Kustom Inspira" 
                  className="h-12 w-auto mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
              <p className="text-gray-400">
                <span className="font-bold text-white">#DariKainJadiKarya</span><br />
                Belajar dan praktek langsung di Kustominspira.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-white">Pusat Belajar</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Artikel</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Video Tutorial</a></li>
                <li><a href="#" className="hover:text-white transition-colors">E-Book</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-white">Temu Belajar</h3>
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