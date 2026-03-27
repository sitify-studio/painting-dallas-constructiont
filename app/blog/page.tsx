'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { blogApi } from '@/app/lib/api';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { BlogPost } from '@/app/lib/types';
import { getImageSrc } from '@/app/lib/utils';
import { SeoHead } from '@/app/components/ui/SeoHead';
import { truncate } from '@/app/lib/seo';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/app/lib/utils';

function BlogPageContent() {
    const { site, loading: siteLoading } = useWebBuilder();
    const themeColors = useThemeColors();
    const themeFonts = useThemeFonts();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const pageSize = 9;

    const currentPage = useMemo(() => {
        const raw = searchParams?.get('page');
        const parsed = raw ? Number.parseInt(raw, 10) : 1;
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    }, [searchParams]);

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(posts.length / pageSize));
    }, [posts.length]);

    const paginatedPosts = useMemo(() => {
        const safePage = Math.min(Math.max(1, currentPage), totalPages);
        const start = (safePage - 1) * pageSize;
        return posts.slice(start, start + pageSize);
    }, [posts, currentPage, totalPages]);

    const setPage = (nextPage: number) => {
        const clamped = Math.min(Math.max(1, nextPage), totalPages);
        const params = new URLSearchParams(searchParams?.toString() || '');
        if (clamped <= 1) {
            params.delete('page');
        } else {
            params.set('page', String(clamped));
        }
        const qs = params.toString();
        router.push(qs ? `/blog?${qs}` : '/blog');
    };

    const shouldShowAuthor = (name: string | undefined | null) => {
        if (!name) return false;
        return !name.toLowerCase().includes('admin');
    };

    useEffect(() => {
        async function loadPosts() {
            if (!site) return;

            try {
                setLoading(true);
                const data = await blogApi.getPostsBySite(site.slug);
                // Filter only published posts
                const publishedPosts = data.filter(post => post.status === 'published');
                setPosts(publishedPosts);
                setError(null);
            } catch (err: unknown) {
                console.error('Failed to load blog posts:', err);
                const message = err instanceof Error ? err.message : 'Failed to load blog posts';
                setError(message);
            } finally {
                setLoading(false);
            }
        }

        if (!siteLoading) {
            loadPosts();
        }
    }, [site, siteLoading]);

    if (siteLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.pageBackground }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: themeColors.primaryButton }}></div>
                    <p style={{ color: themeColors.secondaryText }}>Loading blog posts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.pageBackground }}>
                <div className="text-center">
                    <h2 className="font-semibold mb-2" style={{ color: themeColors.lightPrimaryText }}>Error Loading Blog</h2>
                    <p style={{ color: themeColors.lightSecondaryText }}>{error}</p>
                </div>
            </div>
        );
    }

    const siteName = site?.business?.name || site?.name || 'Web Builder Site';
    const seoTitle = `Blog | ${siteName}`;
    const seoDescription = truncate(site?.seo?.description || site?.business?.description || 'Read our latest articles and updates.', 160);

    return (
        <div className="min-h-screen" style={{ backgroundColor: themeColors.pageBackground }}>
            <SeoHead
                title={seoTitle}
                description={seoDescription}
                canonicalPath="/blog"
                ogType="website"
            />
            <Header />

            <main className="pt-32 pb-16 lg:pt-40 lg:pb-24">
                <div className="container mx-auto px-6 lg:px-12">
                    {/* Editorial Header */}
                    <header className="text-center mb-16 lg:mb-24">
                        <div className="mb-6 flex items-center justify-center gap-3">
                            <span 
                                className="text-[10px] tracking-[0.4em] uppercase font-bold"
                                style={{ color: themeColors.primaryButton, fontFamily: themeFonts.body }}
                            >
                                Blog
                            </span>
                            <div className="w-12 h-[1px]" style={{ backgroundColor: `${themeColors.primaryButton}40` }} />
                        </div>
                        <h1 
                            className="text-4xl lg:text-5xl font-serif leading-tight mb-6"
                            style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.heading }}
                        >
                            Latest Insights
                        </h1>
                        <p 
                            className="text-lg font-light leading-relaxed opacity-70 max-w-2xl mx-auto"
                            style={{ color: themeColors.lightSecondaryText, fontFamily: themeFonts.body }}
                        >
                            News, tips, and insights from our team
                        </p>
                    </header>

                    {/* Blog Posts Grid - Editorial Masonry Style */}
                    {posts.length === 0 ? (
                        <div className="text-center py-16">
                            <p style={{ color: themeColors.lightSecondaryText }} className="text-lg">No blog posts available yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                                {paginatedPosts.map((post, idx) => (
                                    <article
                                        key={post._id}
                                        className={cn(
                                            "group relative flex flex-col",
                                            idx % 3 === 1 && "lg:mt-12" // Staggered effect
                                        )}
                                    >
                                        <Link href={`/blog/${post.slug}`} className="block overflow-hidden relative aspect-[4/5] rounded-sm bg-gray-100">
                                            {/* Featured Image with slow zoom on hover */}
                                            {post.featuredImage ? (
                                                <img
                                                    src={getImageSrc(post.featuredImage.url)}
                                                    alt={post.featuredImage.altText || post.title}
                                                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${themeColors.secondaryText}10` }}>
                                                    <span style={{ color: themeColors.secondaryText }} className="text-sm">No Image</span>
                                                </div>
                                            )}
                                            
                                            {/* Subtle Gradient Overlay */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                                                style={{ background: `linear-gradient(to top, ${themeColors.darkPrimaryText}20, transparent)` }}
                                            />
                                            
                                            {/* Floating Action Button */}
                                            <div className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-xl" 
                                                style={{ backgroundColor: `${themeColors.pageBackground}CC`, backdropFilter: 'blur(8px)' }}
                                            >
                                                <ArrowUpRight className="w-5 h-5" style={{ color: themeColors.primaryButton }} />
                                            </div>

                                            {/* Category Badge */}
                                            {post.categories && post.categories.length > 0 && (
                                                <div className="absolute top-6 left-6">
                                                    <span 
                                                        className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider"
                                                        style={{ 
                                                            backgroundColor: `${themeColors.pageBackground}CC`,
                                                            color: themeColors.primaryButton,
                                                            backdropFilter: 'blur(8px)',
                                                            fontFamily: themeFonts.body
                                                        }}
                                                    >
                                                        {post.categories[0]}
                                                    </span>
                                                </div>
                                            )}
                                        </Link>

                                        {/* Content Underlay */}
                                        <div className="mt-8">
                                            <div className="flex items-center justify-between mb-4">
                                                <h2
                                                    className="text-2xl lg:text-3xl font-serif leading-tight line-clamp-2 group-hover:underline transition-all"
                                                    style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.heading }}
                                                >
                                                    {post.title}
                                                </h2>
                                                <span 
                                                    className="text-[10px] tracking-widest uppercase opacity-40 font-bold"
                                                    style={{ fontFamily: themeFonts.body }}
                                                >
                                                    Read
                                                </span>
                                            </div>
                                            
                                            {/* Excerpt */}
                                            {post.excerpt && (
                                                <div
                                                    className="text-base font-light leading-relaxed opacity-60 max-w-md mb-4"
                                                    style={{ color: themeColors.lightSecondaryText, fontFamily: themeFonts.body }}
                                                >
                                                    {typeof post.excerpt === 'string'
                                                        ? post.excerpt.replace(/<[^>]*>/g, '').slice(0, 120) + '...'
                                                        : ''}
                                                </div>
                                            )}

                                            {/* Meta Info */}
                                            <div className="flex items-center gap-4 text-sm" style={{ color: themeColors.secondaryText }}>
                                                {post.publishedAt && (
                                                    <time dateTime={new Date(post.publishedAt).toISOString()}>
                                                        {new Date(post.publishedAt).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </time>
                                                )}
                                                {post.author && shouldShowAuthor(post.author.name) && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{post.author.name}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Pagination - Editorial Style */}
                            {posts.length > 0 && (
                                <nav className="mt-20 flex flex-col items-center justify-center gap-6" aria-label="Blog pagination">
                                    <div 
                                        className="text-sm font-medium"
                                        style={{ color: themeColors.secondaryText, fontFamily: themeFonts.body }}
                                    >
                                        Page {Math.min(Math.max(1, currentPage), totalPages)} of {totalPages}
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setPage(currentPage - 1)}
                                            disabled={currentPage <= 1}
                                            className="px-6 py-3 rounded-full border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            style={{ 
                                                borderColor: `${themeColors.secondaryText}20`,
                                                color: themeColors.lightPrimaryText,
                                                fontFamily: themeFonts.body
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!e.currentTarget.disabled) {
                                                    e.currentTarget.style.backgroundColor = themeColors.darkPrimaryText;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            Previous
                                        </button>

                                        {Array.from({ length: totalPages }).map((_, i) => {
                                            const pageNum = i + 1;
                                            const isActive = pageNum === Math.min(Math.max(1, currentPage), totalPages);
                                            return (
                                                <button
                                                    key={pageNum}
                                                    type="button"
                                                    onClick={() => setPage(pageNum)}
                                                    className="px-4 py-3 rounded-full text-sm font-medium transition-all"
                                                    style={{
                                                        fontFamily: themeFonts.body,
                                                        backgroundColor: isActive ? themeColors.darkPrimaryText : 'transparent',
                                                        color: themeColors.lightPrimaryText,
                                                        border: `1px solid ${themeColors.secondaryText}20`
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!isActive) {
                                                            e.currentTarget.style.backgroundColor = themeColors.darkPrimaryText;
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!isActive) {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                        }
                                                    }}
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
                                            className="px-6 py-3 rounded-full border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            style={{ 
                                                borderColor: `${themeColors.secondaryText}20`,
                                                color: themeColors.lightPrimaryText,
                                                fontFamily: themeFonts.body
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!e.currentTarget.disabled) {
                                                    e.currentTarget.style.backgroundColor = themeColors.darkPrimaryText;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
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

export default function BlogPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <BlogPageContent />
        </Suspense>
    );
}
