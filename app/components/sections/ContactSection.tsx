'use client';

import React, { useState, useEffect } from 'react';
import { Page, SiteBusinessHours, BusinessHours } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { cn } from '@/app/lib/utils';
import { Mail, Phone, MapPin, ArrowUpRight, Clock } from 'lucide-react';

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
};

interface ContactSectionProps {
  contactSection: Page['contactSection'];
  className?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ contactSection, className }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCurrentlyOpen, setIsCurrentlyOpen] = useState(false);

  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();
  const { site } = useWebBuilder();

  const businessHours = site?.business?.businessHours;

  useEffect(() => {
    if (!businessHours?.isEnabled) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [businessHours?.isEnabled]);

  useEffect(() => {
    if (!businessHours?.isEnabled || !businessHours?.hours) return;

    const now = currentTime;
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTimeStr = now.toTimeString().slice(0, 5);

    const todayHours = businessHours.hours.find(h => h.day === currentDay);
    
    if (todayHours && todayHours.isOpen) {
      if (todayHours.is24Hours) {
        setIsCurrentlyOpen(true);
      } else if (todayHours.timeRanges && todayHours.timeRanges.length > 0) {
        const isOpen = todayHours.timeRanges.some(range => {
          return currentTimeStr >= range.openTime && currentTimeStr <= range.closeTime;
        });
        setIsCurrentlyOpen(isOpen);
      } else {
        setIsCurrentlyOpen(false);
      }
    } else {
      setIsCurrentlyOpen(false);
    }
  }, [currentTime, businessHours]);

  const formatTime = (time: string) => {
    if (!time) return '';
    if (businessHours?.displayFormat === '12h') {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    }
    return time;
  };

  const formatDayHours = (dayHours: BusinessHours) => {
    if (!dayHours.isOpen) return 'Closed';
    if (dayHours.is24Hours) return '24 Hours';
    if (dayHours.timeRanges && dayHours.timeRanges.length > 0) {
      return dayHours.timeRanges.map(range => 
        `${formatTime(range.openTime)} - ${formatTime(range.closeTime)}`
      ).join(', ');
    }
    return '';
  };

  const getCurrentStatus = () => {
    if (!businessHours?.isEnabled) return null;
    if (businessHours.is24_7) return { status: 'Open 24/7', color: 'text-green-600', bgColor: 'bg-green-100' };
    return isCurrentlyOpen 
      ? { status: 'Open Now', color: 'text-green-600', bgColor: 'bg-green-100' }
      : { status: 'Closed', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const status = getCurrentStatus();
  const currentDay = currentTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  if (!contactSection?.enabled) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          siteId: site?._id,
          subject: 'Contact Form Submission from Website'
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSubmitMessage('✅ Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitMessage(`❌ ${result.error || 'Failed to send message. Please try again.'}`);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitMessage('❌ Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section 
      className={cn('py-20 lg:py-28', className)} 
      style={{ backgroundColor: themeColors.pageBackground }}
    >
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="mb-16">
          <span 
            className="text-sm uppercase tracking-widest font-medium"
            style={{ color: themeColors.primaryButton }}
          >
            Location
          </span>
          <h2 
            className="text-4xl md:text-5xl font-semibold mt-4"
            style={{ color: themeColors.lightPrimaryText }}
          >
            <TiptapRenderer content={contactSection.title} />
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {/* Left Column: Info & Form */}
          <div className="flex flex-col gap-8 lg:col-span-1">
         

            {/* Contact Form Container */}
            <div 
              className="p-6 rounded-[1.5rem] shadow-sm border flex flex-col h-full"
              style={{ backgroundColor: themeColors.sectionBackground, borderColor: `${themeColors.inactive}33` }}
            >
              <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
              <form onSubmit={handleSubmit} className="space-y-4 flex-grow flex flex-col">
                <div className="space-y-4">
                  <input
                    name="name"
                    placeholder="Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white/50 border-b py-2 px-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                  <input
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/50 border-b py-2 px-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/50 border-b py-2 px-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
                <textarea
                  name="message"
                  placeholder="Your Message..."
                  rows={3}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-white/50 border-b py-2 px-3 text-sm focus:outline-none focus:border-black transition-colors resize-none flex-grow"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.01] mt-auto"
                  style={{ backgroundColor: themeColors.primaryButton, color: themeColors.pageBackground }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
              {submitMessage && <p className="mt-3 text-center text-xs font-medium">{submitMessage}</p>}
            </div>
          </div>

          {/* Middle Column: Map */}
          <div className="lg:col-span-1 h-full">
            {contactSection.showMap && site?.business?.coordinates && (
              <div className="h-full w-full rounded-[1.5rem] overflow-hidden shadow-lg border-4 border-white min-h-[400px]">
                <iframe
                  title="Office Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${site.business.coordinates.latitude},${site.business.coordinates.longitude}&z=15&output=embed`}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Right Column: Business Hours */}
          <div className="lg:col-span-1 h-full">
            {businessHours?.isEnabled && (
              <div 
                className="p-6 rounded-[1.5rem] border shadow-sm h-full flex flex-col"
                style={{ backgroundColor: themeColors.sectionBackground, borderColor: `${themeColors.inactive}33` }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-black/5">
                      <Clock size={18} />
                    </div>
                    <h3 className="text-lg font-semibold">Hours</h3>
                  </div>
                  {status && (
                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", status.bgColor, status.color)}>
                      {status.status}
                    </span>
                  )}
                </div>

                <div className="space-y-2 flex-grow">
                  {businessHours.hours.map((dayHours) => {
                    const isToday = dayHours.day === currentDay;
                    return (
                      <div 
                        key={dayHours.day}
                        className={cn(
                          "flex items-center justify-between py-2 px-3 rounded-lg transition-colors",
                          isToday ? "bg-white shadow-sm border" : "opacity-70"
                        )}
                        style={isToday ? { borderColor: `${themeColors.primaryButton}33` } : {}}
                      >
                        <span className={cn("text-xs font-medium", isToday && "font-bold")}>
                          {DAY_LABELS[dayHours.day]}
                        </span>
                        <span className={cn("text-[11px]", isToday && "font-medium")}>
                          {formatDayHours(dayHours)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {businessHours.timezone && (
                  <p className="mt-4 text-[10px] opacity-40 text-center italic mt-auto">
                    Timezone: {businessHours.timezone}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};