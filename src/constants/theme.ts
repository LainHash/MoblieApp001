/**
 * Artisan Kitchen Design System
 * Based on templates/artisan_kitchen/DESIGN.md
 */

import '@/global.css';

import { Platform } from 'react-native';

export const ArtisanColors = {
  primary: '#ad2c00',
  primaryContainer: '#d34011',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#fffbff',
  primaryFixed: '#ffdbd1',
  primaryFixedDim: '#ffb5a0',
  onPrimaryFixed: '#3b0900',
  
  secondary: '#675c58',
  secondaryContainer: '#ecddd8',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#6b605c',
  secondaryFixed: '#eedfda',
  secondaryFixedDim: '#d2c4bf',
  onSecondaryFixed: '#211a17',

  tertiary: '#006947',
  tertiaryContainer: '#00855b',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#f5fff6',
  tertiaryFixed: '#6ffbbe',
  tertiaryFixedDim: '#4edea3',
  onTertiaryFixed: '#002113',

  background: '#fbf9f6',
  surface: '#fbf9f6',
  surfaceDim: '#dbdad7',
  surfaceBright: '#fbf9f6',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f5f3f0',
  surfaceContainer: '#efeeeb',
  surfaceContainerHigh: '#eae8e5',
  surfaceContainerHighest: '#e4e2df',
  surfaceVariant: '#e4e2df',

  onSurface: '#1b1c1a',
  onSurfaceVariant: '#5a413a',
  inverseSurface: '#30312f',
  inverseOnSurface: '#f2f0ed',

  outline: '#8f7068',
  outlineVariant: '#e3beb5',

  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  darkRoast: '#2B2320',
  darkCard: '#1A1412',
} as const;

export const Colors = {
  light: {
    text: ArtisanColors.onSurface,
    textSecondary: ArtisanColors.secondary,
    background: ArtisanColors.background,
    backgroundElement: ArtisanColors.surfaceContainerLow,
    backgroundSelected: ArtisanColors.secondaryContainer,
    primary: ArtisanColors.primary,
    card: ArtisanColors.surfaceContainerLowest,
    border: ArtisanColors.surfaceContainerHighest,
  },
  dark: {
    text: ArtisanColors.inverseOnSurface,
    textSecondary: ArtisanColors.secondaryFixedDim,
    background: ArtisanColors.inverseSurface,
    backgroundElement: '#252624',
    backgroundSelected: '#3b3c3a',
    primary: ArtisanColors.primaryFixedDim,
    card: '#222321',
    border: '#3c3d3b',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'Plus Jakarta Sans',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Plus Jakarta Sans',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "'Plus Jakarta Sans', var(--font-display)",
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 520;

