'use client';

import React, { useMemo } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

interface ServiceHighlightsSectionProps {
  serviceHighlightsSection: Page['serviceHighlightsSection'];
  className?: string;
}

export const ServiceHighlightsSection: React.FC<ServiceHighlightsSectionProps> = ({
  serviceHighlightsSection,
  className
}) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();
  const { site } = useWebBuilder();

  const { ref: sectionRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.25,
  });

  // Check if section exists and is enabled
  const isEnabled = serviceHighlightsSection?.enabled === true || serviceHighlightsSection != null;

  if (!isEnabled) {
    return null;
  }

  // Sort highlights by order
  const sortedHighlights = [...(serviceHighlightsSection.highlights || [])]
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, 4); // Usually 4 items as per reference

  const sectionTitle = useMemo(() => {
    if (!serviceHighlightsSection.title) return null;
    return typeof serviceHighlightsSection.title === 'string'
      ? serviceHighlightsSection.title
      : null;
  }, [serviceHighlightsSection.title]);

  const parseCounter = (raw: unknown) => {
    if (typeof raw !== 'string') return null as null | { value: number; suffix: string };
    const s = raw.trim();
    if (!s) return null;
    const match = s.match(/([0-9][0-9,\.]*)(\+?)/);
    if (!match) return null;
    const value = Number(match[1].replace(/,/g, ''));
    if (Number.isNaN(value)) return null;
    const suffix = match[2] || '';
    return { value, suffix };
  };

  return (
    <section
      className={cn('py-16 lg:py-24 relative overflow-hidden', className)}
      style={{
        backgroundColor: serviceHighlightsSection.backgroundColor || themeColors.sectionBackground
      }}
    >
      <div ref={sectionRef} className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left column */}
          <div className="lg:col-span-5">
            {serviceHighlightsSection.title && (
              <h2
                className="text-4xl md:text-5xl font-semibold leading-tight"
                style={{ color: themeColors.lightPrimaryText }}
              >
                {sectionTitle ? sectionTitle : <TiptapRenderer content={serviceHighlightsSection.title} />}
              </h2>
            )}

            {serviceHighlightsSection.description && (
              <div
                className="mt-4 max-w-md text-sm leading-relaxed"
                style={{ color: themeColors.lightSecondaryText }}
              >
                {typeof serviceHighlightsSection.description === 'string' ? (
                  serviceHighlightsSection.description
                ) : (
                  <TiptapRenderer content={serviceHighlightsSection.description} />
                )}
              </div>
            )}
          </div>

          {/* Right column - Stats */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-16 xl:gap-x-74 gap-y-12">
              {sortedHighlights.map((highlight, index) => {
                const counter = parseCounter((highlight as any).price);

                return (
                  <div key={index} className="min-w-0">
                    <div
                      className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight whitespace-nowrap"
                      style={{ color: themeColors.lightPrimaryText, lineHeight: 1 }}
                    >
                      {counter ? (
                        <>
                          {inView ? (
                            <CountUp
                              end={counter.value}
                              duration={1.6}
                              separator="," 
                              preserveValue={false}
                            />
                          ) : (
                            0
                          )}
                          {counter.suffix}
                        </>
                      ) : (
                        <>
                          {typeof (highlight as any).price === 'string' ? (highlight as any).price : '—'}
                        </>
                      )}
                    </div>

                    {highlight.title && (
                      <div
                        className="mt-3 text-base font-medium"
                        style={{ color: themeColors.lightPrimaryText }}
                      >
                        {typeof highlight.title === 'string' ? (
                          highlight.title
                        ) : (
                          <TiptapRenderer content={highlight.title} as="inline" />
                        )}
                      </div>
                    )}

                    {highlight.description && (
                      <div
                        className="mt-2 text-sm leading-relaxed max-w-xs"
                        style={{ color: themeColors.lightSecondaryText }}
                      >
                        {typeof highlight.description === 'string' ? (
                          highlight.description
                        ) : (
                          <TiptapRenderer content={highlight.description} />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
