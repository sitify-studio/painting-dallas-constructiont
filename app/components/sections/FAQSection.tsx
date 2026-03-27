'use client';

import React, { useState } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { Plus, Minus } from 'lucide-react';

interface FAQSectionProps {
    faqSection: Page['faqSection'];
    className?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqSection, className }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const themeColors = useThemeColors();
    const themeFonts = useThemeFonts();

    if (!faqSection?.enabled || !faqSection.items || faqSection.items.length === 0) return null;

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section
            className={cn('py-24 lg:py-32 overflow-hidden', className)}
            style={{ backgroundColor: themeColors.pageBackground }}
        >
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
                    
                    {/* Left Column: Editorial Header */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32">
                            <div className="mb-6 flex items-center gap-3">
                                <span 
                                    className="text-[10px] tracking-[0.4em] uppercase font-bold"
                                    style={{ color: themeColors.lightPrimaryText }}
                                >
                                    Common Enquiries
                                </span>
                                <div className="w-12 h-[1px]" style={{ backgroundColor: `${themeColors.primaryButton}40` }} />
                            </div>

                            {faqSection.title && (
                                <h2
                                    className="text-5xl lg:text-7xl leading-tight"
                                    style={{ 
                                        color: themeColors.lightPrimaryText 
                                    }}
                                >
                                    <TiptapRenderer content={faqSection.title} />
                                </h2>
                            )}

                            {faqSection.description && (
                                <div
                                    className="mt-8 max-w-sm text-lg font-light leading-relaxed opacity-70"
                                    style={{ 
                                        color: themeColors.lightSecondaryText 
                                    }}
                                >
                                    <TiptapRenderer content={faqSection.description} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Minimalist Accordion */}
                    <div className="lg:col-span-7">
                        <div className="space-y-0">
                            {faqSection.items.map((item, index) => {
                                const isOpen = openIndex === index;
                                return (
                                    <div
                                        key={index}
                                        className="border-b transition-all duration-500"
                                        style={{ borderColor: `${themeColors.inactive}30` }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggle(index)}
                                            className="w-full flex items-center justify-between py-8 text-left group"
                                        >
                                            <div className="flex items-start gap-6">
                                                <span 
                                                    className="text-[10px] mt-2 font-bold tracking-tighter opacity-30 group-hover:opacity-100 transition-opacity"
                                                    style={{ color: themeColors.lightPrimaryText }}
                                                >
                                                    {(index + 1).toString().padStart(2, '0')}
                                                </span>
                                                <div
                                                    className={cn(
                                                        "text-xl lg:text-2xl transition-all duration-300",
                                                        isOpen ? "italic" : ""
                                                    )}
                                                    style={{ 
                                                        color: themeColors.lightPrimaryText 
                                                    }}
                                                >
                                                    <TiptapRenderer content={item.question} as="inline" />
                                                </div>
                                            </div>

                                            <div 
                                                className="shrink-0 ml-4 transition-transform duration-500"
                                                style={{ color: themeColors.lightPrimaryText }}
                                            >
                                                {isOpen ? <Minus strokeWidth={1.5} size={20} /> : <Plus strokeWidth={1.5} size={20} />}
                                            </div>
                                        </button>

                                        <div
                                            className={cn(
                                                "grid transition-all duration-500 ease-in-out",
                                                isOpen ? "grid-rows-[1fr] pb-8 opacity-100" : "grid-rows-[0fr] opacity-0"
                                            )}
                                        >
                                            <div className="overflow-hidden">
                                                <div
                                                    className="pl-12 lg:pl-16 text-base lg:text-lg font-light leading-relaxed opacity-70 max-w-2xl"
                                                    style={{ 
                                                        color: themeColors.lightSecondaryText 
                                                    }}
                                                >
                                                    <TiptapRenderer content={item.answer} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;