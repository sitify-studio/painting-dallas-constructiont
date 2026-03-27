'use client';

import React from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn, getImageSrc } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';

interface CompanyDetailSectionProps {
  companyDetailSection: Page['companyDetailSection'];
  className?: string;
}

type CompanyDetailItem = NonNullable<NonNullable<Page['companyDetailSection']>['details']>[number];

export const CompanyDetailSection: React.FC<CompanyDetailSectionProps> = ({ companyDetailSection, className }) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();

  if (!companyDetailSection?.enabled) return null;

  const details: CompanyDetailItem[] = companyDetailSection.details || [];

  return (
    <section 
      className={cn('py-24 lg:py-32', className)} 
      style={{ backgroundColor: themeColors.pageBackground }}
    >
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        {/* Header Section */}
        {(companyDetailSection.title || companyDetailSection.description) && (
          <div className="mb-20 max-w-4xl">
            <span 
              className="text-[10px] tracking-[0.4em] uppercase font-bold opacity-60 block mb-6"
              style={{ color: themeColors.lightPrimaryText }}
            >
              Company Insights
            </span>
            {companyDetailSection.title && (
              <h2
                className="text-4xl lg:text-6xl font-semibold leading-[1.1] tracking-tight"
                style={{ color: themeColors.lightPrimaryText }}
              >
                <TiptapRenderer content={companyDetailSection.title} />
              </h2>
            )}
            {companyDetailSection.description && (
              <div
                className="mt-8 text-lg lg:text-xl leading-relaxed opacity-80"
                style={{ color: themeColors.lightSecondaryText }}
              >
                <TiptapRenderer content={companyDetailSection.description} />
              </div>
            )}
          </div>
        )}

        {/* Details Grid */}
        {details.length > 0 && (
          <div className="space-y-32 lg:space-y-48">
            {details.map((d, idx) => {
              const title = d?.title || d?.label;
              const description = d?.description || d?.value;
              const imageUrl = d?.image?.url;
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  className={cn(
                    "flex flex-col lg:items-center gap-12 lg:gap-24",
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  )}
                >
                  {/* Image Side */}
                  <div className="w-full lg:w-3/5">
                    {imageUrl ? (
                      <div className="relative group overflow-hidden">
                        <img
                          src={getImageSrc(imageUrl)}
                          alt={d?.image?.altText || 'Detail image'}
                          className="w-full h-[400px] lg:h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                      </div>
                    ) : (
                      <div 
                        className="w-full h-[300px] lg:h-[400px] rounded-[2.5rem] flex items-center justify-center"
                        style={{ backgroundColor: `${themeColors.inactive}15` }}
                      >
                         <span className="opacity-20 text-4xl font-bold">0{idx + 1}</span>
                      </div>
                    )}
                  </div>

                  {/* Content Side */}
                  <div className="w-full lg:w-2/5">
                    <div className="max-w-md">
                      <span 
                        className="text-4xl lg:text-5xl font-serif italic mb-6 block"
                        style={{ color: themeColors.primaryButton }}
                      >
                        0{idx + 1}.
                      </span>
                      {title && (
                        <h3
                          className="text-3xl lg:text-4xl font-semibold mb-6"
                          style={{ color: themeColors.lightPrimaryText }}
                        >
                          <TiptapRenderer content={title} />
                        </h3>
                      )}
                      {description && (
                        <div
                          className="text-lg leading-relaxed opacity-70"
                          style={{ color: themeColors.lightSecondaryText }}
                        >
                          <TiptapRenderer content={description} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanyDetailSection;