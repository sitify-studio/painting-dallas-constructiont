'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { blogApi } from '@/app/lib/api';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { BlogPost } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { SeoHead } from '@/app/components/ui/SeoHead';
import { normalizeSeoImage, tiptapToText, truncate } from '@/app/lib/seo';

export default function BlogPostPage() {
    const params = useParams();
    const postSlug = params.postSlug as string;
    const { site, loading: siteLoading } = useWebBuilder();

    const [post, setPost] = useState<BlogPost | null>(null);
    const [otherPosts, setOtherPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const themeColors = useThemeColors();
    const themeFonts = useThemeFonts();

    useEffect(() => {
        async function loadPost() {
            if (!site) return;

            try {
                setLoading(true);
                // Load current post
                const postData = await blogApi.getPostBySlug(site.slug, postSlug);
                setPost(postData);

                // Load other published posts for sidebar (exclude current)
                const allPosts = await blogApi.getPostsBySite(site.slug);
                const filtered = allPosts
                    .filter(p => p.status === 'published' && p.slug !== postSlug)
                    .slice(0, 5);
                setOtherPosts(filtered);

                setError(null);
            } catch (err: any) {
                console.error('Failed to load blog post:', err);
                setError(err.message || 'Failed to load blog post');
            } finally {
                setLoading(false);
            }
        }

        if (!siteLoading) {
            loadPost();
        }
    }, [site, postSlug, siteLoading]);

    if (siteLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading post...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-red-800 font-semibold mb-2">Error Loading Post</h2>
                    <p className="text-red-600">{error || 'Post not found'}</p>
                </div>
            </div>
        );
    }

    const siteName = site?.business?.name || site?.name || 'Web Builder Site';
    const seoTitleBase = post.seo?.title || post.title;
    const seoTitle = `${seoTitleBase} | ${siteName}`;
    const fallbackDesc = truncate(
        post.seo?.description ||
        tiptapToText(post.excerpt) ||
        tiptapToText(post.content),
        160
    );
    const seoDescription = truncate(post.seo?.description || fallbackDesc, 160);
    const ogImage =
        normalizeSeoImage(post.seo?.ogImageUrl || undefined, post.title) ||
        normalizeSeoImage(post.featuredImage?.url, post.featuredImage?.altText || post.title);

    return (
        <div className="min-h-screen bg-gray-50">
            <SeoHead
                title={seoTitle}
                description={seoDescription}
                canonicalPath={`/blog/${post.slug}`}
                ogType="article"
                ogImage={ogImage}
            />
            <Header />

            <main className="pt-32 pb-12 lg:pt-40 lg:pb-16">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Blog Title Section */}
                    <header className="text-center mb-8">
                        <h1 
                            className="text-4xl lg:text-5xl font-bold mb-6 leading-tight"
                            style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.heading }}
                        >
                            {post.title}
                        </h1>

                        {/* Date Only */}
                        {post.publishedAt && (
                            <div className="text-center">
                                <time 
                                    dateTime={new Date(post.publishedAt).toISOString()} 
                                    style={{ color: themeColors.lightSecondaryText }}
                                >
                                    {new Date(post.publishedAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                            </div>
                        )}

                        {/* Categories */}
                        {post.categories && post.categories.length > 0 && (
                            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                                {post.categories.map(category => (
                                    <span 
                                        key={category} 
                                        className="px-4 py-1.5 rounded-full text-sm font-medium"
                                        style={{ 
                                            backgroundColor: `${themeColors.primaryButton}15`,
                                            color: themeColors.primaryButton
                                        }}
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    {/* Hero Image */}
                    {post.featuredImage && (
                        <div className="mb-12 text-center">
                            <img
                                src={getImageSrc(post.featuredImage.url)}
                                alt={post.featuredImage.altText || post.title}
                                className="w-full max-w-4xl mx-auto h-auto max-h-[500px] object-cover rounded-2xl shadow-xl"
                            />
                        </div>
                    )}

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Left Side - Main Content */}
                        <article className="lg:col-span-2">
                            <div 
                                className="rounded-2xl shadow-sm p-8 lg:p-12"
                                style={{ backgroundColor: themeColors.pageBackground }}
                            >
                                {/* Content */}
                                <div 
                                    className="prose prose-lg max-w-none"
                                    style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.body }}
                                >
                                    {post.content ? (
                                        <TiptapRenderer content={post.content} />
                                    ) : post.excerpt ? (
                                        <TiptapRenderer content={post.excerpt} />
                                    ) : null}
                                </div>

                                {/* Tags */}
                                {post.tags && post.tags.length > 0 && (
                                    <div 
                                        className="mt-12 pt-8 border-t"
                                        style={{ borderColor: `${themeColors.secondaryText}20` }}
                                    >
                                        <span 
                                            className="text-sm font-semibold uppercase mr-3"
                                            style={{ color: themeColors.secondaryText }}
                                        >
                                            Tags:
                                        </span>
                                        <div className="inline-flex gap-2 flex-wrap mt-2">
                                            {post.tags.map(tag => (
                                                <span 
                                                    key={tag} 
                                                    className="px-3 py-1 rounded-full text-sm transition-colors cursor-pointer hover:opacity-80"
                                                    style={{
                                                        backgroundColor: `${themeColors.secondaryText}15`,
                                                        color: themeColors.secondaryText
                                                    }}
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </article>

                        {/* Right Side - Sticky Sidebar */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-8 space-y-6">
                                {/* Other Blogs Box */}
                                <div 
                                    className="rounded-xl shadow-sm p-6"
                                    style={{ backgroundColor: themeColors.pageBackground }}
                                >
                                    <h3 
                                        className="text-lg font-bold mb-4 pb-3 border-b"
                                        style={{ 
                                            color: themeColors.lightPrimaryText,
                                            borderColor: `${themeColors.secondaryText}15`,
                                            fontFamily: themeFonts.heading
                                        }}
                                    >
                                        Other Articles
                                    </h3>
                                    {otherPosts.length === 0 ? (
                                        <p style={{ color: themeColors.secondaryText }}>No other articles available.</p>
                                    ) : (
                                        <ul className="space-y-4">
                                            {otherPosts.map(otherPost => (
                                                <li key={otherPost._id}>
                                                    <Link 
                                                        href={`/blog/${otherPost.slug}`}
                                                        className="group block"
                                                    >
                                                        <div className="flex gap-3">
                                                            {otherPost.featuredImage && (
                                                                <img
                                                                    src={getImageSrc(otherPost.featuredImage.url)}
                                                                    alt={otherPost.title}
                                                                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform"
                                                                />
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <h4 
                                                                    className="text-sm font-semibold line-clamp-2 transition-colors"
                                                                    style={{ 
                                                                        color: themeColors.lightPrimaryText,
                                                                        fontFamily: themeFonts.body
                                                                    }}
                                                                >
                                                                    {otherPost.title}
                                                                </h4>
                                                                {otherPost.publishedAt && (
                                                                    <p 
                                                                        className="text-xs mt-1"
                                                                        style={{ color: themeColors.lightSecondaryText }}
                                                                    >
                                                                        {new Date(otherPost.publishedAt).toLocaleDateString(undefined, {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            year: 'numeric'
                                                                        })}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <Link 
                                        href="/blog"
                                        className="inline-block mt-4 text-sm font-medium transition-colors hover:opacity-80"
                                        style={{ color: themeColors.primaryButton }}
                                    >
                                        View all articles →
                                    </Link>
                                </div>

                                {/* Contact Box */}
                                <div 
                                    className="rounded-xl shadow-md p-6"
                                    style={{ backgroundColor: themeColors.primaryButton }}
                                >
                                    <h3 
                                        className="text-lg font-bold mb-3"
                                        style={{ 
                                            color: themeColors.darkPrimaryText,
                                            fontFamily: themeFonts.heading
                                        }}
                                    >
                                        Need Help?
                                    </h3>
                                    <p 
                                        className="text-sm mb-5 leading-relaxed"
                                        style={{ color: `${themeColors.darkPrimaryText}CC` }}
                                    >
                                        Have questions or need assistance? Our team is here to help you with any inquiries.
                                    </p>
                                    <Link 
                                        href="/contact"
                                        className="inline-flex items-center justify-center w-full font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm hover:opacity-90"
                                        style={{ 
                                            backgroundColor: themeColors.pageBackground,
                                            color: themeColors.primaryButton,
                                            fontFamily: themeFonts.body
                                        }}
                                    >
                                        Contact Us
                                    </Link>
                                </div>

                                {/* Tags Cloud (if post has many tags) */}
                                {post.tags && post.tags.length > 0 && (
                                    <div 
                                        className="rounded-xl shadow-sm p-6"
                                        style={{ backgroundColor: themeColors.pageBackground }}
                                    >
                                        <h3 
                                            className="text-lg font-bold mb-4"
                                            style={{ 
                                                color: themeColors.lightPrimaryText,
                                                fontFamily: themeFonts.heading
                                            }}
                                        >
                                            Popular Tags
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {post.tags.map(tag => (
                                                <span 
                                                    key={tag} 
                                                    className="px-3 py-1.5 rounded-full text-sm transition-colors cursor-pointer hover:opacity-80"
                                                    style={{
                                                        backgroundColor: `${themeColors.secondaryText}15`,
                                                        color: themeColors.secondaryText
                                                    }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
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
