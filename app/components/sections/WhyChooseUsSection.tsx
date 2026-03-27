'use client';

import React from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';

interface WhyChooseUsSectionProps {
  whyChooseUsSection: Page['whyChooseUsSection'];
  className?: string;
}

type WhyChooseUsItem = NonNullable<NonNullable<Page['whyChooseUsSection']>['items']>[number];

export const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({ whyChooseUsSection, className }) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();

  if (!whyChooseUsSection?.enabled) return null;

  const items: WhyChooseUsItem[] = whyChooseUsSection.items || [];

  return (
    <section 
      className={cn('py-20 lg:py-32', className)} 
      style={{ backgroundColor: themeColors.pageBackground || '#F5F2ED' }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header Area */}
        {(whyChooseUsSection.title || whyChooseUsSection.description) && (
          <div className="mb-16 lg:mb-24 text-center">
             <div className="mb-6 flex items-center justify-center gap-3">
                <span 
                    className="text-[10px] tracking-[0.4em] uppercase font-bold"
                    style={{ color: '#8B6E4E' }}
                >
                    OUR VALUES
                </span>
                <div className="w-12 h-[1px] bg-[#8B6E4E]/30" />
            </div>

            {whyChooseUsSection.title && (
              <h2
                className="text-3xl lg:text-4xl font-serif leading-tight mb-6"
                style={{ color: themeColors.lightPrimaryText }}
              >
                <TiptapRenderer content={whyChooseUsSection.title} />
              </h2>
            )}
            
            {whyChooseUsSection.description && (
              <div
                className="text-base lg:text-lg font-light leading-relaxed mx-auto opacity-80"
                style={{ color: themeColors.lightSecondaryText }}
              >
                <TiptapRenderer content={whyChooseUsSection.description} />
              </div>
            )}
          </div>
        )}

        {/* Content Area - Minimalist List Layout */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="group flex flex-col space-y-6"
              >
                {/* Numbering Detail */}
                <div 
                  className="text-sm font-bold tracking-tighter opacity-30 group-hover:opacity-100 transition-opacity"
                  style={{ color: '#8B6E4E' }}
                >
                  {(idx + 1).toString().padStart(2, '0')}
                </div>

                {item?.title && (
                  <h3
                    className="text-xl font-serif"
                    style={{ color: themeColors.lightPrimaryText }}
                  >
                    <TiptapRenderer content={item.title} />
                  </h3>
                )}

                <div className="w-full h-[1px] bg-black/5" />

                {item?.description && (
                  <div
                    className="text-sm leading-relaxed opacity-70 font-light"
                    style={{ color: themeColors.lightSecondaryText }}
                  >
                    <TiptapRenderer content={item.description} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WhyChooseUsSection;