'use client';

import React from 'react';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

interface HighlightsProps {
  highlights: any;
  className?: string;
}

export const Highlights: React.FC<HighlightsProps> = ({ highlights, className }) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();

  const { ref: sectionRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (!highlights || (!highlights.title && !highlights.description && (!highlights.items || highlights.items.length === 0))) return null;

  const sortedHighlights = [...(highlights.items || highlights.highlights || [])]
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, 4);

  const parseCounter = (raw: unknown) => {
    if (typeof raw !== 'string') return null;
    const s = raw.trim();
    if (!s) return null;
    const match = s.match(/([0-9][0-9,\.]*)(\+?)/);
    if (!match) return null;
    const value = Number(match[1].replace(/,/g, ''));
    const suffix = match[2] || '';
    return { value, suffix };
  };

  return (
    <section
      ref={sectionRef}
      className={cn('py-24 lg:py-40 relative overflow-hidden', className)}
      style={{ backgroundColor: themeColors.pageBackground }}
    >
      {/* Decorative Background Element */}
      <div 
        className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none translate-x-1/4"
        style={{ 
          background: `radial-gradient(circle, ${themeColors.primaryButton} 0%, transparent 70%)` 
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative z-10">
        <div className="flex flex-col gap-20">
          
          {/* Top Section: Heading and Description */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="max-w-2xl">
              <span 
                className="text-[10px] tracking-[0.4em] uppercase font-bold opacity-60 block mb-8"
                style={{ color: themeColors.primaryButton }}
              >
                Our Impact
              </span>
              {highlights.title && (
                <h2
                  className="text-5xl lg:text-7xl font-semibold tracking-tight leading-[1.05]"
                  style={{ color: themeColors.lightPrimaryText }}
                >
                  <TiptapRenderer content={highlights.title} />
                </h2>
              )}
            </div>
            
            <div className="lg:pt-20">
              {highlights.description && (
                <div
                  className="text-xl opacity-70 leading-relaxed max-w-md"
                  style={{ color: themeColors.lightSecondaryText }}
                >
                  <TiptapRenderer content={highlights.description} />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section: High-End Stats Grid */}
          <div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 pt-20 border-t"
            style={{ borderColor: `${themeColors.inactive}20` }}
          >
            {sortedHighlights.map((highlight: any, index: number) => {
              const counter = parseCounter(highlight.price || highlight.counter);

              return (
                <div key={index} className="relative group">
                  <div
                    className="text-6xl lg:text-8xl font-semibold tracking-tighter mb-4 transition-all duration-500 group-hover:italic"
                    style={{ 
                      color: themeColors.lightPrimaryText, 
                      lineHeight: 1 
                    }}
                  >
                    {counter ? (
                      <span className="inline-block transition-transform duration-500 group-hover:-translate-y-2">
                        {inView ? (
                          <CountUp
                            end={counter.value}
                            duration={2.5}
                            separator=","
                          />
                        ) : "0"}
                        <span className="text-4xl lg:text-5xl ml-1 opacity-40">{counter.suffix}</span>
                      </span>
                    ) : (
                      <span className="group-hover:-translate-y-2 inline-block transition-transform duration-500">
                        {typeof (highlight.price || highlight.counter) === 'string' ? (highlight.price || highlight.counter) : '—'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {highlight.title && (
                      <h4
                        className="text-xs font-bold uppercase tracking-[0.2em]"
                        style={{ color: themeColors.primaryButton }}
                      >
                        <TiptapRenderer content={highlight.title} as="inline" />
                      </h4>
                    )}

                    {highlight.description && (
                      <div
                        className="text-sm opacity-50 max-w-[200px] leading-snug"
                        style={{ color: themeColors.lightSecondaryText }}
                      >
                        <TiptapRenderer content={highlight.description} />
                      </div>
                    )}
                  </div>

                  {/* Subtle underline hover effect */}
                  <div 
                    className="absolute -bottom-4 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-700"
                    style={{ backgroundColor: themeColors.primaryButton }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};