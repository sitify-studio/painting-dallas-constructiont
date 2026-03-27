'use client';

import React from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { CardLoader } from '@/app/components/ui/SkeletonLoader';
import { ArrowUpRight } from 'lucide-react';

interface BlogSectionProps {
    blogSection: Page['blogSection'];
    className?: string;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blogSection, className }) => {
    if (!blogSection?.enabled) return null;

    const themeColors = useThemeColors();
    const themeFonts = useThemeFonts();
    const { blogPosts, loading } = useWebBuilder();
    const displayPosts = blogPosts.slice(0, blogSection.postsToShow || 3);

    if (loading && blogPosts.length === 0) {
        return (
            <section className={cn('py-24', className)} style={{ backgroundColor: themeColors.pageBackground }}>
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[1, 2, 3].map((i) => <CardLoader key={i} />)}
                    </div>
                </div>
            </section>
        );
    }

    return (
        /* The outer div ensures the background starts from the very top for the Navbar */
        <div style={{ backgroundColor: themeColors.pageBackground }}>
            <section 
                className={cn('pt-32 pb-24 lg:pt-48 lg:pb-32', className)} 
                style={{ backgroundColor: themeColors.pageBackground }}
            >
                <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
                    {/* Editorial Header */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
                        <div className="max-w-2xl">
                            <span 
                                className="text-[10px] tracking-[0.4em] uppercase font-bold opacity-60 block mb-6"
                                style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.body }}
                            >
                                Journal & News
                            </span>
                            {blogSection.title && (
                                <h2
                                    className="text-4xl lg:text-6xl font-semibold tracking-tight"
                                    style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.heading }}
                                >
                                    <TiptapRenderer content={blogSection.title} />
                                </h2>
                            )}
                        </div>
                        {blogSection.description && (
                            <div
                                className="lg:max-w-sm text-lg opacity-70"
                                style={{ color: themeColors.lightSecondaryText, fontFamily: themeFonts.body }}
                            >
                                <TiptapRenderer content={blogSection.description} />
                            </div>
                        )}
                    </div>

                    {/* Refined Blog Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {displayPosts.map((post) => (
                            <article 
                                key={post._id} 
                                className="group flex flex-col h-full"
                            >
                                {/* Image Container with Reveal Effect */}
                                <a 
                                    href={`/blog/${post.slug}`}
                                    className="relative aspect-[4/5] mb-8 overflow-hidden rounded-[2rem] block"
                                >
                                    {post.featuredImage && (
                                        <img
                                            src={getImageSrc(post.featuredImage.url || (post.featuredImage as any))}
                                            alt={post.featuredImage.altText || post.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <ArrowUpRight style={{ color: themeColors.primaryButton }} />
                                        </div>
                                    </div>
                                </a>

                                {/* Meta Info */}
                                <div className="flex items-center gap-4 mb-4">
                                    {blogSection.showDate && post.publishedAt && (
                                        <time
                                            className="text-[10px] tracking-widest uppercase font-bold opacity-50"
                                            style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.body }}
                                        >
                                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </time>
                                    )}
                                    <div className="h-px flex-grow" style={{ backgroundColor: `${themeColors.inactive}30` }} />
                                </div>

                                {/* Title & Excerpt */}
                                <h3
                                    className="text-2xl font-semibold mb-4 group-hover:italic transition-all duration-300"
                                    style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.heading }}
                                >
                                    <a href={`/blog/${post.slug}`}>
                                        {post.title}
                                    </a>
                                </h3>

                                {blogSection.showExcerpt && post.excerpt && (
                                    <div
                                        className="text-base opacity-70 line-clamp-2 mb-6"
                                        style={{ color: themeColors.lightSecondaryText, fontFamily: themeFonts.body }}
                                    >
                                        <TiptapRenderer content={post.excerpt} />
                                    </div>
                                )}

                                {/* Footer: Author */}
                                <div className="mt-auto pt-6 flex items-center justify-between border-t" style={{ borderColor: `${themeColors.inactive}20` }}>
                                    {post.author && (
                                        <div className="flex items-center gap-3">
                                            {post.author.avatar && (
                                                <img
                                                    src={getImageSrc(post.author.avatar)}
                                                    alt={post.author.name}
                                                    className="w-6 h-6 rounded-full grayscale"
                                                />
                                            )}
                                            <span
                                                className="text-xs font-medium opacity-60"
                                                style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.body }}
                                            >
                                                By {post.author.name}
                                            </span>
                                        </div>
                                    )}
                                    <a
                                        href={`/blog/${post.slug}`}
                                        className="text-xs font-bold uppercase tracking-widest group-hover:underline"
                                        style={{ color: themeColors.primaryButton, fontFamily: themeFonts.body }}
                                    >
                                        Read Post
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};