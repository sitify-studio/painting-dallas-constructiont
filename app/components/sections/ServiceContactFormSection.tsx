'use client';

import React, { useState } from 'react';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { cn } from '@/app/lib/utils';

interface ServiceContactFormSectionProps {
    service: any;
}

export const ServiceContactFormSection: React.FC<ServiceContactFormSectionProps> = ({ service }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    if (!service.contactForm?.enabled) return null;

    const themeColors = useThemeColors();
    const themeFonts = useThemeFonts();
    const { site } = useWebBuilder();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    siteId: site?._id,
                    serviceId: service._id,
                    subject: `Service Inquiry: ${service.name || 'Service Contact Form'}`,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitMessage('✅ Thank you for your message! We will get back to you soon.');
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                setSubmitMessage(`❌ ${result.error || 'Failed to send message. Please try again.'}`);
            }
        } catch (error) {
            console.error('Service contact form error:', error);
            setSubmitMessage('❌ Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <section
            className="py-16 lg:py-24"
            style={{ backgroundColor: themeColors.sectionBackground }}
        >
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div
                        className="rounded-3xl px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16"
                        style={{ backgroundColor: themeColors.pageBackground }}
                    >
                        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
                            <div>
                                <div className="space-y-2">
                                    <div
                                        className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.02] tracking-tight uppercase"
                                        style={{ color: themeColors.lightPrimaryText }}
                                    >
                                        Get a
                                    </div>
                                    <div
                                        className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.02] tracking-tight uppercase"
                                        style={{ color: themeColors.lightSecondaryText }}
                                    >
                                        Free Quote
                                    </div>
                                </div>

                                <p
                                    className="mt-6 text-base sm:text-lg max-w-xl"
                                    style={{ color: themeColors.lightSecondaryText }}
                                >
                                    Fill out the form and we&apos;ll get back to you shortly about our {service.name} services.
                                </p>

                                {site && (
                                    <div className="mt-10 space-y-4">
                                        {site.business?.email && (
                                            <a
                                                href={`mailto:${site.business.email}`}
                                                className="block hover:underline"
                                                style={{ color: themeColors.lightPrimaryText }}
                                            >
                                                {site.business.email}
                                            </a>
                                        )}

                                        {site.business?.phone && (
                                            <a
                                                href={`tel:${site.business.phone}`}
                                                className="block hover:underline"
                                                style={{ color: themeColors.lightPrimaryText }}
                                            >
                                                {site.business.phone}
                                            </a>
                                        )}

                                        {site.business?.address && (
                                            <div
                                                className="text-sm sm:text-base"
                                                style={{ color: themeColors.lightSecondaryText }}
                                            >
                                                {site.business.address.street}<br />
                                                {site.business.address.city}, {site.business.address.state} {site.business.address.zipCode}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <form onSubmit={handleSubmit} className="space-y-7">
                                    <div>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-transparent px-0 pb-3 outline-none border-b"
                                            placeholder="Enter your full name"
                                            style={{
                                                borderColor: `${themeColors.inactive}66`,
                                                color: themeColors.lightPrimaryText,
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = themeColors.hoverActive;
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = `${themeColors.inactive}66`;
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-transparent px-0 pb-3 outline-none border-b"
                                            placeholder="Enter your e-mail"
                                            style={{
                                                borderColor: `${themeColors.inactive}66`,
                                                color: themeColors.lightPrimaryText,
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = themeColors.hoverActive;
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = `${themeColors.inactive}66`;
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-transparent px-0 pb-3 outline-none border-b"
                                            placeholder="Enter your WhatsApp number"
                                            style={{
                                                borderColor: `${themeColors.inactive}66`,
                                                color: themeColors.lightPrimaryText,
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = themeColors.hoverActive;
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = `${themeColors.inactive}66`;
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={3}
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full bg-transparent px-0 pb-3 outline-none border-b resize-none"
                                            placeholder="Tell us about your project"
                                            style={{
                                                borderColor: `${themeColors.inactive}66`,
                                                color: themeColors.lightPrimaryText,
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = themeColors.hoverActive;
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = `${themeColors.inactive}66`;
                                            }}
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-3.5 px-6 rounded-full font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{
                                                backgroundColor: themeColors.primaryButton,
                                                color: themeColors.pageBackground,
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = themeColors.hoverActive;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = themeColors.primaryButton;
                                            }}
                                        >
                                            {isSubmitting ? 'Sending...' : 'Send request'}
                                        </button>
                                    </div>

                                    {submitMessage && (
                                        <div
                                            className="pt-2 text-sm"
                                            style={{
                                                color: submitMessage.includes('Thank you') ? themeColors.lightPrimaryText : themeColors.lightSecondaryText,
                                            }}
                                        >
                                            {submitMessage}
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
