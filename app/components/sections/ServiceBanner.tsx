'use client';

import React from 'react';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { useThemeFonts } from '@/app/hooks/useTheme';

interface ServiceBannerProps {
    service: any;
}

// Utility function to get full image URL
const getFullImageUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return url;
    if (url.startsWith('/')) return url;
    return `/uploads/${url}`;
};

export const ServiceBanner: React.FC<ServiceBannerProps> = ({ service }) => {
    const themeFonts = useThemeFonts();

    // Determine banner title
    const bannerTitle = service.banner?.useServiceNameAsTitle !== false
        ? service.name
        : service.banner?.customTitle || service.name;

    // Banner background image
    const bannerBgImage = service.banner?.backgroundImage?.url
        ? getFullImageUrl(service.banner.backgroundImage.url)
        : service.thumbnailImage?.url
            ? getFullImageUrl(service.thumbnailImage.url)
            : undefined;

    // Banner overlay opacity
    const overlayOpacity = service.banner?.overlayOpacity ?? 50;

    if (service.banner?.enabled === false) return null;

    return (
        <section
            className="relative w-full min-h-[400px] lg:min-h-[500px] flex items-center justify-center"
            style={{
                backgroundImage: bannerBgImage ? `url(${bannerBgImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Overlay */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})`,
                }}
            />

            {/* Banner Content */}
            <div className="relative z-10 text-center px-4 py-16">
                <h1
                    className="text-4xl lg:text-6xl font-bold text-white mb-4"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                >
                    {bannerTitle}
                </h1>
                {service.shortDescription && (
                    <div
                        className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                    >
                        {typeof service.shortDescription === 'string'
                            ? service.shortDescription
                            : <TiptapRenderer content={service.shortDescription} as="inline" />}
                    </div>
                )}
            </div>
        </section>
    );
};
