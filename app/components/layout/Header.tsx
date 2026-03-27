'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { getImageSrc } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { site, pages, services, serviceAreaPages } = useWebBuilder();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  
  // Delay timeouts for smoother hover
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const serviceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
      if (serviceTimeoutRef.current) clearTimeout(serviceTimeoutRef.current);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setIsServicesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!site) return null;

  const publishedPages = pages.filter(page => page.status === 'published');
  const contactPage = publishedPages.find(p => p.slug.includes('contact'));
  
  // Define the order for navigation pages
  const pageOrder = ['home', 'about', 'service-list', 'blog-list'];
  
  // Sort pages according to the defined order, then by name for remaining pages
  const navPages = publishedPages
    .filter(p => !p.slug.includes('contact'))
    .sort((a, b) => {
      const aIndex = pageOrder.indexOf(a.pageType);
      const bIndex = pageOrder.indexOf(b.pageType);
      
      // If both are in the defined order, sort by that order
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      // If only one is in the defined order, prioritize it
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      // For remaining pages, sort alphabetically
      return a.name.localeCompare(b.name);
    });

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        isScrolled ? 'py-4' : 'py-8'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12">
        {/* Main Nav Pill - Glassmorphism effect */}
        <div 
          className={`flex items-center justify-between px-6 lg:px-10 h-20 rounded-full border transition-all duration-500 shadow-2xl ${
            isScrolled 
              ? 'bg-white/10 backdrop-blur-xl border-black/5' 
              : 'bg-white/90 backdrop-blur-md border-white/20'
          }`}
          style={{ color: isScrolled ? themeColors.darkPrimaryText : themeColors.primaryButton }}
        >
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {site.theme.logoUrl ? (
              <img
                src={getImageSrc(site.theme.logoUrl)}
                alt={site.business.name}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <span 
                className="text-xl font-black uppercase tracking-tighter"
                style={{ fontFamily: themeFonts.heading, color: isScrolled ? themeColors.darkPrimaryText : themeColors.lightPrimaryText }}
              >
                {site.business.name || 'Buildify'}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navPages.map((page) => {
              // Check if this is the services page
              if (page.pageType === 'service-list') {
                return (
                  <div
                    key={page.slug}
                    ref={servicesDropdownRef}
                    className="relative"
                    onMouseEnter={() => {
                      // Clear any existing timeout
                      if (dropdownTimeoutRef.current) {
                        clearTimeout(dropdownTimeoutRef.current);
                      }
                      setIsServicesDropdownOpen(true);
                    }}
                    onMouseLeave={() => {
                      // Add delay before closing
                      dropdownTimeoutRef.current = setTimeout(() => {
                        setIsServicesDropdownOpen(false);
                      }, 200); // 200ms delay
                    }}
                  >
                    <Link
                      href={`/${page.slug}`}
                      className={`text-xs font-bold uppercase tracking-[0.2em] transition-all hover:opacity-50 flex items-center gap-1 ${
                        isScrolled ? 'text-black' : 'text-white'
                      }`}
                      style={{ color: isScrolled ? themeColors.darkSecondaryText : themeColors.primaryButton }}
                    >
                      {page.name}
                      {/* Add dropdown arrow indicator */}
                      <svg 
                        className="w-3 h-3 transition-transform duration-200" 
                        style={{ transform: isServicesDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>

                    {/* Dropdown Menu */}
                    {isServicesDropdownOpen && (
                      <div 
                        className="absolute top-full left-0 mt-3 w-80 rounded-2xl shadow-2xl border py-3 z-50 backdrop-blur-xl"
                        style={{ 
                          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                          borderColor: isScrolled ? `${themeColors.darkSecondaryText}20` : `${themeColors.primaryButton}30`
                        }}
                        onMouseEnter={() => {
                          // Clear any existing timeout when entering dropdown
                          if (dropdownTimeoutRef.current) {
                            clearTimeout(dropdownTimeoutRef.current);
                          }
                        }}
                        onMouseLeave={() => {
                          // Add delay before closing when leaving dropdown
                          dropdownTimeoutRef.current = setTimeout(() => {
                            setIsServicesDropdownOpen(false);
                          }, 200);
                        }}
                      >
                        {/* Services Section */}
                        {services && services.length > 0 && (
                          <div className="py-2">
                            <div 
                              className="px-5 py-2 text-xs font-black uppercase tracking-[0.3em] border-b"
                              style={{ 
                                color: themeColors.primaryButton,
                                borderColor: `${themeColors.primaryButton}20`,
                                fontFamily: themeFonts.body
                              }}
                            >
                              Services
                            </div>
                            {services
                              .filter(service => service.status === 'published')
                              .map((service) => {
                                // Get service areas from the service's own serviceAreas field
                                const serviceAreasForService = service.serviceAreas || [];

                                return (
                                  <div
                                    key={service.slug}
                                    className="relative group"
                                    onMouseEnter={() => {
                                      // Clear any existing timeout
                                      if (serviceTimeoutRef.current) {
                                        clearTimeout(serviceTimeoutRef.current);
                                      }
                                      setHoveredService(service._id);
                                    }}
                                    onMouseLeave={() => {
                                      // Add delay before closing nested dropdown
                                      serviceTimeoutRef.current = setTimeout(() => {
                                        setHoveredService(null);
                                      }, 150); // 150ms delay for nested dropdown
                                    }}
                                  >
                                    <Link
                                      href={`/service/${service.slug}`}
                                      className="block px-5 py-3 transition-all duration-300 hover:bg-gray-50"
                                      style={{ 
                                        color: themeColors.darkSecondaryText,
                                        fontFamily: themeFonts.body
                                      }}
                                      onClick={() => setIsServicesDropdownOpen(false)}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{service.name}</span>
                                        {serviceAreasForService.length > 0 && (
                                          <svg 
                                            className="w-3 h-3 transition-transform duration-200" 
                                            style={{ 
                                              color: themeColors.primaryButton,
                                              transform: hoveredService === service._id ? 'rotate(180deg)' : 'rotate(0deg)'
                                            }}
                                            fill="currentColor" 
                                            viewBox="0 0 20 20"
                                          >
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                          </svg>
                                        )}
                                      </div>
                                    </Link>

                                    {/* Nested Service Areas Dropdown */}
                                    {serviceAreasForService.length > 0 && hoveredService === service._id && (
                                      <div 
                                        className="absolute left-full top-0 ml-2 w-72 rounded-2xl shadow-2xl border py-3 z-50 backdrop-blur-xl"
                                        style={{ 
                                          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                                          borderColor: isScrolled ? `${themeColors.darkSecondaryText}10` : `${themeColors.primaryButton}20`
                                        }}
                                        onMouseEnter={() => {
                                          // Clear any existing timeout when entering nested dropdown
                                          if (serviceTimeoutRef.current) {
                                            clearTimeout(serviceTimeoutRef.current);
                                          }
                                        }}
                                        onMouseLeave={() => {
                                          // Add delay before closing nested dropdown
                                          serviceTimeoutRef.current = setTimeout(() => {
                                            setHoveredService(null);
                                          }, 150);
                                        }}
                                      >
                                        <div 
                                          className="px-5 py-2 text-xs font-black uppercase tracking-[0.3em] border-b"
                                          style={{ 
                                            color: themeColors.primaryButton,
                                            borderColor: `${themeColors.primaryButton}20`,
                                            fontFamily: themeFonts.body
                                          }}
                                        >
                                          Service Areas
                                        </div>
                                        {serviceAreasForService.map((area, index) => {
                                          // Generate slug for service area including region for uniqueness
                                          const regionName = area.region || '';
                                          const citySlug = regionName 
                                            ? `${String(area.city).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${String(regionName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
                                            : String(area.city)
                                                .toLowerCase()
                                                .replace(/[^a-z0-9]+/g, '-')
                                                .replace(/^-|-$/g, '');
                                          
                                          return (
                                            <Link
                                              key={index}
                                              href={`/service/${service.slug}/service-areas/${citySlug}`}
                                              className="block px-5 py-3 transition-all duration-300 hover:bg-gray-50"
                                              style={{ 
                                                color: themeColors.darkSecondaryText,
                                                fontFamily: themeFonts.body
                                              }}
                                              onClick={() => setIsServicesDropdownOpen(false)}
                                            >
                                              <span className="text-sm font-medium">{area.city}, {area.region}</span>
                                            </Link>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              // Regular navigation items
              return (
                <Link
                  key={page.slug}
                  href={page.pageType === 'home' ? '/' : `/${page.slug}`}
                  className={`text-xs font-bold uppercase tracking-[0.2em] transition-all hover:opacity-50 ${
                    isScrolled ? 'text-black' : 'text-white'
                  }`}
                  style={{ color: isScrolled ? themeColors.darkSecondaryText : themeColors.primaryButton }}
                >
                  {page.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Section */}
          <div className="flex items-center gap-2">
            <Link
              href={contactPage ? `/${contactPage.slug}` : '#'}
              className="hidden md:flex items-center h-12 px-8 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all"
              style={{
                backgroundColor: isScrolled ? themeColors.darkPrimaryText : themeColors.primaryButton,
                color: isScrolled ? themeColors.primaryButton : themeColors.darkPrimaryText
              }}
            >
              {contactPage?.name || 'Contact Us'}
            </Link>
            
            {/* Arrow Button - Architectural style */}
            <div 
              className="w-12 h-12 flex items-center justify-center rounded-full border transition-all"
              style={{ 
                borderColor: isScrolled ? `${themeColors.darkPrimaryText}20` : `${themeColors.primaryButton}30`,
                color: isScrolled ? themeColors.lightPrimaryText : themeColors.primaryButton
              }}
            >
              <ArrowUpRight size={18} />
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 transition-colors"
              style={{ color: isScrolled ? themeColors.darkPrimaryText : themeColors.primaryButton }}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Overlay */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="fixed inset-0 bg-white z-[200] flex flex-col p-10 animate-in fade-in zoom-in duration-300"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="text-xl font-black uppercase tracking-tighter" style={{ color: themeColors.darkPrimaryText }}>
                {site.business.name}
              </span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2"
                style={{ color: themeColors.darkPrimaryText }}
              >
                <X size={32} />
              </button>
            </div>
            
            <div className="flex flex-col space-y-6">
              {navPages.map((page) => (
                <Link
                  key={page.slug}
                  href={page.pageType === 'home' ? '/' : `/${page.slug}`}
                  className="text-4xl font-black uppercase tracking-tighter text-black hover:italic"
                  style={{ fontFamily: themeFonts.heading, color: themeColors.darkPrimaryText }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {page.name}
                </Link>
              ))}
              
              {/* Add Contact button at the end of mobile menu */}
              {contactPage && (
                <Link
                  href={`/${contactPage.slug}`}
                  className="text-4xl font-black uppercase tracking-tighter text-black hover:italic"
                  style={{ fontFamily: themeFonts.heading, color: themeColors.darkPrimaryText }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {contactPage.name}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};