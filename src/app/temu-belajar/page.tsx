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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventPopup, setShowEventPopup] = useState(false);

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

  const handleEventDetail = (event: Event) => {
    setSelectedEvent(event);
    setShowEventPopup(true);
  };

  const handleRegister = (event: Event) => {
    if (event.daftar_link) {
      window.open(event.daftar_link, '_blank');
    } else {
      alert(`Pendaftaran untuk ${event.title} akan segera dibuka!`);
    }
    setShowEventPopup(false);
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
      {/* Fixed Navigation */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center p-4 md:p-6 text-gray-900 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <Link href="/" className="h-8 md:h-12">
          <img 
            src="/assets/Kustom Inspira.png" 
            alt="Kustom Inspira Logo" 
            className="h-full w-auto"
          />
        </Link>
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
                className="block text-4xl md:text-6xl lg:text-7xl font-black text-[#1ca4bc] transform translate-x-4 duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                TEMU BELAJAR
              </Link>
              <Link 
                href="/gallery" 
                className="block text-4xl md:text-6xl lg:text-7xl font-black text-white hover:text-[#1ca4bc] transition-all duration-300 transform hover:translate-x-4"
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
                          onClick={() => handleEventDetail(event)}
                          className="bg-[#1ca4bc] text-white px-6 py-2 rounded-lg hover:bg-[#159bb3] transition-colors font-medium"
                        >
                          Detail
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
                              onClick={() => handleEventDetail(event)}
                              className="w-full mt-3 bg-[#1ca4bc] text-white py-2 rounded-lg hover:bg-[#159bb3] transition-colors text-sm"
                            >
                              Lihat Detail
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
                className="h-8 md:h-12 lg:h-16 w-auto cursor-pointer hover:scale-105 transition-transform duration-300 bg-white/20 px-2 md:px-4 py-1 md:py-2 rounded-lg"
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

      {/* Event Detail Popup */}
      {showEventPopup && selectedEvent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEventPopup(false)}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header Image */}
            <div className="relative h-48 md:h-64 overflow-hidden rounded-t-2xl">
              <img 
                src={selectedEvent.image_url || selectedEvent.image || '/assets/temubelajar.webp'} 
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Close Button */}
              <button 
                onClick={() => setShowEventPopup(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedEvent.category)}`}>
                  {getCategoryLabel(selectedEvent.category)}
                </span>
              </div>
              
              {/* Title Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {selectedEvent.title}
                </h2>
                <div className="text-white/90 font-semibold text-lg">
                  {selectedEvent.price}
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Event Details */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-[#1ca4bc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-[#1ca4bc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-[#1ca4bc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{selectedEvent.location}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-[#1ca4bc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium">{selectedEvent.spots} spots available</span>
                  </div>
                  {selectedEvent.penyelenggara && (
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 text-[#1ca4bc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-medium">{selectedEvent.penyelenggara}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi Event</h3>
                <div className="text-gray-600 leading-relaxed space-y-3">
                  {selectedEvent.description ? 
                    selectedEvent.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-600 leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    )) : 
                    <p className="text-gray-500 italic">Deskripsi event akan segera ditambahkan.</p>
                  }
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => handleRegister(selectedEvent)}
                  className="flex-1 bg-gradient-to-r from-[#1ca4bc] to-[#159bb3] text-white py-3 px-6 rounded-lg hover:from-[#159bb3] hover:to-[#1ca4bc] transition-all duration-300 font-semibold text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Daftar Sekarang
                </button>
                <button 
                  onClick={() => setShowEventPopup(false)}
                  className="flex-1 sm:flex-none bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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