'use client';

import React from 'react';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { CheckCircle, Clock, Users, Award, ArrowRight } from 'lucide-react';

interface ServiceOverviewProps {
  overview: any;
  className?: string;
}

export const ServiceOverview: React.FC<ServiceOverviewProps> = ({ overview, className }) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();

  if (!overview || (!overview.title && !overview.description && !overview.keyPoints && !overview.stats)) return null;

  const getIcon = (iconName: string) => {
    const props = { className: "w-5 h-5" };
    switch (iconName) {
      case 'check': return <CheckCircle {...props} />;
      case 'clock': return <Clock {...props} />;
      case 'users': return <Users {...props} />;
      case 'award': return <Award {...props} />;
      default: return <CheckCircle {...props} />;
    }
  };

  // Resolve the image source safely from the WebBuilder database structure
  const resolvedImageSrc = getImageSrc(
    typeof overview.image === 'object' && overview.image !== null
      ? overview.image.url
      : overview.image
  );

  return (
    <section 
      className={cn('py-24 lg:py-40 overflow-hidden relative', className)}
      style={{ backgroundColor: themeColors.pageBackground }}
    >
      {/* Background Accent */}
      <div 
        className="absolute top-0 left-0 w-1/3 h-full opacity-[0.02] pointer-events-none"
        style={{ background: `linear-gradient(90deg, ${themeColors.primaryButton} 0%, transparent 100%)` }}
      />

      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* IMAGE SIDE: Asymmetric Composition */}
          <div className="lg:col-span-6 order-2 lg:order-1 relative">
            {resolvedImageSrc && (
              <div className="relative z-10">
                <div 
                  className="rounded-[3rem] overflow-hidden shadow-2xl transform transition-transform duration-700 hover:scale-[1.02]"
                  style={{ aspectRatio: '4/5' }}
                >
                  <img
                    src={resolvedImageSrc}
                    alt={overview.imageAlt || 'Service Detail'}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Modern Floating Metric */}
                <div 
                  className="absolute -bottom-8 -right-8 p-8 rounded-[2rem] shadow-2xl backdrop-blur-xl border border-white/20 hidden md:block"
                  style={{ backgroundColor: `${themeColors.cardBackground}E6` }}
                >
                   <div className="flex flex-col items-center gap-1">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                        style={{ backgroundColor: `${themeColors.primaryButton}15` }}
                      >
                         <Award className="w-5 h-5" style={{ color: themeColors.primaryButton }} />
                      </div>
                      <span 
                        className="text-xs font-bold uppercase tracking-[0.2em] opacity-60"
                        style={{ color: themeColors.lightPrimaryText }}
                      >
                        Guaranteed
                      </span>
                      <span 
                        className="text-lg font-bold"
                        style={{ color: themeColors.lightPrimaryText }}
                      >
                        Excellence
                      </span>
                   </div>
                </div>
              </div>
            )}
            
            {/* Geometric Decorative Frame */}
            <div 
              className="absolute -top-10 -left-10 w-64 h-64 rounded-full blur-[100px] opacity-10"
              style={{ backgroundColor: themeColors.primaryButton }}
            />
          </div>

          {/* CONTENT SIDE */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="space-y-10">
              {/* Context Label */}
              <div className="inline-flex items-center gap-4">
                <div className="h-px w-8" style={{ backgroundColor: themeColors.primaryButton }} />
                <span 
                  className="text-[10px] tracking-[0.4em] uppercase font-black"
                  style={{ color: themeColors.primaryButton }}
                >
                  {overview.label ? <TiptapRenderer content={overview.label} as="inline" /> : 'Overview'}
                </span>
              </div>

              {/* Heading */}
              {overview.title && (
                <h2 
                  className="text-5xl lg:text-7xl font-semibold tracking-tight leading-[1.05]"
                  style={{ color: themeColors.lightPrimaryText }}
                >
                  <TiptapRenderer content={overview.title} as="inline" />
                </h2>
              )}

              {/* Body Text */}
              {(overview.subtitle || overview.description) && (
                <div 
                  className="text-lg opacity-70 leading-relaxed max-w-xl"
                  style={{ color: themeColors.lightSecondaryText }}
                >
                  <TiptapRenderer content={overview.subtitle || overview.description} />
                </div>
              )}

              {/* Key Points - Stylized List */}
              {overview.keyPoints && overview.keyPoints.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-8 py-4">
                  {overview.keyPoints.map((point: any, index: number) => (
                    <div key={index} className="space-y-3 group">
                      <div className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColors.primaryButton }} />
                         <h4 
                            className="font-bold text-sm uppercase tracking-wider"
                            style={{ color: themeColors.lightPrimaryText }}
                          >
                            <TiptapRenderer content={point.title} as="inline" />
                          </h4>
                      </div>
                      {point.description && (
                        <div 
                          className="text-sm opacity-60 leading-relaxed pl-4 border-l"
                          style={{ borderColor: `${themeColors.inactive}40`, color: themeColors.lightSecondaryText }}
                        >
                          <TiptapRenderer content={point.description} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Stats & CTA Row */}
              <div 
                className="pt-12 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8"
                style={{ borderColor: `${themeColors.inactive}20` }}
              >
                {overview.stats?.[0] && (
                  <div className="flex items-center gap-4">
                    <div 
                        className="text-5xl font-bold tracking-tighter" 
                        style={{ color: themeColors.lightPrimaryText }}
                    >
                        {overview.stats[0].value}
                    </div>
                    <div 
                        className="text-[10px] leading-tight font-black uppercase tracking-widest opacity-40 max-w-[80px]"
                        style={{ color: themeColors.lightPrimaryText }}
                    >
                        <TiptapRenderer content={overview.stats[0].label} as="inline" />
                    </div>
                  </div>
                )}

                {overview.ctaButton && (
                  <a
                    href={overview.ctaButton.url}
                    className="group flex items-center gap-4 py-4 px-8 rounded-full transition-all duration-300 text-white shadow-xl hover:shadow-2xl"
                    style={{ 
                      backgroundColor: themeColors.primaryButton,
                    }}
                  >
                    <span className="text-sm font-bold uppercase tracking-widest">{overview.ctaButton.text}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};