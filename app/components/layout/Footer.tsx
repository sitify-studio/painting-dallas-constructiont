'use client';

import React, { useMemo } from 'react';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { useThemeFonts, useThemeColors } from '@/app/hooks/useTheme';
import Link from 'next/link';
import { getImageSrc } from '@/app/lib/utils';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import { usePathname } from 'next/navigation';

export const Footer: React.FC = () => {
  const { site, pages, currentPage } = useWebBuilder();
  const themeFonts = useThemeFonts();
  const themeColors = useThemeColors();
  const pathname = usePathname();
  const safePages = Array.isArray(pages) ? pages : [];

  const normalizePath = (value: unknown): string => {
    if (typeof value !== 'string') return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    return trimmed.replace(/^\/+|\/+$/g, '').toLowerCase();
  };

  const resolvedPage = useMemo(() => {
    if (currentPage) return currentPage;
    const pathKey = normalizePath(pathname);
    if (!pathKey) {
      return safePages.find((p) => p?.pageType === 'home') ?? null;
    }
    return safePages.find((p) => normalizePath(p?.slug) === pathKey) ?? null;
  }, [currentPage, pathname, safePages]);

  const pageFooter = resolvedPage?.footerOverrides;
  const hasPageFooterData = Boolean(
    pageFooter?.enabled &&
      (
        (Array.isArray(pageFooter?.links) && pageFooter.links.length > 0) ||
        (typeof pageFooter?.copyright === 'string' && pageFooter.copyright.trim())
      )
  );

  const siteFooter = site?.footer;
  const hasSiteFooterData = Boolean(
    siteFooter &&
      (
        (siteFooter.logo && typeof siteFooter.logo.url === 'string' && siteFooter.logo.url.trim()) ||
        (typeof siteFooter.description === 'string' && siteFooter.description.trim()) ||
        (Array.isArray(siteFooter.columns) && siteFooter.columns.length > 0) ||
        (typeof siteFooter.copyright === 'string' && siteFooter.copyright.trim())
      )
  );

  if (!hasPageFooterData && !hasSiteFooterData) return null;

  const usePageFooter = hasPageFooterData;
  const displayDescription = usePageFooter ? '' : (siteFooter?.description || '');
  const displayCopyright = usePageFooter
    ? (pageFooter?.copyright || '')
    : (typeof siteFooter?.copyright === 'string' ? siteFooter.copyright : '');
  const displayLogo = !usePageFooter ? siteFooter?.logo : undefined;
  const displayColumns = !usePageFooter && Array.isArray(siteFooter?.columns) ? siteFooter.columns : [];
  const displayLinks = usePageFooter && Array.isArray(pageFooter?.links) ? pageFooter.links : [];

  const normalizeHref = (href: unknown): string => {
    if (typeof href !== 'string') return '';
    const trimmed = href.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
      return trimmed;
    }
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  };

  const logoAlt = displayLogo?.altText || 'Footer logo';

  return (
    <footer
      className="py-16 md:py-24 text-white relative overflow-hidden"
      style={{
        backgroundColor: themeColors.primaryButton,
        fontFamily: themeFonts.body
      }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        {!usePageFooter && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            <div className="lg:col-span-5 space-y-6">
              {displayLogo?.url && (
                <div className="relative w-[180px] h-[60px]">
                  <OptimizedImage
                    src={getImageSrc(displayLogo.url)}
                    alt={logoAlt}
                    fill
                    sizes="180px"
                    className="object-contain object-left"
                  />
                </div>
              )}
              {displayDescription && (
                <p className="text-sm md:text-base opacity-85 leading-relaxed max-w-xl">
                  {displayDescription}
                </p>
              )}
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {displayColumns.map((column, index) => {
                const columnTitle = typeof column?.title === 'string' ? column.title.trim() : '';
                const links = Array.isArray(column?.links) ? column.links : [];

                if (!columnTitle && links.length === 0) return null;

                return (
                  <div key={`footer-column-${index}`} className="space-y-4">
                    {columnTitle && (
                      <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold opacity-70">
                        {columnTitle}
                      </h4>
                    )}

                    <div className="flex flex-col gap-3">
                      {links.map((link, linkIndex) => {
                        const href = normalizeHref(link?.url);
                        const label = typeof link?.label === 'string' ? link.label.trim() : '';
                        if (!href || !label) return null;

                        const isExternal = href.startsWith('http://') || href.startsWith('https://');

                        if (isExternal) {
                          return (
                            <a
                              key={`footer-link-${index}-${linkIndex}`}
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm tracking-[0.08em] opacity-90 hover:opacity-100 transition-opacity"
                            >
                              {label}
                            </a>
                          );
                        }

                        return (
                          <Link
                            key={`footer-link-${index}-${linkIndex}`}
                            href={href}
                            className="text-sm tracking-[0.08em] opacity-90 hover:opacity-100 transition-opacity"
                          >
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {usePageFooter && displayLinks.length > 0 && (
          <nav className="flex flex-wrap gap-x-8 gap-y-4 justify-start">
            {displayLinks.map((link, index) => {
              const href = normalizeHref(link?.href);
              const label = typeof link?.label === 'string' ? link.label.trim() : '';
              if (!href || !label) return null;

              const isExternal = href.startsWith('http://') || href.startsWith('https://');
              if (isExternal) {
                return (
                  <a
                    key={`override-link-${index}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] md:text-xs uppercase tracking-[0.22em] font-medium opacity-75 hover:opacity-100 transition-opacity"
                  >
                    {label}
                  </a>
                );
              }

              return (
                <Link
                  key={`override-link-${index}`}
                  href={href}
                  className="text-[10px] md:text-xs uppercase tracking-[0.22em] font-medium opacity-75 hover:opacity-100 transition-opacity"
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        )}

        {displayCopyright && (
          <div className="w-full h-px bg-white/10 my-10 md:my-12" />
        )}

        {displayCopyright && (
          <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium opacity-60">
            {displayCopyright}
          </div>
        )}

      </div>
    </footer>
  );
};

export default Footer;