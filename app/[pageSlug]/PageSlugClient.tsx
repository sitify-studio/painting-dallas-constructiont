'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { useThemeColors } from '@/app/hooks/useTheme';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { HeroSection } from '@/app/components/sections/HeroSection';
import { AboutSection } from '@/app/components/sections/AboutSection';
import { ServicesSection } from '@/app/components/sections/ServicesSection';
import { TestimonialsSection } from '@/app/components/sections/TestimonialsSection';
import { FAQSection } from '@/app/components/sections/FAQSection';
import { CTASection } from '@/app/components/sections/CTASection';
import { WhyChooseUsSection } from '@/app/components/sections/WhyChooseUsSection';
import { CompanyDetailSection } from '@/app/components/sections/CompanyDetailSection';
import { ProjectsSection } from '@/app/components/sections/ProjectsSection';
import { CTA2Section } from '@/app/components/sections/CTA2Section';
import { CTA3Section } from '@/app/components/sections/CTA3Section';
import { GallerySection } from '@/app/components/sections/GallerySection';
import { ContactSection } from '@/app/components/sections/ContactSection';
import { BlogSection } from '@/app/components/sections/BlogSection';
import api from '@/app/lib/fetch-api';
import { ServiceAreaPage } from '@/app/lib/types';

interface PageSlugClientProps {
  pageSlug: string;
}

export default function PageSlugClient({ pageSlug: pageSlugProp }: PageSlugClientProps) {
  const params = useParams();
  const pageSlug = params.pageSlug as string || pageSlugProp;
  const { pages, currentPage, setCurrentPage, loading, site } = useWebBuilder();
  const themeColors = useThemeColors();
  const [serviceAreaPage, setServiceAreaPage] = useState<ServiceAreaPage | null>(null);
  const [serviceAreaLoading, setServiceAreaLoading] = useState(false);
  const hasAttemptedLoad = useRef(false);

  // Load service area page
  const loadServiceAreaPage = useCallback(async () => {
    if (!site || hasAttemptedLoad.current) return;

    hasAttemptedLoad.current = true;
    setServiceAreaLoading(true);

    try {
      const response = await api.get(`/public/sites/${site.slug}/service-areas/${pageSlug}`);
      if (response.success) {
        setServiceAreaPage(response.data);
      } else {
        setServiceAreaPage(null);
      }
    } catch {
      setServiceAreaPage(null);
    } finally {
      setServiceAreaLoading(false);
    }
  }, [site, pageSlug]);

  useEffect(() => {
    if (pages.length === 0) return;

    const foundPage = pages.find(page => page.slug === pageSlug);
    if (foundPage) {
      setCurrentPage(foundPage);
      setServiceAreaPage(null);
    } else {
      setCurrentPage(null);
      if (!hasAttemptedLoad.current) {
        loadServiceAreaPage();
      }
    }
  }, [pageSlug, pages, setCurrentPage, loadServiceAreaPage]);

  if (loading || serviceAreaLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.pageBackground }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: themeColors.primaryButton }}></div>
      </div>
    );
  }

  const displayPage = currentPage || serviceAreaPage;

  if (!displayPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center" style={{ backgroundColor: themeColors.pageBackground }}>
        <h2 className="text-2xl font-bold mb-2" style={{ color: themeColors.lightPrimaryText }}>Page Not Found</h2>
        <p style={{ color: themeColors.lightSecondaryText }}>The page &quot;{pageSlug}&quot; could not be found.</p>
        <Link href="/" className="mt-8 hover:underline" style={{ color: themeColors.primaryButton }}>Return Home</Link>
      </div>
    );
  }

  const pageType = 'pageType' in displayPage ? displayPage.pageType : undefined;

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.pageBackground }}>
      <Header />

      <main>
        {pageType === 'home' && (
          <>
            <HeroSection hero={displayPage.hero} />
            <AboutSection aboutSection={displayPage.aboutSection} />
            <ServicesSection servicesSection={displayPage.servicesSection} />
            <GallerySection gallerySection={displayPage.gallerySection} />
            <TestimonialsSection testimonialsSection={displayPage.testimonialsSection} />
            <FAQSection faqSection={displayPage.faqSection} />
            <ContactSection contactSection={displayPage.contactSection} />
            <BlogSection blogSection={displayPage.blogSection} />
            <CTASection ctaSection={displayPage.ctaSection} />
            <WhyChooseUsSection whyChooseUsSection={displayPage.whyChooseUsSection} />
            <CompanyDetailSection companyDetailSection={displayPage.companyDetailSection} />
            <ProjectsSection projectsSection={displayPage.projectsSection} />
            <CTA2Section cta2Section={displayPage.cta2Section} />
            <CTA3Section cta3Section={displayPage.cta3Section} />
          </>
        )}

        {pageType === 'about' && (
          <>
            <HeroSection hero={displayPage.hero} />
            <AboutSection aboutSection={displayPage.aboutSection} />
            <WhyChooseUsSection whyChooseUsSection={displayPage.whyChooseUsSection} />
            <CompanyDetailSection companyDetailSection={displayPage.companyDetailSection} />
            <CTA2Section cta2Section={displayPage.cta2Section} />
          </>
        )}

        {pageType === 'contact' && (
          <>
            <HeroSection hero={displayPage.hero} />
            <ContactSection contactSection={displayPage.contactSection} />
          </>
        )}

        {pageType === 'service-list' && (
          <>
            <HeroSection hero={displayPage.hero} />
            <ServicesSection servicesSection={displayPage.servicesSection} />
          </>
        )}

        {pageType === 'blog-list' && (
          <>
            <HeroSection hero={displayPage.hero} />
            <BlogSection blogSection={displayPage.blogSection} />
          </>
        )}

        {pageType === 'project-detail' && <HeroSection hero={displayPage.hero} />}

        {(pageType === 'testimonials' || displayPage.slug === 'testimonials') && (
          <>
            <HeroSection hero={displayPage.hero} />
            <TestimonialsSection testimonialsSection={displayPage.testimonialsSection} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
