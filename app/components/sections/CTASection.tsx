'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { ArrowUpRight } from 'lucide-react';

interface CTASectionProps {
    ctaSection: Page['ctaSection'];
    className?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({ ctaSection, className }) => {
    const safeCta: any = ctaSection ?? { enabled: false };
    const { site } = useWebBuilder();
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [parallaxOffsetY, setParallaxOffsetY] = useState(0);

    const themeColors = useThemeColors();
    const themeFonts = useThemeFonts();

    const backgroundImageUrl = useMemo(() => {
        return safeCta.backgroundImage ? getImageSrc(safeCta.backgroundImage) : null;
    }, [safeCta.backgroundImage]);

    // Intersection Observer for Scroll Animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Subtle Parallax Effect
    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const scrollPercent = rect.top / window.innerHeight;
            setParallaxOffsetY(scrollPercent * 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!safeCta?.enabled) return null;

    return (
        <section
            ref={sectionRef}
            className={cn('relative min-h-[60vh] flex items-center justify-center overflow-hidden py-20', className)}
        >
            {/* Background with slow zoom/float animation */}
            <div 
                className="absolute inset-0 z-0 scale-125"
                style={{
                    backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
                    backgroundColor: safeCta.backgroundColor || themeColors.primaryButton,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: `translateY(${parallaxOffsetY * -0.5}px) scale(1.1)`,
                    transition: 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
                }}
            />

            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[1px]" />
            <div 
                className="absolute inset-0 z-10"
                style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)'
                }}
            />

            <div className="relative z-20 container mx-auto px-6 text-center">
                <div className="max-w-5xl mx-auto flex flex-col items-center">
                    
                    {/* Heritage Label with Reveal Animation */}
                    <div className={cn(
                        "mb-8 flex flex-col items-center gap-4 transition-all duration-1000 delay-100",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    )}>
                        <span 
                            className="text-[10px] tracking-[0.5em] uppercase font-bold text-white/90"
                            style={{}}
                        >
                            Begin Your Journey
                        </span>
                        <div className="w-16 h-[1px] bg-white/40" />
                    </div>

                    {/* Elegant Serif Title with Staggered Slide */}
                    {safeCta.title && (
                        <h2
                            className={cn(
                                "text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] text-white mb-8 transition-all duration-1000 delay-300",
                                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-95"
                            )}
                            style={{}}
                        >
                            <TiptapRenderer content={safeCta.title} />
                        </h2>
                    )}

                    {/* Description with Fade */}
                    {safeCta.description && (
                        <div
                            className={cn(
                                "text-base md:text-lg text-white/80 max-w-2xl font-light mb-12 leading-relaxed transition-all duration-1000 delay-500",
                                isVisible ? "opacity-100" : "opacity-0"
                            )}
                            style={{}}
                        >
                            <TiptapRenderer content={safeCta.description} />
                        </div>
                    )}

                    {/* The CTA Button with Theme Colors */}
                    {safeCta.primaryButton && (
                        <div className={cn(
                            "transition-all duration-1000 delay-700",
                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        )}>
                            <a
                                href="/contact-us"
                                className="group relative flex items-center gap-8 px-10 py-5 rounded-full transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                                style={{ 
                                    fontFamily: themeFonts.body,
                                    backgroundColor: themeColors.primaryButton,
                                    color: '#FFFFFF'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = themeColors.hoverActive;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = themeColors.primaryButton;
                                }}
                            >
                                <span className="text-xs font-black uppercase tracking-[0.2em] z-10">
                                    {safeCta.primaryButton.label}
                                </span>
                                <div 
                                    className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-500"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                                >
                                    <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                                </div>
                                
                                {/* Hover "Ripple" effect using CSS only */}
                                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:scale-110 group-hover:opacity-10 transition-all duration-700" />
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Decorative Edge Detail (matching image rounds) */}
            <div className="absolute bottom-0 left-0 w-full h-12 bg-white rounded-t-[60px] z-30" />
        </section>
    );
};