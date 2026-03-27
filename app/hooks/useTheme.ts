'use client';

import { useWebBuilder } from '@/app/providers/WebBuilderProvider';

export interface ThemeColors {
  // Text colors
  mainText: string;
  secondaryText: string;
  darkPrimaryText: string;
  darkSecondaryText: string;
  lightPrimaryText: string;
  lightSecondaryText: string;
  // Background colors
  pageBackground: string;
  sectionBackground: string;
  sectionBackgroundLight: string;
  sectionBackgroundDark: string;
  cardBackground: string;
  cardBackgroundLight: string;
  cardBackgroundDark: string;
  // Button/UI colors
  primaryButton: string;
  primaryButtonLight: string;
  primaryButtonDark: string;
  hoverActive: string;
  hoverActiveLight: string;
  hoverActiveDark: string;
  inactive: string;
  inactiveLight: string;
  inactiveDark: string;

}

export interface ThemeFonts {
  heading?: string;
  body?: string;
}

export function useThemeColors(): ThemeColors {
  const { site } = useWebBuilder();
  const theme = site?.theme;

  return {
    // Text colors - prefer new light/dark variants, fallback to legacy
    mainText: theme?.mainTextColor || '#1F2937',
    secondaryText: theme?.secondaryTextColor || '#6B7280',
    // For dark backgrounds - use light text
    darkPrimaryText: theme?.darkPrimaryColor || '#FFFFFF',
    darkSecondaryText: theme?.darkSecondaryColor || '#D1D5DB',
    // For light backgrounds - use dark text
    lightPrimaryText: theme?.lightPrimaryColor || '#1F2937',
    lightSecondaryText: theme?.lightSecondaryColor || '#6B7280',
    // Background colors
    pageBackground: theme?.pageBackgroundColor || '#FFFFFF',
    sectionBackground: theme?.sectionBackgroundColorLight || '#F9FAFB',
    sectionBackgroundLight: theme?.sectionBackgroundColorLight || '#F9FAFB',
    sectionBackgroundDark: theme?.sectionBackgroundColorDark || '#111827',
    cardBackground: theme?.cardBackgroundColorLight || '#FFFFFF',
    cardBackgroundLight: theme?.cardBackgroundColorLight || '#FFFFFF',
    cardBackgroundDark: theme?.cardBackgroundColorDark || '#1F2937',
    // Button/UI colors
    primaryButton: theme?.primaryButtonColorDark || '#3B82F6',
    primaryButtonLight: theme?.primaryButtonColorLight || '#60A5FA',
    primaryButtonDark: theme?.primaryButtonColorDark || '#3B82F6',
    hoverActive: theme?.hoverActiveColorDark || '#2563EB',
    hoverActiveLight: theme?.hoverActiveColorLight || '#3B82F6',
    hoverActiveDark: theme?.hoverActiveColorDark || '#2563EB',
    inactive: theme?.inactiveColorDark || '#9CA3AF',
    inactiveLight: theme?.inactiveColorLight || '#D1D5DB',
    inactiveDark: theme?.inactiveColorDark || '#6B7280',
  
  };
}

export function useThemeFonts(): ThemeFonts {
  const { site } = useWebBuilder();
  return {
    heading: site?.theme?.headingFont,
    body: site?.theme?.bodyFont,
  };
}
