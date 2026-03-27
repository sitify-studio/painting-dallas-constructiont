'use client';

import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { projectApi } from '@/app/lib/api';
import { Project } from '@/app/lib/types';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { SeoHead } from '@/app/components/ui/SeoHead';
import { normalizeSeoImage, tiptapToText, truncate } from '@/app/lib/seo';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectSlug = params.projectSlug as string;
  const { site, projects, loading: siteLoading } = useWebBuilder();
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const otherProjects = useMemo(() => {
    const published = (projects || []).filter(p => p.status === 'published');
    return published.filter(p => p.slug !== projectSlug).slice(0, 6);
  }, [projects, projectSlug]);

  useEffect(() => {
    async function loadProjectPage() {
      if (!site) return;

      try {
        setLoading(true);
        const projectData = await projectApi.getProjectBySlug(site.slug, projectSlug);
        setProject(projectData);
        setError(null);
      } catch (err: unknown) {
        console.error('Failed to load project page:', err);
        const message = err instanceof Error ? err.message : 'Failed to load project page';
        setError(message);
        setProject(null);
      } finally {
        setLoading(false);
      }
    }

    if (!siteLoading) {
      loadProjectPage();
    }
  }, [site, siteLoading, projectSlug]);

  if (siteLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.pageBackground }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: themeColors.primaryButton }}></div>
          <p style={{ color: themeColors.secondaryText }}>Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.pageBackground }}>
        <div className="text-center">
          <h2 className="font-semibold mb-2" style={{ color: themeColors.lightPrimaryText }}>Error Loading Project</h2>
          <p style={{ color: themeColors.lightSecondaryText }}>{error || 'Project not found'}</p>
        </div>
      </div>
    );
  }

  const siteName = site?.business?.name || site?.name || 'Web Builder Site';
  const seoTitleBase = project.seo?.title || project.title;
  const seoTitle = `${seoTitleBase} | ${siteName}`;
  const fallbackDesc = truncate(
    tiptapToText(project.seo?.description) ||
      tiptapToText(project.shortDescription) ||
      tiptapToText(project.description),
    160
  );
  const seoDescription = truncate(project.seo?.description || fallbackDesc, 160);
  const ogImage =
    normalizeSeoImage(project.seo?.ogImageUrl || undefined, project.title) ||
    normalizeSeoImage(project.featuredImage?.url, project.featuredImage?.altText || project.title);

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.pageBackground }}>
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        canonicalPath={`/projects/${project.slug}`}
        ogType="article"
        ogImage={ogImage}
        noIndex={project.status !== 'published'}
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
                  Project Detail
                </span>
                <div className="w-12 h-[1px]" style={{ backgroundColor: `${themeColors.primaryButton}40` }} />
              </div>
              
              <h1 
                className="text-4xl lg:text-5xl font-serif leading-tight"
                style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.heading }}
              >
                {project.title}
              </h1>
            </div>

            <div className="flex flex-col gap-4">
              <div
                className="text-base font-light leading-relaxed opacity-70"
                style={{ color: themeColors.lightSecondaryText, fontFamily: themeFonts.body }}
              >
                {project.category && <span>Category: {project.category}</span>}
              </div>
              
              <Link
                href="/project-detail"
                className="group inline-flex items-center gap-2 text-sm font-medium transition-all"
                style={{ color: themeColors.primaryButton, fontFamily: themeFonts.body }}
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Projects
              </Link>
            </div>
          </div>

          {/* Featured Image - Full Width */}
          {project.featuredImage?.url && (
            <div className="mb-16 lg:mb-20">
              <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-sm overflow-hidden">
                <img
                  src={getImageSrc(project.featuredImage.url)}
                  alt={project.featuredImage.altText || project.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Info Badge */}
                <div className="absolute top-6 right-6 px-4 py-2 rounded-full" 
                  style={{ 
                    backgroundColor: `${themeColors.pageBackground}CC`,
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: themeColors.secondaryText, fontFamily: themeFonts.body }}
                    >
                      {project.clientName && `Client: ${project.clientName}`}
                    </span>
                    {project.location && (
                      <>
                        <span style={{ color: themeColors.secondaryText }}>•</span>
                        <span 
                          className="text-xs font-medium uppercase tracking-wider"
                          style={{ color: themeColors.secondaryText, fontFamily: themeFonts.body }}
                        >
                          {project.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
            {/* Main Content */}
            <article className="lg:col-span-2">
              {/* Short Description */}
              {project.shortDescription && (
                <div className="mb-12">
                  <div 
                    className="text-lg font-light leading-relaxed opacity-80"
                    style={{ color: themeColors.lightSecondaryText, fontFamily: themeFonts.body }}
                  >
                    <TiptapRenderer content={project.shortDescription} />
                  </div>
                </div>
              )}

              {/* Full Description */}
              {project.description && (
                <div className="mb-16">
                  <div 
                    className="prose prose-lg max-w-none leading-relaxed"
                    style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.body }}
                  >
                    <TiptapRenderer content={project.description} />
                  </div>
                </div>
              )}

              {/* Gallery */}
              {project.galleryImages && project.galleryImages.length > 0 && (
                <div className="mb-16">
                  <div className="mb-8">
                    <span 
                      className="text-[10px] tracking-[0.4em] uppercase font-bold"
                      style={{ color: themeColors.primaryButton, fontFamily: themeFonts.body }}
                    >
                      Gallery
                    </span>
                    <div className="w-12 h-[1px] mt-2" style={{ backgroundColor: `${themeColors.primaryButton}40` }} />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                    {project.galleryImages.map((img, idx) => (
                      <div key={`${img.url}-${idx}`} className="group relative overflow-hidden rounded-sm">
                        <img
                          src={getImageSrc(img.url)}
                          alt={img.altText || project.title}
                          className="w-full h-64 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                          style={{ background: `linear-gradient(to top, ${themeColors.darkPrimaryText}20, transparent)` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services Used */}
              {project.servicesUsed && project.servicesUsed.length > 0 && (
                <div>
                  <div className="mb-8">
                    <span 
                      className="text-[10px] tracking-[0.4em] uppercase font-bold"
                      style={{ color: themeColors.primaryButton, fontFamily: themeFonts.body }}
                    >
                      Services
                    </span>
                    <div className="w-12 h-[1px] mt-2" style={{ backgroundColor: `${themeColors.primaryButton}40` }} />
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {project.servicesUsed.map((s) => (
                      <span
                        key={s}
                        className="px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider"
                        style={{ 
                          backgroundColor: `${themeColors.secondaryText}15`,
                          color: themeColors.secondaryText,
                          fontFamily: themeFonts.body
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-32 space-y-8">
                {/* Project Details */}
                <div>
                  <div className="mb-6">
                    <span 
                      className="text-[10px] tracking-[0.4em] uppercase font-bold"
                      style={{ color: themeColors.primaryButton, fontFamily: themeFonts.body }}
                    >
                      Details
                    </span>
                    <div className="w-12 h-[1px] mt-2" style={{ backgroundColor: `${themeColors.primaryButton}40` }} />
                  </div>
                  
                  <div className="space-y-4">
                    {project.clientName && (
                      <div>
                        <div 
                          className="text-xs uppercase tracking-wider mb-1"
                          style={{ color: themeColors.secondaryText, fontFamily: themeFonts.body }}
                        >
                          Client
                        </div>
                        <div 
                          className="text-sm font-medium"
                          style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.body }}
                        >
                          {project.clientName}
                        </div>
                      </div>
                    )}
                    
                    {project.location && (
                      <div>
                        <div 
                          className="text-xs uppercase tracking-wider mb-1"
                          style={{ color: themeColors.secondaryText, fontFamily: themeFonts.body }}
                        >
                          Location
                        </div>
                        <div 
                          className="text-sm font-medium"
                          style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.body }}
                        >
                          {project.location}
                        </div>
                      </div>
                    )}
                    
                    {(project.date || project.publishedAt) && (
                      <div>
                        <div 
                          className="text-xs uppercase tracking-wider mb-1"
                          style={{ color: themeColors.secondaryText, fontFamily: themeFonts.body }}
                        >
                          Date
                        </div>
                        <div 
                          className="text-sm font-medium"
                          style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.body }}
                        >
                          {new Date(project.date || project.publishedAt as string).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Other Projects */}
                {otherProjects.length > 0 && (
                  <div>
                    <div className="mb-6">
                      <span 
                        className="text-[10px] tracking-[0.4em] uppercase font-bold"
                        style={{ color: themeColors.primaryButton, fontFamily: themeFonts.body }}
                      >
                        Other Projects
                      </span>
                      <div className="w-12 h-[1px] mt-2" style={{ backgroundColor: `${themeColors.primaryButton}40` }} />
                    </div>

                    <div className="space-y-6">
                      {otherProjects.slice(0, 3).map((p) => (
                        <Link
                          key={p._id}
                          href={`/projects/${p.slug}`}
                          className="group block"
                        >
                          <div className="flex gap-4">
                            {p.featuredImage?.url && (
                              <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-sm">
                                <img
                                  src={getImageSrc(p.featuredImage.url)}
                                  alt={p.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 
                                className="text-sm font-semibold line-clamp-2 mb-1 group-hover:underline"
                                style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.body }}
                              >
                                {p.title}
                              </h4>
                              {p.category && (
                                <p 
                                  className="text-xs"
                                  style={{ color: themeColors.secondaryText }}
                                >
                                  {p.category}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <Link
                      href="/project-detail"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium transition-all"
                      style={{ color: themeColors.primaryButton, fontFamily: themeFonts.body }}
                    >
                      View All Projects
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
