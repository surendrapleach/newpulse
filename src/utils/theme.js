/**
 * Heritage Pulse Design System
 * 
 * Defines the core color palette, spacing, and typography constants
 * to ensure consistency across the application.
 */

export const PALETTE = {
    background: '#F9F7F2', // Warm Parchment
    primary: '#EB6A00',    // Heritage Orange
    secondary: '#FF8D28',  // Lighter Orange for gradients
    text: '#1A1A1A',       // Dark Charcoal
    border: '#E0E0E0',
    success: '#4CAF50',
    error: '#F44336',
    white: '#FFFFFF',
    black: '#000000',
    splashGradientStart: '#FFD166',
    splashGradientEnd: '#FFF9FB',

    // Dark specifics (Pure Emerald & White)
    darkBackground: '#003409ff',
    darkSurface: '#266330',    // Raised Emerald for cards
    darkText: '#FFFFFF',       // Pure White
    darkSecondaryText: '#B2C2B5', // Silver-Mint
    darkBorder: '#3D8246',     // Emerald Boundary
};

export const LIGHT_THEME = {
    background: PALETTE.background,
    primary: PALETTE.primary,
    secondary: PALETTE.secondary,
    text: PALETTE.text,
    secondaryText: PALETTE.black,
    cardBg: PALETTE.white,
    border: PALETTE.border,
    icon: PALETTE.text,
    error: PALETTE.error,
    white: PALETTE.white,
    black: PALETTE.black,
    splashGradientStart: PALETTE.splashGradientStart,
    splashGradientEnd: PALETTE.splashGradientEnd,
    success: PALETTE.success,
};

export const DARK_THEME = {
    background: PALETTE.darkBackground,
    primary: PALETTE.white,   // Interactive elements now White
    secondary: '#327A3D',     // Subtler green accent
    text: PALETTE.darkText,
    secondaryText: PALETTE.darkSecondaryText,
    cardBg: PALETTE.darkSurface,
    border: PALETTE.darkBorder,
    icon: PALETTE.white,      // Icons now White
    error: PALETTE.error,
    white: PALETTE.white,
    black: PALETTE.black,
    splashGradientStart: PALETTE.splashGradientStart,
    splashGradientEnd: PALETTE.splashGradientEnd,
    success: PALETTE.success,
};

// Default export for backward compatibility
export const COLORS = LIGHT_THEME;

export const SPACING = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
};

export const SIZES = {
    iconSmall: 16,
    iconMedium: 24,
    iconLarge: 32,
    borderRadius: 12,
    borderRadiusLarge: 16,
    borderRadiusPill: 30,
};
