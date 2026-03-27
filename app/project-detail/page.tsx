'use client';

import Link from 'next/link';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { SeoHead } from '@/app/components/ui/SeoHead';
import { truncate } from '@/app/lib/seo';
import { ArrowUpRight } from 'lucide-react';

export default function ProjectsListingPage() {
  const { site, projects, loading } = useWebBuilder();
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();

  // Filter published projects only
  const publishedProjects = (projects || []).filter(p => p.status === 'published');

  const siteName = site?.business?.name || site?.name || 'Projects';
  const seoTitle = `Projects | ${siteName}`;
  const seoDescription = truncate(
    site?.business?.description || `Browse all projects from ${siteName}`,
    160
  );

  // Show loading if site not loaded yet or explicit loading state
  if (loading || !site) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.pageBackground }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: themeColors.primaryButton }}></div>
          <p style={{ color: themeColors.secondaryText }}>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.pageBackground }}>
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        canonicalPath="/project-detail"
        ogType="website"
      />
      <Header />

      <main className="pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="container mx-auto px-6 lg:px-12">
          
          {/* Editorial Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 lg:mb-24">
            <div className="max-w-2xl">
              <div className="mb-6 flex items-center gap-3">
                <span 
                  className="text-[10px] tracking-[0.4em] uppercase font-bold"
                  style={{ color: themeColors.primaryButton, fontFamily: themeFonts.body }}
                >
                  Portfolio
                </span>
                <div className="w-12 h-[1px]" style={{ backgroundColor: `${themeColors.primaryButton}40` }} />
              </div>
              
              <h1 
                className="text-4xl lg:text-5xl font-serif leading-tight"
                style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.heading }}
              >
                Our Projects
              </h1>
            </div>

            <div
              className="max-w-sm text-base font-light leading-relaxed opacity-70"
              style={{ color: themeColors.lightSecondaryText, fontFamily: themeFonts.body }}
            >
              Explore our portfolio of work showcasing our expertise and dedication to excellence.
            </div>
          </div>

          {/* Projects Grid - Editorial Gallery Style */}
          {publishedProjects.length === 0 ? (
            <div className="text-center py-16">
              <p style={{ color: themeColors.secondaryText, fontFamily: themeFonts.body }}>
                No projects available at this time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
              {publishedProjects.map((project, idx) => {
                const isEven = idx % 2 === 0;
                
                return (
                  <div 
                    key={project._id}
                    className={cn(
                      "group relative flex flex-col",
                      !isEven && "md:mt-24"
                    )}
                  >
                    <Link 
                      href={`/projects/${project.slug}`} 
                      className="block overflow-hidden relative aspect-[4/5] rounded-sm"
                      style={{ backgroundColor: `${themeColors.secondaryText}15` }}
                    >
                      {/* Image with slow zoom on hover */}
                      {project.featuredImage?.url ? (
                        <img
                          src={getImageSrc(project.featuredImage.url)}
                          alt={project.featuredImage.altText || project.title}
                          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                        />
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: `${themeColors.secondaryText}15` }}
                        >
                          <span style={{ color: themeColors.secondaryText }}>No Image</span>
                        </div>
                      )}
                      
                      {/* Subtle Gradient Overlay */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: `linear-gradient(to top, ${themeColors.darkPrimaryText}40, transparent, transparent)` }}
                      />
                      
                      {/* Floating Action Button */}
                      <div 
                        className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-xl"
                        style={{ backgroundColor: themeColors.pageBackground }}
                      >
                        <ArrowUpRight 
                          className="w-5 h-5" 
                          style={{ color: themeColors.darkPrimaryText }}
                        />
                      </div>

                      {/* Category Badge - Floating */}
                      {project.category && (
                        <div 
                          className="absolute bottom-6 left-6 px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0"
                          style={{ 
                            backgroundColor: `${themeColors.primaryButton}20`,
                            color: themeColors.primaryButton,
                            backdropFilter: 'blur(8px)'
                          }}
                        >
                          {project.category}
                        </div>
                      )}
                    </Link>

                    {/* Content Underlay */}
                    <div className="mt-8">
                      <div 
                        className="flex items-center justify-between border-b pb-4"
                        style={{ borderColor: `${themeColors.secondaryText}15` }}
                      >
                        <h3
                          className="text-2xl lg:text-3xl font-serif"
                          style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.heading }}
                        >
                          {project.title}
                        </h3>
                        <span 
                          className="text-[10px] tracking-widest uppercase font-bold opacity-40"
                          style={{ color: themeColors.secondaryText }}
                        >
                          Explore
                        </span>
                      </div>
                      
                      {project.shortDescription && (
                        <div
                          className="mt-4 text-base font-light leading-relaxed opacity-60 max-w-md"
                          style={{ color: themeColors.lightSecondaryText, fontFamily: themeFonts.body }}
                        >
                          <TiptapRenderer content={project.shortDescription} />
                        </div>
                      )}

                      {project.clientName && (
                        <div 
                          className="mt-4 text-xs tracking-wider uppercase"
                          style={{ color: themeColors.secondaryText, fontFamily: themeFonts.body }}
                        >
                          Client: {project.clientName}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
