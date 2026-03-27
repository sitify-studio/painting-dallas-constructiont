'use client';

import React from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc } from '@/app/lib/utils';
import { cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';

interface AboutSectionProps {
  aboutSection: Page['aboutSection'];
  className?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ aboutSection, className }) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();

  if (!aboutSection?.enabled) return null;

  const imageUrl = aboutSection.image 
    ? getImageSrc(
        typeof aboutSection.image === 'object' && aboutSection.image !== null
          ? aboutSection.image.url
          : aboutSection.image
      )
    : null;

  return (
    <section 
      className={cn('py-20 lg:py-32 overflow-hidden', className)}
      style={{ backgroundColor: themeColors.pageBackground || '#F5F2ED' }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left side - Image with Floating Badge */}
          <div className="relative order-2 lg:order-1">
            {imageUrl ? (
              <div className="relative">
                <div 
                  className="overflow-hidden shadow-2xl"
                  style={{ aspectRatio: '1/1' }}
                >
                  <img
                    src={imageUrl}
                    alt={typeof aboutSection.image === 'object' ? aboutSection.image?.altText || 'Our Story' : 'Our Story'}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Floating "Quote" Badge - Reference Image Style */}
                <div className="absolute -bottom-6 right-6 lg:-right-8 bg-white/90 backdrop-blur-md px-8 py-5 shadow-xl border border-white/20 max-w-[240px]">
                  <p 
                    className="text-sm italic text-center"
                    style={{ color: '#8B6E4E' }}
                  >
                    "About Us"
                  </p>
                </div>
              </div>
            ) : (
              <div className="aspect-square rounded-[40px] bg-neutral-200 flex items-center justify-center italic text-neutral-400">
                Image Placeholder
              </div>
            )}
          </div>

          {/* Right side - Editorial Content */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Small Label - Reference Style */}
            <div className="space-y-2">
              <span 
                className="text-[10px] tracking-[0.3em] uppercase font-bold"
                style={{ color: '#8B6E4E' }}
              >
                OUR STORY
              </span>
              <div className="w-10 h-[1px] bg-[#8B6E4E]/30" />
            </div>

            {/* Title - Elegant Serif */}
            {aboutSection.title && (
              <h2 
                className="text-4xl lg:text-6xl font-serif leading-[1.15]"
                style={{ 
                  color: themeColors.lightPrimaryText || '#1A1A1A' 
                }}
              >
                <TiptapRenderer content={aboutSection.title} />
              </h2>
            )}

            {/* Description - Refined Body Text */}
            {aboutSection.description && (
              <div 
                className="text-base lg:text-lg leading-relaxed text-black/70 space-y-4"
                style={{}}
              >
                <TiptapRenderer content={aboutSection.description} />
              </div>
            )}

            {/* CTA Link - Underlined Style */}
            <div className="pt-4">
              <a 
                href="/about-us"
                className="inline-block text-sm font-bold tracking-wider uppercase border-b border-black/20 pb-1 transition-all hover:border-black"
                style={{ color: themeColors.lightPrimaryText || '#1A1A1A' }}
              >
                Read More About Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;