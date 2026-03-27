'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Page, Service } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';

interface ServicesSectionProps {
  servicesSection: Page['servicesSection'];
  className?: string;
}

// Utility function to get full image URL
const getFullImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;

  // If it's already a full URL, return as-is
  if (url.startsWith('http')) {
    const isLocal = /^http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?\b/i.test(url);
    return isLocal ? url : url.replace(/^http:\/\//i, 'https://');
  }

  // Important: uploads are served from the backend root as `/uploads/*`, NOT `/api/uploads/*`.
  const apiBase = process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');
  const origin = apiBase.replace(/\/?api\/?$/, '');
  const isLocalOrigin = /^http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?\b/i.test(origin);
  const backendOrigin = isLocalOrigin ? origin : origin.replace(/^http:\/\//i, 'https://');

  if (url.startsWith('/uploads/')) {
    return `${backendOrigin}${url}`;
  }

  return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Sample tags for each service (can be customized in the builder later)
const defaultTags: Record<number, string[]> = {
  0: ['SaaS Platform', 'Web Platform', 'Mobile App'],
  1: ['UX Audit', 'Analysis', 'Research'],
  2: ['Net Core', 'PHP', 'React', 'Node.js', 'Angular'],
  3: ['Testing', 'Planning, creating following KPIs', 'Documentation'],
};

// Background colors for alternating expanded items
const bgColors = [
  'rgba(254, 249, 232, 0.6)', // Light yellow/beige
  'rgba(224, 242, 254, 0.6)', // Light blue
  'rgba(254, 242, 242, 0.6)', // Light red/pink
  'rgba(240, 253, 244, 0.6)', // Light green
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({ servicesSection, className }) => {
  const { site, services, loading } = useWebBuilder();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();

  if (!servicesSection?.enabled) return null;

  // Always use services from WebBuilder provider
  const displayServices = services;

  // Show loading state if services are still loading
  if (loading && services.length === 0) {
    return (
      <section className={cn('py-16 lg:py-24', className)} style={{ backgroundColor: themeColors.sectionBackground }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-8 p-8 rounded-2xl bg-gray-100 animate-pulse">
                <div className="w-12 h-8 bg-gray-300 rounded" />
                <div className="flex-1 space-y-3">
                  <div className="h-8 bg-gray-300 rounded w-64" />
                  <div className="h-4 bg-gray-300 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className={cn('py-16 lg:py-24', className)}
      style={{ backgroundColor: themeColors.sectionBackground }}
    >
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Section Header */}
        {(servicesSection.title || servicesSection.description) && (
          <div className="mb-12 text-center">
            {servicesSection.title && (
              <h2
                className="text-3xl lg:text-4xl font-semibold"
                style={{ color: themeColors.lightPrimaryText }}
              >
                <TiptapRenderer content={servicesSection.title} />
              </h2>
            )}
            {servicesSection.description && (
              <div
                className="mt-4 max-w-2xl mx-auto text-base"
                style={{ color: themeColors.lightSecondaryText }}
              >
                <TiptapRenderer content={servicesSection.description} />
              </div>
            )}
          </div>
        )}

        {/* Services List - Vertical numbered design */}
        <div className="space-y-0">
          {displayServices.map((service: any, index: number) => {
            const isActive = activeIndex === index;
            const serviceTags = service.tags || defaultTags[index] || [];
            const bgColor = isActive ? bgColors[index % bgColors.length] : 'transparent';
            
            return (
              <div
                key={service._id}
                className="group relative rounded-2xl transition-all duration-300"
                style={{
                  backgroundColor: isActive ? bgColor : 'transparent',
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex items-stretch gap-6 lg:gap-12 p-6 lg:p-8">
                  {/* Number */}
                  <div 
                    className="flex-shrink-0 text-sm font-medium pt-2"
                    style={{ 
                      color: themeColors.lightSecondaryText,
                      minWidth: '2rem',
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3
                      className="text-2xl lg:text-3xl font-medium tracking-tight"
                      style={{ 
                        color: themeColors.lightPrimaryText, 
                      }}
                    >
                      {service.name}
                    </h3>

                    {/* Tags */}
                    {serviceTags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {serviceTags.map((tag: string, tagIndex: number) => (
                          <React.Fragment key={tag}>
                            <span 
                              className="text-xs"
                              style={{ color: themeColors.lightSecondaryText }}
                            >
                              {tag}
                            </span>
                            {tagIndex < serviceTags.length - 1 && (
                              <span 
                                className="text-xs"
                                style={{ color: themeColors.lightSecondaryText }}
                              >•</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}

                    {/* Description - visible when active */}
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{
                        maxHeight: isActive ? '200px' : '0px',
                        opacity: isActive ? 1 : 0,
                        marginTop: isActive ? '1rem' : '0px',
                      }}
                    >
                      <div
                        className="text-sm leading-relaxed max-w-2xl"
                        style={{ 
                          color: themeColors.lightSecondaryText, 
                        }}
                      >
                        {typeof service.shortDescription === 'string' 
                          ? service.shortDescription 
                          : service.shortDescription && <TiptapRenderer content={service.shortDescription} />
                        }
                      </div>

                      {/* Learn More Link */}
                      <Link
                        href={`/service/${service.slug}`}
                        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105"
                        style={{
                          borderColor: themeColors.lightPrimaryText,
                          color: themeColors.lightPrimaryText,
                          backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = themeColors.lightPrimaryText;
                          e.currentTarget.style.color = themeColors.pageBackground;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = themeColors.lightPrimaryText;
                        }}
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>

                  {/* Service Image - Right side */}
                  {service.thumbnailImage && service.thumbnailImage.url && service.thumbnailImage.url.trim() !== '' ? (
                    <div className="flex-shrink-0 w-40 lg:w-64">
                      <div className="relative w-full h-full min-h-32 lg:min-h-40">
                        <img
                          src={getFullImageUrl(service.thumbnailImage.url) || ''}
                          alt={service.thumbnailImage.altText || service.name}
                          className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-sm transition-all duration-300 group-hover:scale-105"
                          style={{
                            opacity: isActive ? 1 : 0,
                            transform: isActive ? 'scale(1)' : 'scale(0.98)',
                            pointerEvents: 'none',
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Divider line */}
                {index < displayServices.length - 1 && (
                  <div 
                    className="mx-6 lg:mx-8 h-px"
                    style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
