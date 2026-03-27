'use client';

import React, { useMemo } from 'react';
import { cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { MapPin } from 'lucide-react';

interface ServingAreasSectionProps {
  enabled?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

export const ServingAreasSection: React.FC<ServingAreasSectionProps> = ({
  enabled = true,
  title,
  description,
  className,
}) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();
  const { site } = useWebBuilder();

  const areas = useMemo(() => {
    return Array.isArray(site?.serviceAreas) ? site!.serviceAreas.filter(Boolean) : [];
  }, [site?.serviceAreas]);

  if (!site || areas.length === 0 || !enabled) return null;

  const resolvedTitle = title || `${site?.business?.name || site?.name || ''} Locations`.trim() || 'Locations';
  const resolvedDescription = description || 'Discover the locales where we offer our bespoke services.';

  return (
    <section
      className={cn('py-24 lg:py-32', className)}
      style={{ backgroundColor: themeColors.sectionBackground }}
    >
      <div className="container mx-auto px-6">
        
        {/* Editorial Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            {/* Heritage Label */}
            <div className="mb-6 flex items-center gap-3">
              <span 
                className="text-[10px] tracking-[0.4em] uppercase font-bold"
                style={{ color: themeColors.primaryButton }}
              >
                OUR REACH
              </span>
              <div className="w-12 h-[1px]" style={{ backgroundColor: `${themeColors.primaryButton}40` }} />
            </div>

            {resolvedTitle && (
              <h2
                className="text-5xl lg:text-7xl font-serif leading-tight"
                style={{ color: themeColors.lightPrimaryText }}
              >
                {resolvedTitle}
              </h2>
            )}
          </div>

          {resolvedDescription && (
            <div
              className="max-w-sm text-lg font-light leading-relaxed opacity-70"
              style={{ color: themeColors.lightSecondaryText }}
            >
              {resolvedDescription}
            </div>
          )}
        </div>

        {/* Areas Display - Clean Architectural Layout */}
        <div className="max-w-7xl">
          <div className="flex flex-wrap gap-y-12 gap-x-16 border-t pt-16" style={{ borderColor: `${themeColors.inactive}30` }}>
            {areas.map((area, idx) => {
              const citySlug = String(area)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');

              return (
                <div key={`${area}-${idx}`} className="group relative">
                  <div
                    className="flex flex-col gap-4 transition-all duration-500"
                    style={{}}
                  >
                    {/* Indexing Number */}
                    <span 
                      className="text-[10px] font-bold tracking-tighter opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                      style={{ color: themeColors.primaryButton }}
                    >
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>

                    <div className="flex items-center gap-3">
                      <span
                        className="text-2xl lg:text-3xl font-serif transition-colors"
                        style={{ color: themeColors.lightPrimaryText }}
                      >
                        {area}
                      </span>
                      <MapPin 
                        className="w-4 h-4 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500" 
                        style={{ color: themeColors.primaryButton }}
                      />
                    </div>
                    
                    {/* Minimal hover line */}
                    <div 
                      className="h-px w-0 group-hover:w-full transition-all duration-700"
                      style={{ backgroundColor: themeColors.primaryButton }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};