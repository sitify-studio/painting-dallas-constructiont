'use client';

import React, { useEffect, useMemo } from 'react';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';

interface ThemeFontWrapperProps {
  children: React.ReactNode;
}

export const ThemeFontWrapper: React.FC<ThemeFontWrapperProps> = ({ children }) => {
  const { site } = useWebBuilder();

  const fonts = useMemo(() => {
    const heading = typeof site?.theme?.headingFont === 'string' ? site?.theme?.headingFont.trim() : '';
    const body = typeof site?.theme?.bodyFont === 'string' ? site?.theme?.bodyFont.trim() : '';

    return {
      heading: heading || undefined,
      body: body || undefined,
    };
  }, [site?.theme?.headingFont, site?.theme?.bodyFont]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const uniqueFonts = Array.from(new Set([fonts.heading, fonts.body].filter(Boolean))) as string[];
    if (uniqueFonts.length === 0) return;

    // Load fonts from Google Fonts. This assumes WebBuilder stores Google Fonts family names.
    // If a font isn't on Google Fonts, the browser will simply fall back.
    const familiesParam = uniqueFonts
      .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@300;400;500;600;700;800;900`)
      .join('&');
    const href = `https://fonts.googleapis.com/css2?${familiesParam}&display=swap`;

    const id = `wb-fonts-${uniqueFonts.join('|')}`;
    const existing = document.getElementById(id) as HTMLLinkElement | null;
    if (existing) return;

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }, [fonts.heading, fonts.body]);

  return (
    <div
      style={
        fonts.body || fonts.heading
          ? ({
              fontFamily: fonts.body,
              ['--wb-heading-font' as any]: fonts.heading,
              ['--wb-body-font' as any]: fonts.body,
            } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
};
