'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { projectApi } from '@/app/lib/api';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { Project } from '@/app/lib/types';
import { getImageSrc } from '@/app/lib/utils';
import { SeoHead } from '@/app/components/ui/SeoHead';
import { truncate } from '@/app/lib/seo';

function ProjectsPageContent() {
    const { site, loading: siteLoading } = useWebBuilder();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const pageSize = 9;

    const currentPage = useMemo(() => {
        const raw = searchParams?.get('page');
        const parsed = raw ? Number.parseInt(raw, 10) : 1;
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    }, [searchParams]);

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(projects.length / pageSize));
    }, [projects.length]);

    const paginatedProjects = useMemo(() => {
        const safePage = Math.min(Math.max(1, currentPage), totalPages);
        const start = (safePage - 1) * pageSize;
        return projects.slice(start, start + pageSize);
    }, [projects, currentPage, totalPages]);

    const setPage = (nextPage: number) => {
        const clamped = Math.min(Math.max(1, nextPage), totalPages);
        const params = new URLSearchParams(searchParams?.toString() || '');
        if (clamped <= 1) {
            params.delete('page');
        } else {
            params.set('page', String(clamped));
        }
        const qs = params.toString();
        router.push(qs ? `/projects?${qs}` : '/projects');
    };

    useEffect(() => {
        async function loadProjects() {
            if (!site) return;

            try {
                setLoading(true);
                const allProjects = await projectApi.getProjectsBySite(site.slug);
                const publishedProjects = allProjects.filter(p => p.status === 'published');
                setProjects(publishedProjects);
                setError(null);
            } catch (err: unknown) {
                console.error('Failed to load projects:', err);
                const message = err instanceof Error ? err.message : 'Failed to load projects';
                setError(message);
            } finally {
                setLoading(false);
            }
        }

        if (!siteLoading) {
            loadProjects();
        }
    }, [site, siteLoading]);

    if (siteLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading projects...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-red-800 font-semibold mb-2">Error Loading Projects</h2>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    const siteName = site?.business?.name || site?.name || 'Web Builder Site';
    const seoTitle = `Projects | ${siteName}`;
    const seoDescription = truncate(site?.seo?.description || site?.business?.description || 'Browse our latest projects.', 160);

    return (
        <div className="min-h-screen bg-gray-50">
            <SeoHead
                title={seoTitle}
                description={seoDescription}
                canonicalPath="/projects"
                ogType="website"
            />
            <Header />

            <main className="py-20 lg:py-32">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Page Header */}
                    <header className="text-center mb-16">
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Projects</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Explore our latest work and featured projects
                        </p>
                    </header>

                    {/* Projects Grid */}
                    {projects.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-lg">No projects available yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {paginatedProjects.map((project) => (
                                    <article
                                        key={project._id}
                                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <Link href={`/projects/${project.slug}`}>
                                            {/* Featured Image */}
                                            {project.featuredImage?.url ? (
                                                <div className="aspect-video overflow-hidden">
                                                    <img
                                                        src={getImageSrc(project.featuredImage.url)}
                                                        alt={project.featuredImage.altText || project.title}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                                    <span className="text-gray-400">No image</span>
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="p-6">
                                                {/* Title */}
                                                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                                                    {project.title}
                                                </h2>

                                                {/* Short Description */}
                                                {project.shortDescription && (
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                        {typeof project.shortDescription === 'string'
                                                            ? project.shortDescription.replace(/<[^>]*>/g, '').slice(0, 150) + '...'
                                                            : ''}
                                                    </p>
                                                )}

                                                {/* Meta */}
                                                <div className="flex items-center justify-between text-sm text-gray-500">
                                                    {project.publishedAt && (
                                                        <time dateTime={new Date(project.publishedAt).toISOString()}>
                                                            {new Date(project.publishedAt).toLocaleDateString(undefined, {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </time>
                                                    )}
                                                    <span className="text-blue-600 font-medium">View Project →</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </article>
                                ))}
                            </div>

                            {projects.length > 0 && (
                                <nav className="mt-14 flex flex-col items-center justify-center gap-3" aria-label="Projects pagination">
                                    <div className="text-sm text-gray-500">Page {Math.min(Math.max(1, currentPage), totalPages)} of {totalPages}</div>
                                    <div className="flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPage(currentPage - 1)}
                                        disabled={currentPage <= 1}
                                        className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Prev
                                    </button>

                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const pageNum = i + 1;
                                        const isActive = pageNum === Math.min(Math.max(1, currentPage), totalPages);
                                        return (
                                            <button
                                                key={pageNum}
                                                type="button"
                                                onClick={() => setPage(pageNum)}
                                                className={
                                                    isActive
                                                        ? 'px-4 py-2 rounded-lg border text-sm font-medium bg-blue-600 text-white border-blue-600'
                                                        : 'px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50'
                                                }
                                                aria-current={isActive ? 'page' : undefined}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        type="button"
                                        onClick={() => setPage(currentPage + 1)}
                                        disabled={currentPage >= totalPages}
                                        className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                    </div>
                                </nav>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function ProjectsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <ProjectsPageContent />
        </Suspense>
    );
}
